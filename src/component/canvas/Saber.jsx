import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Saber(props) {
  const { nodes, materials } = useGLTF("/lightSaber.glb");
  return (
    <group {...props} dispose={null}>
      <group
        position={[-0.619, 218.016, 5.507]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["Darth_Vader_Hilt_02_-_Default_0"].geometry}
          material={materials["02_-_Default"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["Darth_Vader_Hilt_07_-_Default_0"].geometry}
          material={materials["07_-_Default"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["Darth_Vader_Hilt_13_-_Default_0"].geometry}
          material={materials["13_-_Default"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["Darth_Vader_Blade_15_-_Default_0"].geometry}
          material={materials["15_-_Default"]}
          position={[0, -0.246, -86.361]}
          scale={[0.509, 0.509, 1.146]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/lightSaber.glb");