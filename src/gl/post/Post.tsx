import { EffectComposer } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { BloomEffect } from "postprocessing";
import { Color, type Vector3 } from "three";
import { quality } from "../../core/device";
import { director, getState } from "../../core/director";
import * as shots from "../../core/timeline";
import { stage } from "../stageClock";
import { SithEffect } from "./SithEffect";

const tmp: number[] = [0, 0, 0];
const ACCENTS = shots.ACT_ACCENTS.map((hex) => new Color(hex));

/** Bloom for the HDR sabers/edges, then the Sith grade does everything else. */
export function Post() {
  const sith = useMemo(() => new SithEffect(), []);
  const bloom = useMemo(
    () => new BloomEffect({ mipmapBlur: true, luminanceThreshold: 0.9, luminanceSmoothing: 0.15, intensity: 1.1, radius: 0.75 }),
    [],
  );

  useFrame(({ size }) => {
    const t = stage.t;
    shots.sampleVec(shots.grade.tint, t, tmp);
    (sith.u("uTint").value as Vector3).fromArray(tmp);
    sith.u("uSaturation").value = shots.sample(shots.grade.saturation, t);
    sith.u("uExposure").value = shots.sample(shots.grade.exposure, t);
    sith.u("uDuality").value = shots.sample(shots.grade.duality, t);
    const split = shots.sample(shots.grade.split, t) + director.splitOffset;
    sith.u("uSplit").value = Math.min(0.97, Math.max(0.03, split));
    sith.u("uHeat").value = shots.sample(shots.grade.heat, t);
    sith.u("uTime").value = stage.time;
    sith.u("uVelocity").value = director.velocity;
    sith.u("uRewind").value = director.rewind;
    sith.u("uFlash").value = director.flash;
    sith.u("uAspect").value = size.width / size.height;
    // The frame itself breathes with the respirator
    sith.u("uVignette").value = 0.8 + director.breath * 0.14;
    bloom.intensity = shots.sample(shots.grade.bloom, t);
    sith.u("uWarp").value = director.warp;
    if (director.warp > 0) (sith.u("uWarpColor").value as Color).copy(ACCENTS[getState().act]);
  });

  // MSAA on desktop only: thin cape/armor silhouettes were stair-stepping
  return (
    <EffectComposer multisampling={quality.msaa} enableNormalPass={false}>
      <primitive object={bloom} />
      <primitive object={sith} />
    </EffectComposer>
  );
}
