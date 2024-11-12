import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { SheetProvider } from "@theatre/r3f";
import { getProject, val } from "@theatre/core";
import { Loader, Scene } from "./component/canvas";
import VadorState from "./Vador.json";
import { AudioControl, Cursor, Overlay } from "./component/overlay";

function App() {
  const [section, setSection] = useState(0);
  const [started, setStarted] = useState(false);

  const vadorSheet = getProject("Vador Project", { state: VadorState }).sheet(
    "Vador Sheet"
  );

  return (
    <section className=" overscroll-none w-screen h-screen">
      <Loader started={started} setStarted={setStarted} />
      <Canvas shadows gl={{ logarithmicDepthBuffer: true, antialias: false }}>
        <color attach="background" args={["#030303"]} />
        <ambientLight intensity={1} />
        <fog color="#030303" attach="fog" near={8} far={50} />
        <ScrollControls pages={8} damping={0.5} maxSpeed={1}>
          <SheetProvider sheet={vadorSheet}>
            <Suspense>{started && <Scene section={section} />}</Suspense>
          </SheetProvider>
          <Scroll html>{started && <Overlay />}</Scroll>
        </ScrollControls>
      </Canvas>
      <Cursor />
      <AudioControl started={started} />
    </section>
  );
}

export default App;
