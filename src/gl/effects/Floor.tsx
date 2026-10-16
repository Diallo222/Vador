import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { Color, Fog, ShaderMaterial, Vector2, Vector3 } from "three";
import * as shots from "../../core/timeline";
import { simplexNoise } from "../shaders/noise";
import { stage } from "../stageClock";

const vertex = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragment = /* glsl */ `
uniform vec3 uPool;
uniform vec3 uKey;
uniform vec3 uRim;
uniform vec3 uFog;
uniform vec2 uFogRange;
varying vec3 vWorld;
${simplexNoise}

void main() {
  vec3 toEye = cameraPosition - vWorld;
  float dist = length(toEye);
  vec3 V = toEye / dist;

  // Pool of key light under the subject, slightly elongated toward the camera
  vec2 d = vWorld.xz - uPool.xy;
  float pool = exp(-dot(d, d) / (uPool.z * uPool.z));
  // Brushed obsidian: long anisotropic streaks catch the light
  float grain = snoise(vec3(vWorld.x * 0.7, vWorld.z * 7.0, 0.0)) * 0.5 + 0.5;
  // Grazing sheen toward the horizon in the mood color
  float sheen = pow(1.0 - clamp(V.y, 0.0, 1.0), 5.0);

  vec3 col = vec3(0.0045);
  col += uKey * pool * (0.032 + grain * 0.018);
  col += uRim * sheen * 0.05 * (0.7 + grain * 0.6);

  col = mix(col, uFog, smoothstep(uFogRange.x, uFogRange.y, dist));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

const tmp: number[] = [0, 0, 0];
const key = new Vector3();

/**
 * Obsidian stage floor. Unlit on purpose: a lit reflector multiplies the
 * reflection into the albedo, so colored rims turned it into a glowing slab
 * (and cost a second full scene render per frame).
 */
export function Floor() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uPool: { value: new Vector3(0, 0, 2.2) },
          uKey: { value: new Color() },
          uRim: { value: new Color() },
          uFog: { value: new Color() },
          uFogRange: { value: new Vector2(7, 24) },
        },
      }),
    [],
  );

  useFrame(({ scene }) => {
    const t = stage.t;
    const u = material.uniforms;
    shots.sampleVec(shots.camera.target, t, tmp);
    key.set(tmp[0], tmp[2], 2.2);
    (u.uPool.value as Vector3).copy(key);
    shots.sampleVec(shots.mood.key, t, tmp);
    (u.uKey.value as Color).fromArray(tmp);
    shots.sampleVec(shots.mood.rim, t, tmp);
    (u.uRim.value as Color).fromArray(tmp);
    const fog = scene.fog as Fog | null;
    if (fog) {
      (u.uFog.value as Color).copy(fog.color);
      (u.uFogRange.value as Vector2).set(fog.near, fog.far);
    }
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0} renderOrder={-5} material={material}>
      <planeGeometry args={[60, 60]} />
    </mesh>
  );
}
