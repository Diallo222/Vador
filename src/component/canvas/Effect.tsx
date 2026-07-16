import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

const chromaticOffset = new Vector2(0.001, 0.001);

const Effects = () => {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.2}
        mipmapBlur
        luminanceSmoothing={0}
        intensity={1.5}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={chromaticOffset}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.01} darkness={0.8} />
    </EffectComposer>
  );
};

export default Effects;
