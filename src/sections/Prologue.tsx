import { useRef } from "react";
import { COPY } from "../content/story";
import { device } from "../core/device";
import { useDirector } from "../core/director";
import { gsap, SplitText, useGSAP } from "../core/gsap";
import { ActFrame } from "./ActFrame";

export function Prologue() {
  const ref = useRef<HTMLElement>(null);
  const started = useDirector((s) => s.started);

  useGSAP(
    (_, contextSafe) => {
      if (!started || !contextSafe) return;
      const run = contextSafe(() => {
        // Content exits upward as the helmet begins to burn
        gsap.to(".pro-inner", {
          yPercent: -18,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "45% top", scrub: true },
        });
        if (device.reducedMotion) return;

        const line = SplitText.create(".pro-line", { type: "chars,words", mask: "words" });
        gsap
          .timeline({ delay: 1.4 })
          .from(".pro-kicker", { opacity: 0, y: 16, duration: 1.2, ease: "sith" })
          .from(line.chars, { yPercent: 110, duration: 1.4, stagger: 0.03, ease: "sith" }, 0.2)
          .from(".pro-cue", { opacity: 0, y: 20, duration: 1, ease: "sith" }, 1)
          .from(".pro-side", { opacity: 0, duration: 1.4 }, 1.2);
      });
      document.fonts.ready.then(run);
    },
    { scope: ref, dependencies: [started] },
  );

  return (
    <ActFrame ref={ref} index={0} vh={200}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="pro-inner gutter relative flex h-full flex-col justify-end pb-[calc(var(--gutter)+56px)]">
          <p className="pro-kicker hud absolute left-[var(--gutter)] top-[22vh] text-bone/80 md:top-[26vh]">
            <span className="accent">●</span>&nbsp;&nbsp;{COPY.prologue.kicker}
          </p>

          <p className="pro-side hud absolute right-[var(--gutter)] top-1/2 hidden origin-right -translate-y-1/2 rotate-90 md:block">
            Episodes I — VI · Archive 0001
          </p>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h1 className="pro-line max-w-[14ch] font-serif text-[13vw] italic leading-[0.92] text-bone md:text-[6.4vw]">
              {COPY.prologue.line}
            </h1>
            <div className="pro-cue flex items-center gap-4 self-start md:self-end">
              <span className="relative block h-14 w-px overflow-hidden bg-bone/20">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.2s_ease-in-out_infinite] bg-bone" />
              </span>
              <span className="hud text-bone/80">{COPY.prologue.sub}</span>
            </div>
          </div>
        </div>
      </div>
    </ActFrame>
  );
}
