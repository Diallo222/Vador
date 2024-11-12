import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Color } from "three";

const saberColor = new Color("#0464ff").multiplyScalar(3);

saberColor.multiplyScalar(2);
export function Anakin(props) {
  const { nodes, materials } = useGLTF("/skywalker.glb");
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
            // material={materials.light}
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
        {/* <mesh
          castShadow
          receiveShadow
          geometry={nodes["������������������_0"].geometry}
          material={materials.Root}
          position={[-7.847, -2.888, 0.244]}
          scale={47.782}
        /> */}
      </group>
    </group>
  );
}

useGLTF.preload("/skywalker.glb");
