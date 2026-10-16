import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { BackSide, Color, ShaderMaterial } from "three";
import * as shots from "../../core/timeline";
import { simplexNoise } from "../shaders/noise";
import { stage } from "../stageClock";

const vertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uFog;
uniform float uTime;
varying vec3 vDir;
${simplexNoise}

void main() {
  vec3 d = normalize(vDir);
  // Slow volumetric smoke drifting across the dome
  vec3 p = d * 2.4 + vec3(uTime * 0.02, -uTime * 0.035, 0.0);
  float smoke = snoise(p) * 0.6 + snoise(p * 2.3 + 4.1) * 0.4;
  smoke = smoothstep(-0.35, 0.9, smoke);
  // A glow pooled behind the stage, horizon-ish, fading up and down
  float back = smoothstep(0.2, -1.0, d.z);
  // Dark at the horizon so the floor melts into the void, glow just above it
  float band = exp(-pow((d.y - 0.24) * 2.6, 2.0)) * smoothstep(-0.02, 0.2, d.y);
  float glow = back * band;
  vec3 col = uFog + uColor * (glow * 0.34 + smoke * glow * 0.5 + smoke * 0.03);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

const tmp: number[] = [0, 0, 0];

/** Smoke dome — gives the void depth without ever becoming a "background". */
export function Backdrop() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        side: BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uColor: { value: new Color() },
          uFog: { value: new Color() },
          uTime: { value: 0 },
        },
      }),
    [],
  );

  useFrame(({ scene }) => {
    const t = stage.t;
    shots.sampleVec(shots.mood.backdrop, t, tmp);
    (material.uniforms.uColor.value as Color).fromArray(tmp);
    shots.sampleVec(shots.mood.fog, t, tmp);
    (material.uniforms.uFog.value as Color).fromArray(tmp);
    material.uniforms.uTime.value = stage.time;
    // Keep scene fog + clear color in lockstep with the mood
    if (scene.fog) scene.fog.color.fromArray(tmp);
  });

  return (
    <mesh material={material} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[60, 48, 24]} />
    </mesh>
  );
}
