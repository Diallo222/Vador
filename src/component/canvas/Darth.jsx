import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Color } from "three";
const saberColor = new Color("#ff0404");
saberColor.multiplyScalar(3);
export function Darth(props) {
  const { nodes, materials } = useGLTF("/darth_vader_by_makeamo.glb");
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
        // material={materials.Sabel_svart}
      >
         <meshBasicMaterial color={saberColor} toneMapped={false} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/darth_vader_by_makeamo.glb");