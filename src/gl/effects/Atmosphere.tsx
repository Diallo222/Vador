import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, ShaderMaterial } from "three";
import { quality } from "../../core/device";
import * as shots from "../../core/timeline";
import { stage } from "../stageClock";

const BOUNDS = { x: 16, y: 7, z: 12, yMin: -0.2, zOffset: -3 };

const vertex = /* glsl */ `
uniform float uRise;
uniform float uSwirl;
uniform float uTime;
uniform float uSize;
attribute vec4 aSeed;
varying float vTwinkle;
varying float vDepthFade;

void main() {
  vec3 p = position;
  // Vertical drift (wraps), per-particle speed
  p.y = mod(p.y + uRise * (0.4 + aSeed.x), ${BOUNDS.y.toFixed(1)}) + ${BOUNDS.yMin.toFixed(1)};
  // Force swirl: orbit the vertical axis, faster near the center
  float r = length(p.xz) + 0.001;
  float a = atan(p.z, p.x) + uSwirl * (0.6 + aSeed.y) / (0.6 + r * 0.25);
  p.xz = vec2(cos(a), sin(a)) * r;
  // Small wander
  p += vec3(sin(uTime * 0.6 + aSeed.z * 30.0), cos(uTime * 0.5 + aSeed.w * 20.0), sin(uTime * 0.4 + aSeed.x * 10.0)) * 0.06;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.4 + aSeed.w * 1.2) / -mv.z;
  vTwinkle = 0.55 + 0.45 * sin(uTime * (1.5 + aSeed.y * 3.0) + aSeed.z * 40.0);
  // Fade at the vertical wrap edges so particles never pop
  float h = (p.y - ${BOUNDS.yMin.toFixed(1)}) / ${BOUNDS.y.toFixed(1)};
  vDepthFade = smoothstep(0.0, 0.08, h) * (1.0 - smoothstep(0.85, 1.0, h));
}
`;

const fragment = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vTwinkle;
varying float vDepthFade;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float glow = pow(1.0 - d * 2.0, 2.2);
  gl_FragColor = vec4(uColor * glow * vTwinkle * vDepthFade * uOpacity, 1.0);
}
`;

const tmp: number[] = [0, 0, 0];

/** Ambient motes whose color + motion change per act: sand, Force, embers, ash. */
export function Atmosphere() {
  const geometry = useMemo(() => {
    const n = quality.atmosphere;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * BOUNDS.x;
      pos[i * 3 + 1] = Math.random() * BOUNDS.y;
      pos[i * 3 + 2] = (Math.random() - 0.5) * BOUNDS.z + BOUNDS.zOffset;
      for (let k = 0; k < 4; k++) seed[i * 4 + k] = Math.random();
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new BufferAttribute(seed, 4));
    return g;
  }, []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uRise: { value: 0 },
          uSwirl: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: 30 },
          uColor: { value: new Color() },
          uOpacity: { value: 0.5 },
        },
      }),
    [],
  );

  useFrame(({ gl }) => {
    const t = stage.t;
    const u = material.uniforms;
    u.uRise.value = stage.risePhase;
    u.uSwirl.value = stage.swirlPhase;
    u.uTime.value = stage.time;
    u.uSize.value = 34 * gl.getPixelRatio();
    shots.sampleVec(shots.mood.particle, t, tmp);
    (u.uColor.value as Color).fromArray(tmp).multiplyScalar(1.25);
    u.uOpacity.value = shots.sample(shots.mood.particleOpacity, t);
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
