import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  type Points,
  ShaderMaterial,
  Vector3,
} from "three";
import { MeshSurfaceSampler } from "three-stdlib";
import { quality } from "../../core/device";
import type { DissolveUniforms } from "../materials/dissolve";
import { simplexNoise } from "../shaders/noise";
import { stage } from "../stageClock";

const vertex = /* glsl */ `
uniform float uProgress;
uniform float uNoiseScale;
uniform float uEdgeWidth;
uniform float uOvershoot;
uniform float uDrift;
uniform float uTime;
uniform float uSize;
uniform vec3 uUp;
attribute vec3 aRandom;
varying float vLife;
varying float vRandom;
${simplexNoise}

void main() {
  vec3 p = position;
  float n = dissolvePattern(p * uNoiseScale);
  float threshold = uProgress * (1.0 + uEdgeWidth * 2.0) - uEdgeWidth;
  // Each grain leaves the surface the moment the burn front passes it
  float life = clamp((threshold - n) / 0.5 + uOvershoot, 0.0, 1.0);
  life *= step(0.0001, uProgress);

  vec3 swirlP = p * uNoiseScale * 0.6 + vec3(0.0, 0.0, uTime * 0.15);
  vec3 swirl = vec3(snoise(swirlP), snoise(swirlP + 17.3), snoise(swirlP + 41.7));
  vec3 scatter = (aRandom - 0.5) * 2.0;
  float ease = life * life * (3.0 - 2.0 * life);
  p += (uUp * (ease * 1.1 + life * 0.25) + scatter * ease * 0.55 + swirl * ease * 0.45) * uDrift;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.35 + aRandom.x) * (1.0 - life * 0.55) / -mv.z;
  vLife = life;
  vRandom = aRandom.y;
}
`;

const fragment = /* glsl */ `
uniform vec3 uEdgeColor;
uniform vec3 uAshColor;
varying float vLife;
varying float vRandom;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5 || vLife <= 0.0) discard;
  float soft = smoothstep(0.5, 0.0, d);
  float alpha = smoothstep(0.0, 0.03, vLife) * (1.0 - smoothstep(0.45, 1.0, vLife));
  // Hot embers cool into grey ash as they drift
  float heat = pow(1.0 - vLife, 2.2) * (0.6 + vRandom * 0.8);
  vec3 col = mix(uAshColor, uEdgeColor * 4.0, heat);
  gl_FragColor = vec4(col * soft * alpha, 1.0);
}
`;

interface AshProps {
  meshes: Mesh[];
  uniforms: DissolveUniforms;
  /** Geometry-space height of the model, used to scale drift distance */
  driftRef: MutableRefObject<number>;
  up?: [number, number, number];
  /** Fraction of the device's ash budget */
  density?: number;
  /** Drift distance as a fraction of the model height */
  drift?: number;
}

/**
 * Ash/embers sampled on the model surface. Uses the same noise as the dissolve
 * material, so every grain detaches exactly where — and when — the mesh burns.
 */
export function Ash({ meshes, uniforms, driftRef, up = [0, 0, 1], density = 1, drift = 1 }: AshProps) {
  const geometry = useMemo(() => {
    const total = Math.round(quality.ash * density);
    const triCounts = meshes.map((m) => (m.geometry.index?.count ?? m.geometry.attributes.position.count) / 3);
    const triTotal = triCounts.reduce((a, b) => a + b, 0);
    const positions = new Float32Array(total * 3);
    const randoms = new Float32Array(total * 3);
    const v = new Vector3();
    let offset = 0;
    meshes.forEach((mesh, i) => {
      const count = i === meshes.length - 1 ? total - offset : Math.round((triCounts[i] / triTotal) * total);
      const source = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry;
      const sampler = new MeshSurfaceSampler(new Mesh(source)).build();
      for (let k = 0; k < count; k++) {
        sampler.sample(v);
        positions.set([v.x, v.y, v.z], (offset + k) * 3);
        randoms.set([Math.random(), Math.random(), Math.random()], (offset + k) * 3);
      }
      offset += count;
    });
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(positions, 3));
    g.setAttribute("aRandom", new BufferAttribute(randoms, 3));
    return g;
  }, [meshes, density]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uProgress: uniforms.uProgress,
          uNoiseScale: uniforms.uNoiseScale,
          uEdgeWidth: uniforms.uEdgeWidth,
          uEdgeColor: uniforms.uEdgeColor,
          uOvershoot: { value: 0 },
          uDrift: { value: 1 },
          uTime: { value: 0 },
          uSize: { value: 22 },
          uUp: { value: new Vector3(...up) },
          uAshColor: { value: new Color("#4a4440") },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uniforms],
  );

  const points = useRef<Points>(null);

  useFrame(({ gl }) => {
    const p = uniforms.uProgress.value;
    // Nothing is airborne when the model is whole or fully gone: skip the draw
    if (points.current) points.current.visible = p > 0.0001 && p < 0.999;
    material.uniforms.uTime.value = stage.time;
    // Once the mesh is gone, push lingering grains to the end of their life
    // (reaches 1 at full dissolve, so nothing lingers where the model stood)
    material.uniforms.uOvershoot.value = Math.max(0, (p - 0.75) / 0.25);
    material.uniforms.uDrift.value = driftRef.current * drift;
    material.uniforms.uSize.value = 26 * gl.getPixelRatio();
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
