import { PerformanceMonitor, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { NoToneMapping, SRGBColorSpace } from "three";
import { quality } from "../core/device";
import { useDirector } from "../core/director";
import { CameraRig } from "./CameraRig";
import { Lights } from "./Lights";
import { Anakin } from "./models/Anakin";
import { Helmet } from "./models/Helmet";
import { Vader } from "./models/Vader";
import { Atmosphere } from "./effects/Atmosphere";
import { Backdrop } from "./effects/Backdrop";
import { Floor } from "./effects/Floor";
import { TitleText } from "./effects/TitleText";
import { Post } from "./post/Post";

/** The fixed WebGL theatre behind the whole page. */
export function Stage() {
  const [dpr, setDpr] = useState(quality.dpr[1]);
  // The index menu covers the stage: freeze the render loop behind it
  const paused = useDirector((s) => s.menuOpen);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={dpr}
        frameloop={paused ? "never" : "always"}
        camera={{ fov: 30, near: 0.1, far: 200, position: [0, 1.5, 6.2] }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          toneMapping: NoToneMapping,
          outputColorSpace: SRGBColorSpace,
        }}
      >
        {/* Adaptive resolution: trade pixels for frames on weaker GPUs */}
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => setDpr((d) => Math.max(quality.dpr[0], d - 0.25))}
          onIncline={() => setDpr((d) => Math.min(quality.dpr[1], d + 0.25))}
          onFallback={() => setDpr(quality.dpr[0])}
        />
        <CameraRig />
        <fog attach="fog" args={["#050303", 7, 24]} />
        <Backdrop />
        <Lights />
        <Suspense fallback={null}>
          <TitleText />
          <Helmet />
          <Anakin />
          <Vader />
          <Floor />
          {/* Compile every actor up front: no shader hitch the first time one appears */}
          <Preload all />
        </Suspense>
        <Atmosphere />
        <Post />
      </Canvas>
    </div>
  );
}
