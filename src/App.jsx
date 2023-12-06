import { Suspense , useState  } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ScrollControls,
  useScroll,
  Environment,
  Lightformer,
  OrbitControls,
  Scroll,
} from "@react-three/drei";
import { easing } from "maath";
import { Scene } from "./component/canvas";
import { Navbar, Overlay } from "./component/overlay";
import { ScrollManager } from "./utils";


function App() {
  const [section, setSection] = useState(0);
  const [started, setStarted] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <section className=" overscroll-none w-screen h-screen">
    <Suspense
       fallback={
         <div className="flex flex-col h-screen w-screen justify-center items-center bg-black">
           {/* <Lottie
             animationData={wheelanimation}
             style={{ height: "200px", width: "200px" }}
           /> */}
           <p className="text-white text-[16px] font-medium text-center">
             Loading...
           </p>
         </div>
       }
     >
   <Canvas
    colorManagement
    camera={{ position: [0, 0, 15] , fov:30 }}
    gl={{
      powerPreference: "high-performance",
      alpha: false,
      antialias: false,
      stencil: false,
      depth: false
    }}
   >
    <color attach="background" args={["#f2eeee"]} />
    <ambientLight intensity={1} />
      {/* <fog color="#161616" attach="fog" near={8} far={30} /> */}
      <ScrollControls pages={5} damping={0.8} maxSpeed={1} >
      <ScrollManager section={section} onSectionChange={setSection} />
<Scene section={section} />
<Scroll html>
            <Overlay />
          </Scroll>
</ScrollControls>
<Rig />

   </Canvas>
 <Navbar 
 onSectionChange={setSection}
 menuOpened={menuOpened}
 setMenuOpened={setMenuOpened}
/>
</Suspense>
 </section>
  )
  function Rig() {
    useFrame((state, delta) => {
      easing.damp3(
        state.camera.position,
        [Math.sin(-state.pointer.x) * 5, state.pointer.y * 3.5, 15 + Math.cos(state.pointer.x) * 10],
        0.2,
        delta,
      )
      state.camera.lookAt(0, 0, 0)
    })
  }
}

export default App
