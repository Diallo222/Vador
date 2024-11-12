import { Sparkles, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { val } from "@theatre/core";
import {
  editable as e,
  PerspectiveCamera,
  useCurrentSheet,
} from "@theatre/r3f";
import { motion } from "framer-motion-3d";
import React from "react";
import { Anakin } from "./Anakin";
import { Darth } from "./Darth";
import Effects from "./Effect";
import { Vador } from "./Vador";

const Scene = () => {
  const ScalingFactor = Math.min(Math.max(window.innerWidth / 1300, 0.8), 1.2);

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
        position={[0, 0, 15]}
        fov={30}
      />
      <motion.group scale={ScalingFactor}>
        <e.spotLight
          theatreKey="SpotLight1"
          position={[0, 10, 16]}
          angle={0.3}
          penumbra={1}
          intensity={4}
          castShadow
          shadow-mapSize={1024}
          shadow-bias={-0.0005}
          // shadow-normalBias={0.05} // Helps prevent acne in some cases
        />
        <e.mesh theatreKey="Helmet" scale={0.007} position={[0, -1.3, -5]}>
          <Vador receiveShadow castShadow />
        </e.mesh>
        <e.group theatreKey="battle">
          <e.mesh
            theatreKey="Darth"
            scale={0.0142}
            rotation={[0, -1.600000000000001, 0]}
            position={[1.4699999999999986, -1.5, -0.2499999999999913]}
          >
            <motion.mesh whileHover={{ rotateY: 0.7 }}>
              <Darth receiveShadow castShadow />
            </motion.mesh>
          </e.mesh>
          <e.mesh
            theatreKey="Anakin"
            scale={0.042}
            rotation={[0, 1.6500000000000001, 0]}
            position={[-1.3600000000000003, -1.47, 0.3799999999999998]}
          >
            <motion.mesh whileHover={{ rotateY: -0.5 }}>
              <Anakin receiveShadow castShadow />
            </motion.mesh>
          </e.mesh>
        </e.group>

        <Sparkles
          count={300}
          opacity={1}
          scale={20}
          size={5}
          speed={0.4}
          color={"#ff0000"}
        />
        <mesh receiveShadow position={[0, -1.5, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial attach="material" color="#000000" />
        </mesh>
      </motion.group>
      <Effects />
    </>
  );
};

export default Scene;
