import { ContactShadows, Sparkles, Stars, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { val } from "@theatre/core";
import {
  editable as e,
  PerspectiveCamera,
  useCurrentSheet,
} from "@theatre/r3f";
import { motion } from "framer-motion-3d";
import { useRef, useState } from "react";
import type { AmbientLight, Fog, Light, SpotLight } from "three";
import { Color } from "three";
import { useIsMobileScene, useSceneMood } from "../../hooks/useSceneMood";
import { useResponsiveScale } from "../../hooks/useResponsiveScale";
import { Anakin } from "./Anakin";
import { Darth } from "./Darth";
import Effects from "./Effect";
import { Vador } from "./Vador";

const VOID = "#050505";

const Scene = () => {
  const [hovered, setHovered] = useState<Light | null>(null);
  const ScalingFactor = useResponsiveScale();
  const mood = useSceneMood();
  const isMobile = useIsMobileScene();
  const fogRef = useRef<Fog>(null);
  const ambientRef = useRef<AmbientLight>(null);
  const targetAmbient = useRef(new Color(mood.ambient));
  const targetFog = useRef(new Color(mood.fog));

  const sheet = useCurrentSheet();
  const scroll = useScroll();

  useFrame(() => {
    if (!sheet) return;
    const sequenceLength = val(sheet.sequence.pointer.length);
    sheet.sequence.position = scroll.offset * sequenceLength;
  });

  useFrame(({ clock }) => {
    if (hovered) {
      hovered.intensity = 2.2 + Math.sin(clock.getElapsedTime() * 4) * 0.35;
    }
  });

  useFrame((_, delta) => {
    const t = Math.min(1, delta * 2);
    targetAmbient.current.set(mood.ambient);
    targetFog.current.set(mood.fog);
    if (ambientRef.current) {
      ambientRef.current.color.lerp(targetAmbient.current, t);
      ambientRef.current.intensity +=
        (mood.ambientIntensity - ambientRef.current.intensity) * t;
    }
    if (fogRef.current) {
      fogRef.current.color.lerp(targetFog.current, t);
    }
  });

  const sparkleCount = isMobile
    ? Math.min(40, Math.floor(mood.particleCount * 0.4))
    : mood.particleCount;
  const starCount = isMobile ? 1500 : 3500;

  return (
    <>
      <color attach="background" args={[VOID]} />
      <fog ref={fogRef} attach="fog" args={[mood.fog, 12, 42]} />

      <PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        position={[0, 0, 15]}
        fov={30}
      />

      <ambientLight
        ref={ambientRef}
        intensity={mood.ambientIntensity}
        color={mood.ambient}
      />
      <directionalLight
        position={[-6, 4, -8]}
        intensity={mood.rimIntensity}
        color={mood.rim}
      />
      <directionalLight
        position={[2, -4, 4]}
        intensity={mood.fillIntensity}
        color="#1a1010"
      />

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
        />

        <e.mesh theatreKey="Helmet" scale={0.007} position={[0, -1.3, -5]}>
          <Vador receiveShadow castShadow />
          <spotLight
            position={[0, 2, 1]}
            intensity={1.6}
            angle={0.45}
            color="#b11226"
            castShadow={false}
            penumbra={0.85}
            distance={8}
            onPointerOver={(event) => {
              event.stopPropagation();
              setHovered(event.object as SpotLight);
            }}
            onPointerOut={() => setHovered(null)}
          />
        </e.mesh>

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
          key={mood.id}
          count={sparkleCount}
          opacity={0.55}
          scale={18}
          size={isMobile ? 3 : 4}
          speed={0.25}
          color={mood.particle}
        />

        <Stars
          radius={100}
          depth={50}
          count={starCount}
          factor={3}
          fade
          speed={0.6}
        />

        <mesh receiveShadow position={[0, -1.5, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[80, 80]} />
          <meshStandardMaterial
            color="#050505"
            roughness={0.92}
            metalness={0.05}
            emissive="#1a0505"
            emissiveIntensity={0.08}
          />
        </mesh>

        <ContactShadows
          position={[0, -1.49, 0]}
          opacity={0.55}
          scale={28}
          blur={2.4}
          far={8}
          color="#000000"
        />
      </motion.group>

      <Effects />
    </>
  );
};

export default Scene;
