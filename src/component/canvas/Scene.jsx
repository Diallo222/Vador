import { Vector3 } from 'three'
import React, { Suspense, useRef, useState } from "react";
import { useThree , useFrame } from "@react-three/fiber";
import { motion } from "framer-motion-3d"
import Effects from "./Effect";
import { Vador } from "./Vador";
import { useScroll , Sparkles  } from "@react-three/drei";
import {editable as e , PerspectiveCamera , useCurrentSheet } from '@theatre/r3f';
import { val } from "@theatre/core";
import { Darth } from "./Darth";
import { Anakin } from './Anakin';

const Scene =() =>{

    const ScalingFactor = Math.min(
        Math.max(window.innerWidth / 1300, 0.8),
        1.2
      );
      const sheet = useCurrentSheet();
      const scroll = useScroll();
      // our callback will run on every animation frame
      useFrame(() => {
        // the length of our sequence
        const sequenceLength = val(sheet.sequence.pointer.length);
        // update the "position" of the playhead in the sequence, as a fraction of its whole length
        sheet.sequence.position = scroll.offset * sequenceLength;
      });
  return (
    <>
<PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        position={[0,0,15]}
        fov={30}
      />
    <motion.group scale={ScalingFactor}> 
    <e.spotLight theatreKey="SpotLight1" position={[0, 10, 16]} angle={0.3} penumbra={1} intensity={4} castShadow shadow-mapSize={2048} />
  <e.mesh theatreKey="Helmet" scale={0.007} position={[0, -1.3, -5]}>
    <Vador receiveShadow castShadow />
  </e.mesh>
<e.group theatreKey='battle'>
<e.mesh theatreKey="Darth" scale={0.0142} rotation={[0,-1.600000000000001,0]} position={[1.4699999999999986, -1.5, -0.2499999999999913]}>
  <Darth receiveShadow castShadow  />
  </e.mesh>
  <e.mesh theatreKey="Anakin" scale={0.042} rotation={[0,1.6500000000000001,0]} position={[-1.3600000000000003, -1.47, 0.3799999999999998]}>
  <Anakin receiveShadow castShadow  />
  </e.mesh>
</e.group>

    <Sparkles count={300} opacity={1}  scale={20} size={5} speed={0.4} color={"#ff0000"} />
      <mesh receiveShadow position={[0, -1.5, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial attach="material" color="#000000" />
      </mesh>
     </motion.group>
     <Effects />
    </>
  );
}


export default Scene
