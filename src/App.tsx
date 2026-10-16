import { useEffect } from "react";
import { initSmoothScroll } from "./core/smoothScroll";
import { ScrollTrigger } from "./core/gsap";
import { Stage } from "./gl/Stage";
import { StageBoundary } from "./gl/StageBoundary";
import { Cursor } from "./ui/Cursor";
import { Hud } from "./ui/Hud";
import { Menu } from "./ui/Menu";
import { ActTransition } from "./ui/ActTransition";
import { Preloader } from "./ui/Preloader";
import { Prologue } from "./sections/Prologue";
import { Origins } from "./sections/Origins";
import { Discovery } from "./sections/Discovery";
import { Prodigy } from "./sections/Prodigy";
import { Fall } from "./sections/Fall";
import { Empire } from "./sections/Empire";
import { Redemption } from "./sections/Redemption";
import { Legacy } from "./sections/Legacy";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    initSmoothScroll();
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <StageBoundary>
        <Stage />
      </StageBoundary>

      <main className="relative z-10">
        <Prologue />
        <Origins />
        <Discovery />
        <Prodigy />
        <Fall />
        <Empire />
        <Redemption />
        <Legacy />
      </main>

      <Hud />
      <Menu />
      <ActTransition />
      <Preloader />
      <Cursor />
      <Analytics />
      <div className="grain" aria-hidden />

      {/* Shared SVG filter for the holo-warp image hover */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="holo-warp" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </>
  );
}
