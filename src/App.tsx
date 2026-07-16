import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import { Loader, Scene } from "./component/canvas";
import VadorState from "./Vador.json";
import {
  AudioControl,
  ChapterRail,
  Cursor,
  Overlay,
  ScrollProgressBridge,
  StoryProgress,
} from "./component/overlay";
import { TOTAL_STORY_PAGES } from "./constants";

const vadorSheet = getProject("Vador Project", {
  state: VadorState,
}).sheet("Vador Sheet");

function App() {
  const [started, setStarted] = useState(false);

  return (
    <section className="relative overscroll-none w-screen h-screen bg-void">
      <Loader started={started} setStarted={setStarted} />

      <Canvas shadows gl={{ logarithmicDepthBuffer: true, antialias: false }}>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={1} />
        <fog color="#050505" attach="fog" near={8} far={50} />
        <ScrollControls pages={TOTAL_STORY_PAGES} damping={0.5} maxSpeed={1}>
          <ScrollProgressBridge />
          <SheetProvider sheet={vadorSheet}>
            <Suspense>{started && <Scene />}</Suspense>
          </SheetProvider>
          <Scroll html>{started && <Overlay />}</Scroll>
        </ScrollControls>
      </Canvas>

      {/* Atmospheric overlays */}
      <div className="film-grain" aria-hidden />
      <div className="film-vignette" aria-hidden />

      {/* Imperial chrome */}
      <StoryProgress visible={started} />
      <ChapterRail visible={started} />
      <Cursor />
      <AudioControl started={started} />
    </section>
  );
}

export default App;
