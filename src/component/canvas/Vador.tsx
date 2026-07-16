import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import type { Mesh, MeshStandardMaterial } from "three";
import type { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Object_2: Mesh;
    Object_3: Mesh;
    Object_4: Mesh;
    Object_5: Mesh;
    Object_6: Mesh;
  };
  materials: {
    blinn2SG: MeshStandardMaterial;
  };
};

type GroupProps = ThreeElements["group"];

export function Vador(props: GroupProps) {
  const { nodes, materials } = useGLTF("/vador.glb") as GLTFResult;

  useLayoutEffect(() => {
    const mat = materials.blinn2SG;
    mat.roughness = 0.45;
    mat.metalness = 0.65;
    mat.envMapIntensity = 0.8;
    mat.needsUpdate = true;
  }, [materials]);

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
          material={materials.blinn2SG}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_3.geometry}
          material={materials.blinn2SG}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials.blinn2SG}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_5.geometry}
          material={materials.blinn2SG}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_6.geometry}
          material={materials.blinn2SG}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/vador.glb");
