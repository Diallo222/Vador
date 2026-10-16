import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  Color,
  MeshBasicMaterial,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  type PointLight,
} from "three";
import type { GLTF } from "three-stdlib";
import * as shots from "../../core/timeline";
import { applyDissolve, createDissolveUniforms } from "../materials/dissolve";
import { DRACO, MODELS } from "./assets";
import { fitToHeight } from "./fit";
import { useActor } from "./useActor";
import { BlobShadow } from "../effects/BlobShadow";
import { stage } from "../stageClock";
import { Hotspots } from "../effects/Hotspots";
import { Ash } from "../effects/Ash";

type NodeName =
  | "DARTH_Sabel_vit_0"
  | "DARTH_darthvader_VaderConsolesFlickermat_0"
  | "DARTH_darthvader_VaderCapemat_0"
  | "DARTH_darthvader_VaderHelmetRimmat_0"
  | "DARTH_darthvader_VaderBodyArmourmat_0"
  | "DARTH_Laser_0"
  | "DARTH_Sabel_svart_0";

type GLTFResult = GLTF & {
  nodes: Record<NodeName, Mesh>;
  materials: Record<string, MeshStandardMaterial>;
};

const BODY: NodeName[] = [
  "DARTH_Sabel_vit_0",
  "DARTH_darthvader_VaderConsolesFlickermat_0",
  "DARTH_darthvader_VaderCapemat_0",
  "DARTH_darthvader_VaderHelmetRimmat_0",
  "DARTH_darthvader_VaderBodyArmourmat_0",
  "DARTH_Laser_0",
];

type Surface = { color?: string; roughness: number; metalness: number; env: number };

const SURFACES: Partial<Record<NodeName, Surface>> = {
  DARTH_darthvader_VaderBodyArmourmat_0: { color: "#0a0a0b", roughness: 0.28, metalness: 0.55, env: 1.25 },
  DARTH_darthvader_VaderHelmetRimmat_0: { color: "#070708", roughness: 0.22, metalness: 0.6, env: 1.3 },
  DARTH_darthvader_VaderCapemat_0: { color: "#050506", roughness: 0.82, metalness: 0, env: 0.45 },
  DARTH_darthvader_VaderConsolesFlickermat_0: { roughness: 0.45, metalness: 0.3, env: 1 },
  DARTH_Sabel_vit_0: { roughness: 0.32, metalness: 0.9, env: 1.2 },
  DARTH_Laser_0: { roughness: 0.4, metalness: 0.4, env: 1 },
};

/** Blade base in geometry units (the blade mesh is vertical) */
const BLADE_BASE = 134.2;
export const VADER_HEIGHT = 2.03;

const bladeColor = new Color("#ff2a2a").multiplyScalar(7);

export function Vader() {
  const { nodes } = useGLTF(MODELS.vader, DRACO) as GLTFResult;
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const fit = useRef<Group>(null);
  const blade = useRef<Group>(null);
  const light = useRef<PointLight>(null);
  const shadow = useRef<Mesh>(null);
  const uniforms = useMemo(() => createDissolveUniforms(), []);
  const bladeMaterial = useMemo(() => new MeshBasicMaterial({ color: bladeColor, toneMapped: false }), []);
  const bodyMeshes = useMemo(() => BODY.map((n) => nodes[n]), [nodes]);
  const geometryHeight = useRef(1);

  useLayoutEffect(() => {
    const seen = new Set<MeshStandardMaterial>();
    BODY.forEach((name) => {
      const mat = nodes[name].material as MeshStandardMaterial;
      if (seen.has(mat)) return;
      seen.add(mat);
      // Lacquered armor, matte cloth, brushed hilt — not one plastic for all
      const look = SURFACES[name];
      if (look) {
        if (look.color) mat.color.set(look.color);
        mat.roughness = look.roughness;
        mat.metalness = look.metalness;
        mat.envMapIntensity = look.env;
      }
      applyDissolve(mat, uniforms);
    });
    applyDissolve(bladeMaterial, uniforms);
    if (!fit.current) return;
    const scale = fitToHeight(fit.current, VADER_HEIGHT, "bottom");
    uniforms.uNoiseScale.value = 2.4 * scale;
    geometryHeight.current = VADER_HEIGHT / scale;
  }, [nodes, uniforms, bladeMaterial]);

  useActor(shots.vader, uniforms, { root, body, shadow });

  useFrame(() => {
    const extend = shots.sample(shots.vader.saber, stage.t);
    if (blade.current) {
      blade.current.scale.y = Math.max(0.0001, extend);
      blade.current.visible = extend > 0.01;
    }
    if (light.current) light.current.intensity = extend * (1 - uniforms.uProgress.value) * 2.4;
  });

  return (
    <group ref={root} dispose={null}>
      <group ref={fit}>
        <group ref={body}>
          {BODY.map((name) => (
            <mesh key={name} geometry={nodes[name].geometry} material={nodes[name].material} />
          ))}
        </group>
        <group ref={blade} position={[0, BLADE_BASE, 0]} userData={{ noBounds: true }}>
          <mesh
            position={[0, -BLADE_BASE, 0]}
            geometry={nodes.DARTH_Sabel_svart_0.geometry}
            material={bladeMaterial}
          />
        </group>
        {/* Redemption: he leaves as rising light */}
        <Ash meshes={bodyMeshes} uniforms={uniforms} driftRef={geometryHeight} up={[0, 1, 0]} density={0.8} drift={0.7} />
      </group>
      <pointLight ref={light} position={[0.25, 1.35, 0.3]} color="#ff2a2a" distance={2.2} decay={2} />
      <BlobShadow ref={shadow} size={1.6} />
      <Hotspots />
    </group>
  );
}

useGLTF.preload(MODELS.vader, DRACO);
