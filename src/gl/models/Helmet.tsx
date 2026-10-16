import { useGLTF } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, type Group, type Mesh, type MeshPhysicalMaterial, type MeshStandardMaterial } from "three";
import type { GLTF } from "three-stdlib";
import { director } from "../../core/director";
import * as shots from "../../core/timeline";
import { applyDissolve, createDissolveUniforms } from "../materials/dissolve";
import { Ash } from "../effects/Ash";
import { DRACO, MODELS } from "./assets";
import { fitToHeight } from "./fit";
import { stage } from "../stageClock";

type GLTFResult = GLTF & {
  nodes: Record<"Object_2" | "Object_3" | "Object_4" | "Object_5" | "Object_6", Mesh>;
  materials: { blinn2SG: MeshStandardMaterial };
};

const MESHES = ["Object_2", "Object_3", "Object_4", "Object_5", "Object_6"] as const;
export const HELMET_HEIGHT = 1.45;
/** Burn-island density per world unit */
const NOISE_DENSITY = 2.6;

const tmp: number[] = [0, 0, 0];

export function Helmet(props: ThreeElements["group"]) {
  const { nodes, materials } = useGLTF(MODELS.helmet, DRACO) as GLTFResult;
  const root = useRef<Group>(null);
  const fit = useRef<Group>(null);
  const body = useRef<Group>(null);
  const uniforms = useMemo(() => createDissolveUniforms(), []);
  const meshes = useMemo(() => MESHES.map((n) => nodes[n]), [nodes]);
  const geometryHeight = useRef(1);

  useLayoutEffect(() => {
    const mat = materials.blinn2SG;
    mat.color = new Color("#1a1a1c");
    mat.roughness = 0.3;
    mat.metalness = 0.85;
    mat.envMapIntensity = 1.0;
    // The source clearcoat is mirror-sharp: pinpoint highlights bloom into dots
    const coat = mat as MeshPhysicalMaterial;
    if (coat.isMeshPhysicalMaterial) {
      coat.clearcoat = 0.35;
      coat.clearcoatRoughness = 0.4;
    }
    applyDissolve(mat, uniforms);

    if (!fit.current) return;
    const scale = fitToHeight(fit.current, HELMET_HEIGHT, "center");
    uniforms.uNoiseScale.value = NOISE_DENSITY * scale;
    geometryHeight.current = HELMET_HEIGHT / scale;
  }, [materials, uniforms]);

  useFrame(({ clock }) => {
    const t = stage.t;
    const g = root.current;
    if (!g) return;
    shots.sampleVec(shots.helmet.position, t, tmp);
    const breathe = Math.sin(clock.elapsedTime * ((Math.PI * 2) / 4.6)) * 0.025;
    g.position.set(tmp[0], tmp[1] + breathe, tmp[2]);
    // Helmet slowly turns toward the cursor — "it sees you"
    const look = director.pointer.x * 0.45;
    const tilt = -director.pointer.y * 0.18;
    const targetY = shots.sample(shots.helmet.rotationY, t) + look;
    g.rotation.y += (targetY - g.rotation.y) * 0.06;
    g.rotation.x += (tilt - g.rotation.x) * 0.06;

    const dissolve = Math.max(shots.sample(shots.helmet.dissolve, t), director.intro);
    uniforms.uProgress.value = dissolve;
    shots.sampleVec(shots.helmet.edge, t, tmp);
    uniforms.uEdgeColor.value.fromArray(tmp);
    if (body.current) body.current.visible = dissolve < 0.999;
  });

  return (
    <group ref={root} {...props} dispose={null}>
      <group ref={fit}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <group ref={body}>
            {meshes.map((mesh) => (
              <mesh key={mesh.name} geometry={mesh.geometry} material={materials.blinn2SG} />
            ))}
          </group>
          <Ash meshes={meshes} uniforms={uniforms} driftRef={geometryHeight} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODELS.helmet, DRACO);
