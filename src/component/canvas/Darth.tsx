import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { Color, type Mesh, type MeshStandardMaterial } from "three";
import type { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    DARTH_Sabel_vit_0: Mesh;
    DARTH_darthvader_VaderConsolesFlickermat_0: Mesh;
    DARTH_darthvader_VaderCapemat_0: Mesh;
    DARTH_darthvader_VaderHelmetRimmat_0: Mesh;
    DARTH_darthvader_VaderBodyArmourmat_0: Mesh;
    DARTH_Laser_0: Mesh;
    DARTH_Sabel_svart_0: Mesh;
  };
  materials: {
    Sabel_vit: MeshStandardMaterial;
    darthvader_VaderConsolesFlickermat: MeshStandardMaterial;
    darthvader_VaderCapemat: MeshStandardMaterial;
    darthvader_VaderHelmetRimmat: MeshStandardMaterial;
    darthvader_VaderBodyArmourmat: MeshStandardMaterial;
    Laser: MeshStandardMaterial;
  };
};

type GroupProps = ThreeElements["group"];

/** Crimson blade — bloom-friendly, not neon-washed */
const saberColor = new Color("#b11226").multiplyScalar(4.5);

export function Darth(props: GroupProps) {
  const { nodes, materials } = useGLTF(
    "/darth_vader_by_makeamo.glb",
  ) as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.DARTH_Sabel_vit_0.geometry}
        material={materials.Sabel_vit}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.DARTH_darthvader_VaderConsolesFlickermat_0.geometry}
        material={materials.darthvader_VaderConsolesFlickermat}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.DARTH_darthvader_VaderCapemat_0.geometry}
        material={materials.darthvader_VaderCapemat}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.DARTH_darthvader_VaderHelmetRimmat_0.geometry}
        material={materials.darthvader_VaderHelmetRimmat}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.DARTH_darthvader_VaderBodyArmourmat_0.geometry}
        material={materials.darthvader_VaderBodyArmourmat}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.DARTH_Laser_0.geometry}
        material={materials.Laser}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.DARTH_Sabel_svart_0.geometry}
      >
        <meshBasicMaterial color={saberColor} toneMapped={false} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/darth_vader_by_makeamo.glb");
