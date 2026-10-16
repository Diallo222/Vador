import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { audio, synth } from "../core/audio";
import { director, setState } from "../core/director";
import { gsap, useGSAP } from "../core/gsap";
import { lockScroll } from "../core/smoothScroll";

const HOLD_SECONDS = 1.3;
const RING = 2 * Math.PI * 46;

/**
 * Boot sequence: a lightsaber blade fills as assets load, then the user must
 * hold to ignite — the gesture unlocks audio and opens the blast doors.
 */
export function Preloader() {
  const { progress } = useProgress();
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const shown = useRef({ value: 0 });
  const counter = useRef<HTMLSpanElement>(null);
  const blade = useRef<HTMLDivElement>(null);
  const hold = useRef({ v: 0 });
  const holdTween = useRef<gsap.core.Tween | null>(null);
  const ignited = useRef(false);

  useEffect(() => {
    lockScroll(true);
    // Never trap the visitor: if an asset stalls, allow ignition anyway
    const failsafe = window.setTimeout(() => setReady(true), 20000);
    return () => window.clearTimeout(failsafe);
  }, []);

  // Smooth the displayed progress so the counter never jumps
  useGSAP(() => {
    gsap.to(shown.current, {
      value: progress,
      duration: 0.8,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => {
        const v = shown.current.value;
        if (counter.current) counter.current.textContent = String(Math.round(v)).padStart(3, "0");
        if (blade.current) blade.current.style.transform = `scaleX(${v / 100})`;
      },
      onComplete: () => {
        if (progress >= 100) setReady(true);
      },
    });
  }, [progress]);

  useGSAP(
    () => {
      if (!ready) return;
      gsap.from(".pl-ready > *", { yPercent: 120, opacity: 0, stagger: 0.08, duration: 1, ease: "sith" });
    },
    { scope: root, dependencies: [ready] },
  );

  const setRing = () => {
    if (ring.current) ring.current.style.strokeDashoffset = String(RING * (1 - hold.current.v));
    synth.humSpeed(hold.current.v);
  };

  const ignite = () => {
    if (ignited.current) return;
    ignited.current = true;
    synth.humStop();
    synth.ignite();
    audio.start();

    const tl = gsap.timeline({
      onComplete: () => {
        setGone(true);
      },
    });
    tl.to(director, { flash: 0.85, duration: 0.08, ease: "power1.in" })
      .to(".pl-content", { opacity: 0, scale: 1.04, duration: 0.3 }, 0)
      .to(".pl-seam", { scaleX: 1, duration: 0.45, ease: "ignite" }, 0)
      .to(".pl-door-top", { yPercent: -100, duration: 1.5, ease: "sith" }, 0.4)
      .to(".pl-door-bottom", { yPercent: 100, duration: 1.5, ease: "sith" }, 0.4)
      .to(".pl-seam", { opacity: 0, duration: 0.6 }, 0.7)
      .to(director, { flash: 0, duration: 1.4, ease: "power2.out" }, 0.08)
      .add(() => {
        setState({ started: true });
        lockScroll(false);
      }, 0.5)
      .to(director, { intro: 0, duration: 3.4, ease: "power2.inOut" }, 0.5);
  };

  const startHold = () => {
    if (!ready || ignited.current) return;
    synth.humStart();
    holdTween.current?.kill();
    holdTween.current = gsap.to(hold.current, {
      v: 1,
      duration: HOLD_SECONDS * (1 - hold.current.v),
      ease: "none",
      onUpdate: setRing,
      onComplete: ignite,
    });
  };

  const endHold = () => {
    if (ignited.current) return;
    synth.humStop();
    holdTween.current?.kill();
    holdTween.current = gsap.to(hold.current, { v: 0, duration: 0.45, ease: "power2.out", onUpdate: setRing });
  };

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[80] select-none" role="dialog" aria-label="Loading">
      <div className="pl-door-top absolute inset-x-0 top-0 h-1/2 bg-void" />
      <div className="pl-door-bottom absolute inset-x-0 bottom-0 h-1/2 bg-void" />
      <div className="pl-seam pointer-events-none absolute left-0 right-0 top-1/2 h-[2px] origin-center -translate-y-1/2 scale-x-0 bg-white text-saber glow-saber" />

      <div className="pl-content absolute inset-0 flex flex-col justify-between p-[var(--gutter)]">
        <div className="flex justify-between hud">
          <span>Imperial Archive // Restricted</span>
          <span className="hidden sm:inline">File IMP-0000 · Clearance Sith</span>
        </div>

        <div className="flex flex-col items-center">
          <p className="hud mb-6">Decrypting the life of</p>
          <p className="font-jedi text-[18vw] leading-[0.8] text-bone sm:text-[12vw]">Vader</p>

          <div className="mt-10 flex w-[min(520px,80vw)] items-center gap-3">
            <div className="h-[10px] w-14 shrink-0 rounded-[2px] bg-gradient-to-r from-[#3a3a3a] via-[#9a9a9a] to-[#4a4a4a]" />
            <div className="relative h-[3px] flex-1">
              <div ref={blade} className="absolute inset-0 origin-left scale-x-0 rounded-full bg-[#ffe9e9] text-saber glow-saber" />
            </div>
            <span ref={counter} className="w-10 text-right font-mono text-xs text-bone">
              000
            </span>
          </div>

          <div className="mt-12 h-36">
            {ready ? (
              <div className="pl-ready flex flex-col items-center overflow-hidden">
                <button
                  className="relative grid h-28 w-28 place-items-center rounded-full outline-none focus-visible:ring-1 focus-visible:ring-saber"
                  data-cursor="Hold"
                  onPointerDown={startHold}
                  onPointerUp={endHold}
                  onPointerLeave={endHold}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !e.repeat) startHold();
                  }}
                  onKeyUp={endHold}
                  aria-label="Hold to ignite"
                >
                  <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(236,230,220,0.15)" strokeWidth="1" />
                    <circle
                      ref={ring}
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="#ff2a2a"
                      strokeWidth="2"
                      strokeDasharray={RING}
                      strokeDashoffset={RING}
                      style={{ filter: "drop-shadow(0 0 6px #ff2a2a)" }}
                    />
                  </svg>
                  <span className="h-2 w-2 rounded-full bg-saber shadow-[0_0_12px_#ff2a2a]" />
                </button>
                <p className="hud mt-5 text-bone">Hold to ignite</p>
              </div>
            ) : (
              <p className="hud animate-[blink_1.2s_steps(1)_infinite]">Loading sequence</p>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between hud">
          <span>Sound on · Headphones advised</span>
          <span className="hidden sm:inline">A long time ago in a galaxy far, far away…</span>
        </div>
      </div>
    </div>
  );
}
