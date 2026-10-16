import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import * as shots from "../../core/timeline";
import type { DissolveUniforms } from "../materials/dissolve";
import { stage } from "../stageClock";

type Tracks = Pick<typeof shots.anakin, "position" | "rotationY" | "dissolve" | "edge">;

const tmp: number[] = [0, 0, 0];

/** Drives a full-body actor from its shot-list tracks every frame. */
export function useActor(
  tracks: Tracks,
  uniforms: DissolveUniforms,
  refs: { root: RefObject<Group>; body: RefObject<Group>; shadow: RefObject<Mesh> },
) {
  useFrame(() => {
    const t = stage.t;
    const root = refs.root.current;
    if (!root) return;
    shots.sampleVec(tracks.position, t, tmp);
    root.position.set(tmp[0], tmp[1], tmp[2]);
    root.rotation.y = shots.sample(tracks.rotationY, t);

    const dissolve = shots.sample(tracks.dissolve, t);
    uniforms.uProgress.value = dissolve;
    shots.sampleVec(tracks.edge, t, tmp);
    uniforms.uEdgeColor.value.fromArray(tmp);
    root.visible = dissolve < 0.999;

    const shadow = refs.shadow.current;
    if (shadow) (shadow.material as MeshBasicMaterial).opacity = (1 - dissolve) * 0.85;
  });
}
