import { useRef } from "react";
import { COPY } from "../content/story";
import { synth } from "../core/audio";
import { gsap } from "../core/gsap";
import { rewindToStart } from "../core/smoothScroll";
import { useMagnetic } from "../hooks/useMagnetic";
import { useSectionFx } from "../hooks/useSectionFx";
import { ActFrame, ActSlug } from "./ActFrame";

export function Legacy() {
  const ref = useRef<HTMLElement>(null);
  const replay = useMagnetic<HTMLButtonElement>(0.4);
  const c = COPY.legacy;

  useSectionFx(ref, ({ root, reduced }) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root.querySelector(".leg-stage"), start: "top top", end: "bottom bottom", scrub: reduced ? true : 0.8 },
    });
    root.querySelectorAll(".leg-word").forEach((w, i) => {
      tl.fromTo(w, { opacity: 0, yPercent: 40, filter: "blur(14px)" }, { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 1 }, i * 0.8);
    });
    tl.to(".leg-word", { opacity: 0, yPercent: -30, filter: "blur(10px)", stagger: 0.1, duration: 0.8 }, 3.2);
  });

  return (
    <ActFrame ref={ref} index={7}>
      <div className="leg-stage relative h-[200vh]">
        <div className="gutter sticky top-0 flex h-screen flex-col">
          <ActSlug index={7} className="mt-[16vh]" />
          <div className="flex flex-1 items-center justify-between font-display uppercase leading-none">
            {c.epitaph.map((w, i) => (
              <span
                key={w}
                className={`leg-word text-[11vw] md:text-[7.5vw] ${i === 1 ? "self-end pb-[8vh] text-bone" : i === 2 ? "self-start pt-[4vh] accent" : "self-start pt-[4vh] text-bone/70"}`}
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="gutter relative flex min-h-screen flex-col justify-between bg-gradient-to-b from-transparent via-void/80 to-void pb-[var(--gutter)] pt-[10vh]">
        <div className="grid grid-cols-12 gap-6">
          <p data-scrub-words className="col-span-12 font-sans text-[clamp(20px,2vw,32px)] font-light leading-[1.3] text-bone md:col-span-6">
            {c.body}
          </p>
          <div className="col-span-12 flex items-end justify-start md:col-span-5 md:col-start-8 md:justify-end">
            <button
              ref={replay}
              className="group relative grid h-40 w-40 place-items-center rounded-full border border-bone/30 transition-colors duration-500 hover:border-[var(--accent)]"
              onClick={() => {
                synth.whoosh(false);
                rewindToStart();
              }}
              onPointerEnter={() => synth.tick(900)}
              data-cursor="Rewind"
            >
              <span className="absolute inset-2 rounded-full bg-bone scale-0 transition-transform duration-700 ease-out4 group-hover:scale-100" />
              <span className="relative text-center">
                <span className="block font-mono text-lg text-bone transition-colors duration-500 group-hover:text-void">◀◀</span>
                <span className="hud mt-2 block text-bone/80 transition-colors duration-500 group-hover:text-void">Rewind the saga</span>
              </span>
            </button>
          </div>
        </div>

        <h2 data-split="chars" className="mt-[12vh] font-serif text-[15vw] italic leading-[0.9] text-bone md:text-[10.5vw]">
          {c.final}
        </h2>

        <footer className="mt-[8vh] grid grid-cols-2 gap-6 border-t border-bone/15 pt-6 md:grid-cols-4">
          <div>
            <p className="hud">Experience</p>
            <p className="mt-2 font-sans text-sm text-bone/80">VADER — Anatomy of a Fall</p>
          </div>
          <div>
            <p className="hud">Built with</p>
            <p className="mt-2 font-sans text-sm text-bone/80">Three.js · R3F · GSAP · Lenis · GLSL</p>
          </div>
          <div>
            <p className="hud">Code</p>
            <a
              href="https://github.com/Diallo222/Vador"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-sans text-sm text-bone/80 underline decoration-bone/30 underline-offset-4 hover:text-bone"
              data-cursor="GitHub"
            >
              Diallo222/Vador
            </a>
          </div>
          <div>
            <p className="hud">Notice</p>
            <p className="mt-2 font-sans text-xs leading-relaxed text-ash">
              Non-commercial fan tribute. Star Wars and all related imagery © Lucasfilm Ltd. / Disney.
            </p>
          </div>
        </footer>
      </div>
    </ActFrame>
  );
}
