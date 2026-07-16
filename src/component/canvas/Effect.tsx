import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  SMAA,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

/** Subtle CA — sabers remain sharp; filmic fringe only at edges */
const chromaticOffset = new Vector2(0.0006, 0.0006);

/**
 * Filmic Imperial post stack.
 * CSS film-grain stays in App — no duplicate WebGL Noise.
 */
const Effects = () => {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <SMAA />
      <Bloom
        luminanceThreshold={0.85}
        mipmapBlur
        luminanceSmoothing={0.2}
        intensity={0.85}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={chromaticOffset}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.15} darkness={0.75} />
    </EffectComposer>
  );
};

export default Effects;
