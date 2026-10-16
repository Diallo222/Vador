import { useRef } from "react";
import { COPY, IMAGES } from "../content/story";
import { gsap } from "../core/gsap";
import { useSectionFx } from "../hooks/useSectionFx";
import { ActFrame, ActSlug } from "./ActFrame";

export function Redemption() {
  const ref = useRef<HTMLElement>(null);
  const c = COPY.redemption;

  useSectionFx(ref, ({ root, reduced }) => {
    if (reduced) return;
    // Light floods in: a soft gold bloom washes across as he dissolves
    gsap.fromTo(
      ".red-light",
      { opacity: 0, scale: 0.6 },
      {
        opacity: 1,
        scale: 1.4,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top 70%", end: "60% center", scrub: true },
      },
    );
  });

  return (
    <ActFrame ref={ref} index={6} className="gutter pb-[24vh] pt-[22vh]">
      <div className="red-light pointer-events-none absolute left-1/2 top-[20vh] h-[80vh] w-[80vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(242,212,155,0.16),transparent_65%)]" />
      <ActSlug index={6} />

      <div className="relative mt-[10vh] grid grid-cols-12 gap-x-6 gap-y-12">
        <h2 className="col-span-12 font-display uppercase leading-[0.82] md:col-span-6">
          <span data-split="chars" className="block text-[20vw] text-bone md:text-[11vw]">
            {c.heading[0]}
          </span>
          <span data-split="chars" className="block text-[20vw] accent md:text-[11vw]">
            {c.heading[1]}
          </span>
        </h2>

        <figure data-parallax="0.1" className="col-span-9 col-start-4 md:col-span-3 md:col-start-10 md:mt-[20vh]">
          <div data-clip className="aspect-[3/4] overflow-hidden">
            <img src={IMAGES.unmasked} alt="Anakin Skywalker, unmasked" className="h-full w-full object-cover sepia-[0.25]" loading="lazy" />
          </div>
          <figcaption className="mt-3 hud">Fig. 06 — Unmasked</figcaption>
        </figure>

        <p data-scrub-words className="col-span-12 font-sans text-[clamp(20px,2vw,32px)] font-light leading-[1.3] text-bone md:col-span-4 md:col-start-2">
          {c.body}
        </p>
        <p data-split="lines" className="col-span-12 font-serif text-[clamp(28px,3.6vw,64px)] italic leading-none text-gold md:col-span-5 md:col-start-2 md:mt-[6vh]">
          “{c.quote}”
        </p>
      </div>
    </ActFrame>
  );
}
