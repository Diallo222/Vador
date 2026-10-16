import { useRef } from "react";
import { COPY, IMAGES } from "../content/story";
import { gsap, SplitText } from "../core/gsap";
import { useSectionFx } from "../hooks/useSectionFx";
import { ActFrame, ActSlug } from "./ActFrame";

export function Discovery() {
  const ref = useRef<HTMLElement>(null);
  const c = COPY.discovery;

  useSectionFx(ref, ({ root, reduced }) => {
    // The Chosen One condenses out of the Force motes, letter by letter
    const quote = SplitText.create(root.querySelector(".disc-quote")!, { type: "chars" });
    if (reduced) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 60%", end: "55% center", scrub: 1 },
    });
    tl.from(quote.chars, {
      opacity: 0,
      filter: "blur(18px)",
      yPercent: () => gsap.utils.random(-60, 60),
      scale: 1.6,
      stagger: { each: 0.06, from: "center" },
      ease: "power2.out",
    }).fromTo(".disc-rule", { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0.2);

    gsap.to(".disc-quote", {
      letterSpacing: "0.04em",
      ease: "none",
      scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  return (
    <ActFrame ref={ref} index={2} vh={250}>
      <div className="gutter sticky top-0 flex h-screen flex-col justify-center">
        <ActSlug index={2} className="absolute left-[var(--gutter)] right-[var(--gutter)] top-[16vh]" />
        <p className="hud mb-6 text-center">{c.prophecy}</p>
        <h2 className="disc-quote whitespace-nowrap text-center font-display text-[12.5vw] uppercase leading-none text-bone [text-shadow:0_0_60px_rgba(92,200,255,0.35)]">
          {c.quote}
        </h2>
        <div className="disc-rule mx-auto mt-8 h-px w-1/2 origin-center bg-gradient-to-r from-transparent via-kyber to-transparent" />
      </div>

      <div className="gutter relative mt-[10vh] grid grid-cols-12 gap-6 pb-[10vh]">
        <figure data-parallax="0.15" className="col-span-8 col-start-1 md:col-span-3 md:col-start-2">
          <div data-clip className="aspect-[4/5] overflow-hidden">
            <img src={IMAGES.quigon} alt="Jedi Master Qui-Gon Jinn" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <figcaption className="mt-3 hud">Fig. 02 — Qui-Gon Jinn, Jedi Master</figcaption>
        </figure>
        <div className="col-span-12 flex flex-col justify-end gap-8 md:col-span-4 md:col-start-8">
          <p data-scrub-words className="font-sans text-[clamp(20px,1.8vw,30px)] font-light leading-[1.3] text-bone">
            {c.body}
          </p>
          <p data-split="lines" className="font-serif text-[clamp(26px,2.6vw,44px)] italic leading-none accent">
            {c.aside}
          </p>
        </div>
      </div>
    </ActFrame>
  );
}
