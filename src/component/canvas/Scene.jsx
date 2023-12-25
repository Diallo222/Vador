import * as THREE from "three";
import React, { Suspense, useRef, useState } from "react";
import { useThree , useFrame } from "@react-three/fiber";
import { motion } from "framer-motion-3d"
import Effects from "./Effect";
import { Vador } from "./Vador";
import { Environment , Lightformer  , useScroll , Sparkles } from "@react-three/drei";
import {editable as e , PerspectiveCamera } from '@theatre/r3f';
import { Darth } from "./Darth";




const Scene =() =>{

  const data = useScroll();
  const [section, setSection] = useState(0);
    const ScalingFactor = Math.min(
        Math.max(window.innerWidth / 1300, 0.8),
        1.2
      );
      const { viewport } = useThree();

      useFrame((state) => {
        let curSection = Math.floor(data.scroll.current * data.pages);
    
        if (curSection > 3) {
          curSection = 3;
        }
    
        if (curSection !== section) {
          setSection(curSection);
        }
    
        // state.camera.position.x = cameraPositionX.get();
        // state.camera.lookAt(cameraLookAtX.get(), 0, 0);
  
      });
    
// console.log('HERERE', section);
  return (
    <>
    <motion.group scale={ScalingFactor}> 
  <motion.mesh
   animate={{
    y : section === 0 ? 0 : 60
  }}
  transition={{
    duration: 0.6,
  }}
  >
    <Vador scale={0.0084} position={[0, -1.3, 0]}/>
  </motion.mesh>
  <motion.mesh
   animate={{
    y : section === 2 ? 0 : viewport.height + 0.5,
    z: section === 2 ? 0 : -400,
  }}
  transition={{
    duration: 0.6,
  }}
  >
    <Darth scale={0.038} position={[-1, -4.5, 0]} />
  </motion.mesh>
    <hemisphereLight intensity={0.5} />
    <Sparkles count={150} opacity={2}  scale={30} size={5} speed={0.4} color={"#7b0303"} />
    <Environment resolution={512} >
        {/* Ceiling */}
        <Lightformer  intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
        <Lightformer intensity={3} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
        <Lightformer intensity={3} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[10, 1, 1]} />
        <Lightformer intensity={3} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[10, 1, 1]} />
        <Lightformer intensity={3} rotation-x={Math.PI / 2} position={[0, 4, 3]} scale={[10, 1, 1]} />
        <Lightformer intensity={3} rotation-x={Math.PI / 2} position={[0, 4, 6]} scale={[10, 1, 1]} />
        <Lightformer intensity={3} rotation-x={Math.PI / 2} position={[0, 4, 9]} scale={[10, 1, 1]} />
        {/* Sides */}
        <Lightformer color="blue" intensity={15} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} />
        <Lightformer color='red' intensity={15} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} />
        {/* Key */}
        <Lightformer form="ring" color="red" intensity={10} scale={3} position={[10, 5, 10]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </Environment>
     </motion.group>
     <Effects />
    </>
  );
}

export default Scene
