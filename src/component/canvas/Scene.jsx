import {
  Sparkles,
  useScroll,
  Environment,
  Float,
  Stars,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { val } from "@theatre/core";
import {
  editable as e,
  PerspectiveCamera,
  useCurrentSheet,
} from "@theatre/r3f";
import { motion } from "framer-motion-3d";
import React, { useEffect, useState } from "react";
import { Anakin } from "./Anakin";
import { Darth } from "./Darth";
import Effects from "./Effect";
import { Vador } from "./Vador";
import { Color } from "three";

const Scene = () => {
  const [hovered, setHovered] = useState(null);
  const { viewport } = useThree();

  // Responsive scaling based on both width and device type
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const ScalingFactor = Math.min(
    Math.max(window.innerWidth / 1300, isMobile ? 0.6 : 0.8),
    isMobile ? 1.0 : 1.2
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

  // Pulse effect for hovered items
  useFrame(({ clock }) => {
    if (hovered) {
      hovered.intensity = 4 + Math.sin(clock.getElapsedTime() * 4) * 0.5;
    }
  });

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#000000", 10, 40]} />

      <PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        position={[0, 0, 15]}
        fov={30}
      />

      {/* <Environment preset="night" /> */}
      <ambientLight intensity={0.2} color="#331111" />

      <motion.group scale={ScalingFactor}>
        <e.spotLight
          theatreKey="SpotLight1"
          position={[0, 10, 16]}
          angle={0.3}
          penumbra={1}
          intensity={4}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
          color="#ffaaaa"
          // shadow-normalBias={0.05} // Helps prevent acne in some cases
        />

        {/* <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}> */}
        <e.mesh theatreKey="Helmet" scale={0.007} position={[0, -1.3, -5]}>
          <Vador receiveShadow castShadow />
          <spotLight
            position={[0, 2, 1]}
            intensity={2}
            angle={0.5}
            color="#ff0000"
            castShadow
            penumbra={0.8}
            distance={10}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(e.object);
            }}
            onPointerOut={() => setHovered(null)}
          />
        </e.mesh>
        {/* </Float> */}

        <e.group theatreKey="battle">
          <e.mesh
            theatreKey="Darth"
            scale={0.0142}
            rotation={[0, -1.600000000000001, 0]}
            position={[1.4699999999999986, -1.5, -0.2499999999999913]}
          >
            <motion.mesh
              whileHover={{ rotateY: 0.7, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Darth receiveShadow castShadow />
            </motion.mesh>
          </e.mesh>

          <e.mesh
            theatreKey="Anakin"
            scale={0.042}
            rotation={[0, 1.6500000000000001, 0]}
            position={[-1.3600000000000003, -1.47, 0.3799999999999998]}
          >
            <motion.mesh
              whileHover={{ rotateY: -0.5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
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

        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />

        {/* Enhanced floor with better material */}
        <mesh receiveShadow position={[0, -1.5, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            attach="material"
            color="#000000"
            roughness={0.7}
            metalness={0.2}
            emissive={new Color("#330000")}
            emissiveIntensity={0.2}
          />
        </mesh>
      </motion.group>
      <Effects />
    </>
  );
};

export default Scene;
