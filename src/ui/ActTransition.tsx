import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ACTS } from "../content/story";
import { synth } from "../core/audio";
import { device } from "../core/device";
import { director, getState, setState } from "../core/director";
import { gsap, SCRAMBLE_CHARS, useGSAP } from "../core/gsap";
import { getLenis, jumpToAct, scrollToAct } from "../core/smoothScroll";
import { ACT_ACCENTS } from "../core/timeline";
import { registerTravel } from "../core/transition";
import { stage } from "../gl/stageClock";

const DOOR: CSSProperties = {
  backgroundImage: "repeating-linear-gradient(0deg, rgba(236,230,220,0.022) 0 1px, transparent 1px 4px)",
};
const EDGE: CSSProperties = { background: "var(--tr)", color: "var(--tr)" };

interface Request {
  index: number;
  id: number;
}

/** The act title card. Rendered twice — once per blast door — so it splits on the seam. */
function Card({ index }: { index: number }) {
  const act = ACTS[index];
  const numeral = act.numeral === "0" ? "00" : act.numeral;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-[var(--gutter)] text-center">
      <p className="tr-meta hud absolute left-[var(--gutter)] top-[var(--gutter)]" data-text="Hyperspace // Jump engaged">
        Hyperspace // Jump engaged
      </p>
      <p className="tr-meta hud absolute bottom-[var(--gutter)] right-[var(--gutter)]" data-text={`Coordinates ${act.file}`}>
        Coordinates {act.file}
      </p>
      <span
        className="tr-num pointer-events-none absolute select-none font-display text-[46vh] leading-none text-transparent"
        style={{ WebkitTextStroke: "1px var(--tr)", opacity: 0.35 }}
      >
        {numeral}
      </span>
      <p className="tr-meta hud relative text-bone" data-text={`Act ${numeral} — ${act.label}`}>
        Act {numeral} — {act.label}
      </p>
      <h2 className="relative mt-[3vh] overflow-hidden font-display text-[16vw] uppercase leading-[0.9] text-bone md:text-[10vw]">
        <span className="tr-title block">{act.title}</span>
      </h2>
      <div className="tr-bar relative mt-[3vh] h-px w-[min(420px,60vw)] origin-left bg-white glow-saber" style={{ color: "var(--tr)" }} />
      <p className="tr-meta hud relative mt-[2.4vh]" data-text={`${act.place} · ${act.file}`}>
        {act.place} · {act.file}
      </p>
    </div>
  );
}

/**
 * Hyperspace jump between acts. Instead of scrolling through every scene, the
 * frame smears into star streaks, blast doors slam shut on a saber seam with the
 * destination's title card, the page teleports underneath, and the doors split
 * the card open as the warp decelerates into the new act.
 */
export function ActTransition() {
  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const [request, setRequest] = useState<Request | null>(null);

  useEffect(
    () =>
      registerTravel((index) => {
        if (busy.current) return;
        const { act, menuOpen } = getState();
        if (index === act) {
          // Already here: close the index and glide to the act's opening
          if (menuOpen) setState({ menuOpen: false });
          window.setTimeout(() => scrollToAct(index, 1.2), menuOpen ? 350 : 0);
          return;
        }
        busy.current = true;
        setRequest({ index, id: performance.now() });
      }),
    [],
  );

  useGSAP(
    () => {
      if (!request) return;
      const { index } = request;
      const done = () => {
        busy.current = false;
        director.warp = 0;
        gsap.set(root.current, { visibility: "hidden" });
      };
      const land = () => {
        jumpToAct(index);
        // Snap the stage clock: no fly-through of every act in between
        stage.t = director.t;
        getLenis()?.stop();
      };
      const closeMenu = () => {
        if (getState().menuOpen) setState({ menuOpen: false });
      };

      const tl = gsap.timeline({ onComplete: done });
      tl.set(root.current, { visibility: "visible" });

      if (device.reducedMotion) {
        tl.set(".tr-door", { yPercent: 0 })
          .fromTo(".tr-door", { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "none" })
          .call(closeMenu)
          .call(land, undefined, "+=0.35")
          .call(() => getLenis()?.start(), undefined, "+=0.1")
          .to(".tr-door", { opacity: 0, duration: 0.35, ease: "none" });
        return;
      }

      synth.jump();
      tl.set(".tr-door", { opacity: 1 })
        // Departure: the frame stretches into hyperspace between closing doors
        .to(director, { warp: 1, duration: 0.95, ease: "power2.in" }, 0)
        .fromTo(".tr-top", { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: "power4.in" }, 0.12)
        .fromTo(".tr-bot", { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: "power4.in" }, 0.12)
        .call(closeMenu, undefined, 0)
        .fromTo(".tr-seam", { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.35, ease: "ignite" }, 0.88)
        // Title card, assembled while the doors are shut
        .fromTo(".tr-num", { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 0.35, duration: 1.4, ease: "power3.out" }, 0.92)
        .fromTo(".tr-title", { yPercent: 105 }, { yPercent: 0, duration: 0.85, ease: "sith" }, 0.95)
        .fromTo(".tr-bar", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 1.0)
        .fromTo(".tr-meta", { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.06 }, 1.0)
        .add(() => {
          root.current?.querySelectorAll<HTMLElement>(".tr-meta").forEach((el) =>
            gsap.to(el, {
              duration: 0.7,
              scrambleText: { text: el.dataset.text ?? "", chars: SCRAMBLE_CHARS, speed: 0.6 },
            }),
          );
        }, 1.0)
        .call(land, undefined, 1.5)
        // Arrival: the doors split the card along the seam, warp decelerates
        .call(
          () => {
            getLenis()?.start();
            synth.arrive();
          },
          undefined,
          1.85,
        )
        .to(".tr-seam", { opacity: 0, duration: 0.35 }, 1.85)
        .to(".tr-top", { yPercent: -100, duration: 1.15, ease: "sith" }, 1.85)
        .to(".tr-bot", { yPercent: 100, duration: 1.15, ease: "sith" }, 1.85)
        .fromTo(director, { warp: 1 }, { warp: 0, duration: 1.5, ease: "power3.out", immediateRender: false }, 1.85);
    },
    { dependencies: [request], scope: root },
  );

  const index = request?.index ?? 0;
  const style = { "--tr": ACT_ACCENTS[index], visibility: "hidden" } as CSSProperties;

  return (
    <div ref={root} className="pointer-events-auto fixed inset-0 z-[70]" style={style} aria-hidden>
      <div className="tr-door tr-top absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-void" style={DOOR}>
        <div className="absolute inset-x-0 top-0 h-[200%]">
          <Card key={request?.id} index={index} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px opacity-60 glow-saber" style={EDGE} />
      </div>
      <div className="tr-door tr-bot absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-void" style={DOOR}>
        <div className="absolute inset-x-0 bottom-0 h-[200%]">
          <Card key={request?.id} index={index} />
        </div>
        <div className="absolute inset-x-0 top-0 h-px opacity-60 glow-saber" style={EDGE} />
      </div>
      <div
        className="tr-seam pointer-events-none absolute left-0 right-0 top-1/2 h-[2px] origin-center -translate-y-1/2 scale-x-0 bg-white glow-saber"
        style={{ color: "var(--tr)" }}
      />
    </div>
  );
}
