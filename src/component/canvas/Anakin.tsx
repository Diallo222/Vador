import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import { Color, type Mesh, type MeshStandardMaterial } from "three";
import type { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    rfl_clone_mesh_shadow002_0: Mesh;
    rfl_clone_mesh_shadow002_1: Mesh;
    anakinsl_body0_model0_0: Mesh;
    anakinsl_body0_model0_1: Mesh;
    anakinsl_body1_model0_0: Mesh;
  };
  materials: {
    "rfl_clone_mat.002": MeshStandardMaterial;
    head: MeshStandardMaterial;
    body: MeshStandardMaterial;
    t_hero_jedi_darthvader_cape_c: MeshStandardMaterial;
  };
};

type GroupProps = ThreeElements["group"];

/** Sky-side blade — bloom-friendly */
const saberColor = new Color("#38bdf8").multiplyScalar(5);

export function Anakin(props: GroupProps) {
  const { nodes, materials } = useGLTF("/skywalker.glb") as GLTFResult;

  useLayoutEffect(() => {
    const polish = (
      mat: MeshStandardMaterial,
      opts: { roughness?: number; metalness?: number }
    ) => {
      if (opts.roughness != null) mat.roughness = opts.roughness;
      if (opts.metalness != null) mat.metalness = opts.metalness;
      mat.envMapIntensity = 0.65;
      mat.needsUpdate = true;
    };

    polish(materials.head, { roughness: 0.55, metalness: 0.1 });
    polish(materials.body, { roughness: 0.5, metalness: 0.25 });
    polish(materials.t_hero_jedi_darthvader_cape_c, {
      roughness: 0.85,
      metalness: 0.05,
    });
    polish(materials["rfl_clone_mat.002"], {
      roughness: 0.4,
      metalness: 0.5,
    });
  }, [materials]);

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group position={[-3.923, 14.653, 28.255]} scale={27.661}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.rfl_clone_mesh_shadow002_0.geometry}
            material={materials["rfl_clone_mat.002"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.rfl_clone_mesh_shadow002_1.geometry}
          >
            <meshBasicMaterial color={saberColor} toneMapped={false} />
          </mesh>
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.anakinsl_body0_model0_0.geometry}
          material={materials.head}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.anakinsl_body0_model0_1.geometry}
          material={materials.body}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.anakinsl_body1_model0_0.geometry}
          material={materials.t_hero_jedi_darthvader_cape_c}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/skywalker.glb");
