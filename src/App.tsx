import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
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

      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          logarithmicDepthBuffer: true,
          antialias: false,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          outputColorSpace: SRGBColorSpace,
        }}
      >
        {/* Background / fog owned by Scene — avoid duplicate lights here */}
        <ScrollControls pages={TOTAL_STORY_PAGES} damping={0.5} maxSpeed={1}>
          <ScrollProgressBridge />
          <SheetProvider sheet={vadorSheet}>
            <Suspense>{started && <Scene />}</Suspense>
          </SheetProvider>
          <Scroll html>{started && <Overlay />}</Scroll>
        </ScrollControls>
      </Canvas>

      <div className="film-grain" aria-hidden />
      <div className="film-vignette" aria-hidden />

      <StoryProgress visible={started} />
      <ChapterRail visible={started} />
      <Cursor />
      <AudioControl started={started} />
    </section>
  );
}

export default App;
