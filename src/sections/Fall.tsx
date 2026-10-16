import { useRef } from "react";
import { COPY } from "../content/story";
import { synth } from "../core/audio";
import { director } from "../core/director";
import { gsap } from "../core/gsap";
import * as shots from "../core/timeline";
import { stage } from "../gl/stageClock";
import { useSectionFx } from "../hooks/useSectionFx";
import { ActFrame, ActSlug } from "./ActFrame";

export function Fall() {
  const ref = useRef<HTMLElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const drag = useRef({ active: false, lastX: 0, lastT: 0 });
  const c = COPY.fall;

  useSectionFx(ref, ({ root, reduced }) => {
    // Statements surface one after another while the seam slides into darkness
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: reduced ? true : 0.8 },
    });
    tl.fromTo(".fall-bars", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power2.out" }, 0)
      .from(".fall-name-l", { xPercent: -40, opacity: 0, duration: 1 }, 0)
      .from(".fall-name-r", { xPercent: 40, opacity: 0, duration: 1 }, 0);
    root.querySelectorAll(".fall-line").forEach((line, i) => {
      tl.fromTo(line, { opacity: 0, y: 40, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 }, 0.8 + i * 0.9);
      tl.to(line, { opacity: 0.18, duration: 0.4 }, 1.6 + i * 0.9);
    });
    tl.fromTo(".fall-cry", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.8 }, 3.6)
      .to(".fall-name-l", { opacity: 0.15, duration: 0.8 }, 3.6)
      .to(".fall-bars", { scaleY: 0, duration: 0.6 }, 4.6)
      .to(".fall-cry", { opacity: 0, duration: 0.4 }, 4.7);

    // The handle rides the shader's seam every frame
    const follow = () => {
      const el = handle.current;
      if (!el) return;
      const amount = shots.sample(shots.grade.duality, stage.t);
      const x = Math.min(0.97, Math.max(0.03, shots.sample(shots.grade.split, stage.t) + director.splitOffset));
      el.style.transform = `translate3d(${x * window.innerWidth}px, 0, 0)`;
      el.style.opacity = String(amount);
      el.style.pointerEvents = amount > 0.5 ? "auto" : "none";
    };
    gsap.ticker.add(follow);
    return () => gsap.ticker.remove(follow);
  });

  const onDown = (e: React.PointerEvent) => {
    drag.current = { active: true, lastX: e.clientX, lastT: performance.now() };
    (e.target as Element).setPointerCapture(e.pointerId);
    gsap.killTweensOf(director, "splitOffset");
    synth.humStart();
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const base = shots.sample(shots.grade.split, stage.t);
    director.splitOffset = e.clientX / window.innerWidth - base;
    const now = performance.now();
    const speed = (e.clientX - drag.current.lastX) / Math.max(1, now - drag.current.lastT);
    drag.current.lastX = e.clientX;
    drag.current.lastT = now;
    synth.humSpeed(speed * 0.6);
  };

  const onUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    synth.humStop();
    // The dark side pulls the blade back
    gsap.to(director, { splitOffset: 0, duration: 2.4, ease: "power3.inOut", delay: 0.6 });
  };

  return (
    <ActFrame ref={ref} index={4} vh={380}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="fall-bars absolute inset-x-0 top-0 h-[9vh] origin-top bg-void" />
        <div className="fall-bars absolute inset-x-0 bottom-0 h-[9vh] origin-bottom bg-void" />

        <ActSlug index={4} className="gutter absolute inset-x-0 top-[16vh] z-10" />

        <div className="gutter absolute inset-x-0 top-[24vh] flex justify-between font-display uppercase leading-none">
          <span className="fall-name-l text-[15vw] text-kyber/90 [text-shadow:0_0_40px_rgba(92,200,255,0.4)] md:text-[11vw]">{c.left}</span>
          <span className="fall-name-r text-[15vw] text-saber [text-shadow:0_0_40px_rgba(255,42,42,0.45)] md:text-[11vw]">{c.right}</span>
        </div>

        <div className="gutter absolute inset-x-0 bottom-[16vh] flex flex-col items-center gap-2 text-center">
          {c.lines.map((l) => (
            <p key={l} className="fall-line max-w-[26ch] font-serif text-[clamp(24px,3vw,52px)] italic leading-[1.05] text-bone">
              {l}
            </p>
          ))}
        </div>

        <p className="fall-cry gutter pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-[11vw] uppercase leading-[0.85] text-bone opacity-0 [text-shadow:0_0_80px_rgba(255,90,31,0.6)]">
          {c.cry}
        </p>

        {/* Duality blade handle */}
        <button
          ref={handle}
          className="absolute left-0 top-1/2 -ml-8 -mt-8 grid h-16 w-16 touch-none place-items-center opacity-0"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          data-cursor="Drag"
          aria-label="Drag the blade between light and dark"
        >
          <span className="absolute inset-0 rounded-full border border-white/70 bg-void/30 backdrop-blur-sm" />
          <span className="relative flex items-center gap-1 font-mono text-[11px] text-white">
            <span>‹</span>
            <span className="h-3 w-px bg-white" />
            <span>›</span>
          </span>
          <span className="hud absolute top-full mt-3 whitespace-nowrap text-white">{c.hint}</span>
        </button>
      </div>
    </ActFrame>
  );
}
