import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  Color,
  DoubleSide,
  MeshBasicMaterial,
  type Group,
  type Mesh,
  type MeshPhysicalMaterial,
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
import { Ash } from "../effects/Ash";

type GLTFResult = GLTF & {
  nodes: Record<
    | "rfl_clone_mesh_shadow002_0"
    | "rfl_clone_mesh_shadow002_1"
    | "anakinsl_body0_model0_0"
    | "anakinsl_body0_model0_1"
    | "anakinsl_body1_model0_0",
    Mesh
  >;
  materials: {
    "rfl_clone_mat.002": MeshStandardMaterial;
    head: MeshStandardMaterial;
    body: MeshStandardMaterial;
    t_hero_jedi_darthvader_cape_c: MeshStandardMaterial;
  };
};

export const ANAKIN_HEIGHT = 1.86;
const bladeColor = new Color("#5cc8ff").multiplyScalar(6);

export function Anakin() {
  const { nodes, materials } = useGLTF(MODELS.anakin, DRACO) as GLTFResult;
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const fit = useRef<Group>(null);
  const shadow = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);
  const uniforms = useMemo(() => createDissolveUniforms(), []);
  const bladeMaterial = useMemo(() => new MeshBasicMaterial({ color: bladeColor, toneMapped: false }), []);
  const bodyMeshes = useMemo(
    () => [nodes.anakinsl_body0_model0_0, nodes.anakinsl_body0_model0_1, nodes.anakinsl_body1_model0_0],
    [nodes],
  );
  const geometryHeight = useRef(1);

  useLayoutEffect(() => {
    const polish = (mat: MeshStandardMaterial, roughness: number, metalness: number, env: number) => {
      mat.roughness = roughness;
      mat.metalness = metalness;
      mat.envMapIntensity = env;
      const coat = mat as MeshPhysicalMaterial;
      if (coat.isMeshPhysicalMaterial) coat.clearcoatRoughness = Math.max(coat.clearcoatRoughness, 0.4);
      applyDissolve(mat, uniforms);
    };
    // Skin and leather stay dielectric: metalness is what made them read as plastic
    polish(materials.head, 0.62, 0, 0.55);
    polish(materials.body, 0.58, 0.04, 0.75);
    polish(materials.t_hero_jedi_darthvader_cape_c, 0.88, 0, 0.45);
    materials.t_hero_jedi_darthvader_cape_c.side = DoubleSide;
    polish(materials["rfl_clone_mat.002"], 0.3, 0.85, 1.2);
    applyDissolve(bladeMaterial, uniforms);
    if (!fit.current) return;
    const scale = fitToHeight(fit.current, ANAKIN_HEIGHT, "bottom");
    uniforms.uNoiseScale.value = 2.4 * scale;
    geometryHeight.current = ANAKIN_HEIGHT / scale;
  }, [materials, uniforms, bladeMaterial]);

  useActor(shots.anakin, uniforms, { root, body, shadow });

  useFrame(() => {
    if (light.current) light.current.intensity = (1 - uniforms.uProgress.value) * 2.2;
  });

  return (
    <group ref={root} dispose={null}>
      <group ref={fit}>
        <group ref={body} rotation={[-Math.PI / 2, 0, 0]}>
          <group position={[-3.923, 14.653, 28.255]} scale={27.661} userData={{ noBounds: true }}>
            <mesh geometry={nodes.rfl_clone_mesh_shadow002_0.geometry} material={materials["rfl_clone_mat.002"]} />
            <mesh geometry={nodes.rfl_clone_mesh_shadow002_1.geometry} material={bladeMaterial} />
          </group>
          <mesh geometry={nodes.anakinsl_body0_model0_0.geometry} material={materials.head} />
          <mesh geometry={nodes.anakinsl_body0_model0_1.geometry} material={materials.body} />
          <mesh geometry={nodes.anakinsl_body1_model0_0.geometry} material={materials.t_hero_jedi_darthvader_cape_c} />
          {/* Forms out of Force motes, burns away into embers */}
          <Ash meshes={bodyMeshes} uniforms={uniforms} driftRef={geometryHeight} up={[0, 0, 1]} density={0.7} drift={0.7} />
        </group>
      </group>
      <pointLight ref={light} position={[0.3, 1.1, 0.35]} color="#5cc8ff" distance={2.2} decay={2} />
      <BlobShadow ref={shadow} size={1.5} />
    </group>
  );
}

useGLTF.preload(MODELS.anakin, DRACO);
