import { useEffect, useRef } from "react";
import { ACTS } from "../content/story";
import { audio, synth } from "../core/audio";
import { ACT_COUNT, director, setState, useDirector } from "../core/director";
import { gsap, SCRAMBLE_CHARS, useGSAP } from "../core/gsap";
import { ACT_ACCENTS } from "../core/timeline";
import { useMagnetic } from "../hooks/useMagnetic";
import { device } from "../core/device";
import { travelTo } from "../core/transition";

/** Film timecode from story time: one act ≈ 1 minute of "film" at 24 fps. */
function timecode(t: number) {
  const frames = Math.floor(t * 60 * 24);
  const ff = frames % 24;
  const s = Math.floor(frames / 24);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(ff)}`;
}

export function Hud() {
  const started = useDirector((s) => s.started);
  return started ? <HudContent /> : null;
}

function HudContent() {
  const act = useDirector((s) => s.act);
  const muted = useDirector((s) => s.muted);
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const blade = useRef<HTMLDivElement>(null);
  const breath = useRef<HTMLSpanElement>(null);
  const sweep = useRef<HTMLDivElement>(null);
  const menuBtn = useMagnetic<HTMLButtonElement>();
  const soundBtn = useMagnetic<HTMLButtonElement>();

  // Per-frame chrome: timecode, progress saber, breathing ring
  useEffect(() => {
    const tick = () => {
      const t = director.t;
      if (tc.current) tc.current.textContent = timecode(t);
      if (blade.current) blade.current.style.transform = `scaleY(${Math.max(0.002, t / ACT_COUNT)})`;
      // Real respirator level when audible, a 4.6 s sine cycle otherwise
      const live = audio.level();
      const phase = (performance.now() / 1000 / 4.6) * Math.PI * 2;
      director.breath = live >= 0 ? live : Math.sin(phase) * 0.5 + 0.5;
      if (breath.current) breath.current.style.transform = `scale(${0.5 + director.breath * 0.5})`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  // Accent + scrambled act label on every act change
  const prevAct = useRef(act);
  useGSAP(() => {
    document.documentElement.style.setProperty("--accent", ACT_ACCENTS[act]);
    document.title = act === 0 ? "VADER — Anatomy of a Fall" : `${ACTS[act].title} — VADER`;

    // A saber scan-line crosses the frame on every act change
    const forward = act > prevAct.current;
    if (act !== prevAct.current && sweep.current && !device.reducedMotion) {
      gsap.fromTo(
        sweep.current,
        { yPercent: forward ? -100 : 100, top: forward ? "0%" : "100%", opacity: 1 },
        { top: forward ? "100%" : "0%", duration: 1.1, ease: "power2.inOut", onComplete: () => void gsap.set(sweep.current, { opacity: 0 }) },
      );
    }
    prevAct.current = act;

    if (!label.current) return;
    gsap.to(label.current, {
      duration: 0.9,
      scrambleText: { text: `${ACTS[act].numeral === "0" ? "Prologue" : `Act ${ACTS[act].numeral}`} — ${ACTS[act].label}`, chars: SCRAMBLE_CHARS, speed: 0.6 },
    });
  }, [act]);

  useGSAP(
    () => {
      if (device.reducedMotion) return;
      gsap.from(".hud-in", { opacity: 0, y: -14, stagger: 0.07, duration: 1.2, ease: "sith", delay: 0.6 });
      gsap.from(".hud-side", { opacity: 0, x: -14, duration: 1.2, ease: "sith", delay: 1 });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 z-50">
      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 flex items-start justify-between p-[var(--gutter)] mix-blend-difference">
        <button
          className="hud-in pointer-events-auto flex flex-col items-start gap-1.5"
          onClick={() => travelTo(0)}
          data-cursor="Top"
          aria-label="Back to the prologue"
        >
          <span className="font-jedi text-2xl leading-none text-bone">Vader</span>
          <span className="hud !text-[9px]">Anatomy of a Fall</span>
        </button>

        <div className="hud-in absolute left-1/2 top-[var(--gutter)] hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span ref={label} className="hud text-bone" />
          <span ref={tc} className="hud !tracking-[0.2em] tabular-nums" />
        </div>

        <div className="hud-in pointer-events-auto flex items-center gap-2 sm:gap-4">
          <button
            ref={soundBtn}
            className="flex h-10 items-center gap-2 px-2"
            onClick={() => audio.setMuted(!muted)}
            data-cursor={muted ? "Unmute" : "Mute"}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
          >
            <span className="flex h-3 items-end gap-[2px]" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="block h-full w-[2px] origin-bottom bg-bone"
                  style={{
                    animation: muted ? "none" : `eq ${0.7 + i * 0.13}s ease-in-out ${i * 0.1}s infinite`,
                    transform: muted ? "scaleY(0.2)" : undefined,
                  }}
                />
              ))}
            </span>
            <span className="hud text-bone">{muted ? "Off" : "On"}</span>
          </button>
          <button
            ref={menuBtn}
            className="group flex h-10 items-center gap-3 rounded-full border border-bone/25 px-4 transition-colors duration-500 hover:border-bone"
            onClick={() => {
              synth.whoosh(true);
              setState({ menuOpen: true });
            }}
            data-cursor="Open"
          >
            <span className="hud text-bone">Index</span>
            <span className="flex flex-col gap-[3px]" aria-hidden>
              <span className="block h-px w-4 bg-bone transition-transform duration-500 group-hover:translate-x-1" />
              <span className="block h-px w-4 bg-bone transition-transform duration-500 group-hover:-translate-x-1" />
            </span>
          </button>
        </div>
      </header>

      {/* Act-change scan line */}
      <div ref={sweep} className="absolute inset-x-0 top-0 h-px bg-white text-[var(--accent)] opacity-0 glow-saber" aria-hidden />

      {/* Progress saber */}
      <div className="hud-side absolute bottom-[calc(var(--gutter)+48px)] left-[calc(var(--gutter)+2px)] top-[30vh] hidden w-[2px] md:block">
        <div className="absolute inset-0 bg-bone/10" />
        <div
          ref={blade}
          className="absolute inset-0 origin-bottom bg-white text-[var(--accent)] glow-saber transition-colors duration-700"
        />
        <div className="absolute -bottom-9 left-1/2 h-8 w-[6px] -translate-x-1/2 rounded-[1px] bg-gradient-to-b from-[#9a9a9a] via-[#4a4a4a] to-[#2a2a2a]" />
      </div>

      {/* Bottom bar */}
      <footer className="absolute inset-x-0 bottom-0 flex items-end justify-between p-[var(--gutter)] mix-blend-difference">
        <div className="hud-in flex items-center gap-3 md:pl-8">
          <span className="relative grid h-5 w-5 place-items-center" aria-hidden>
            <span className="absolute inset-0 rounded-full border border-bone/30" />
            <span ref={breath} className="block h-3 w-3 rounded-full bg-bone/80" />
          </span>
          <span className="hud hidden sm:inline">Respirator · 13 / min</span>
        </div>
        <div className="hud-in flex items-baseline gap-2 font-mono text-bone">
          <span className="text-sm tabular-nums">{String(act + 1).padStart(2, "0")}</span>
          <span className="hud">/ {String(ACT_COUNT).padStart(2, "0")}</span>
        </div>
      </footer>
    </div>
  );
}
