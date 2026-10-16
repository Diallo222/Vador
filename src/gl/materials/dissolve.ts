import { Color, type Material, type IUniform } from "three";
import { simplexNoise } from "../shaders/noise";

export interface DissolveUniforms {
  [uniform: string]: IUniform;
  uProgress: IUniform<number>;
  uEdgeColor: IUniform<Color>;
  uNoiseScale: IUniform<number>;
  uEdgeWidth: IUniform<number>;
  uEdgeIntensity: IUniform<number>;
}

export function createDissolveUniforms(noiseScale = 1): DissolveUniforms {
  return {
    uProgress: { value: 0 },
    uEdgeColor: { value: new Color("#ff5a1f") },
    uNoiseScale: { value: noiseScale },
    uEdgeWidth: { value: 0.085 },
    uEdgeIntensity: { value: 9 },
  };
}

/**
 * Injects a noise-threshold dissolve into any built-in material:
 * fragments below the threshold are discarded, a band above it burns with an
 * HDR edge (picked up by bloom), and a wider band is charred dark.
 */
export function applyDissolve(material: Material, uniforms: DissolveUniforms) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uNoiseScale;
        varying vec3 vDissolvePos;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vDissolvePos = position * uNoiseScale;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uProgress;
        uniform vec3 uEdgeColor;
        uniform float uEdgeWidth;
        uniform float uEdgeIntensity;
        varying vec3 vDissolvePos;
        ${simplexNoise}`,
      )
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
        float dEdge = 0.0;
        float dChar = 0.0;
        // Uniform branch: intact meshes skip the noise entirely
        if (uProgress > 0.0001) {
          float dNoise = dissolvePattern(vDissolvePos);
          float dThreshold = uProgress * (1.0 + uEdgeWidth * 2.0) - uEdgeWidth;
          if (dNoise < dThreshold) discard;
          dEdge = 1.0 - smoothstep(dThreshold, dThreshold + uEdgeWidth, dNoise);
          dChar = 1.0 - smoothstep(dThreshold, dThreshold + uEdgeWidth * 3.0, dNoise);
        }`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        diffuseColor.rgb *= mix(1.0, 0.08, dChar);`,
      )
      .replace(
        "#include <opaque_fragment>",
        `#include <opaque_fragment>
        gl_FragColor.rgb += uEdgeColor * pow(dEdge, 1.5) * uEdgeIntensity;`,
      );
  };
  material.customProgramCacheKey = () => "dissolve";
  material.needsUpdate = true;
}
