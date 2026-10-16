import { useRef } from "react";
import { COPY, IMAGES } from "../content/story";
import { useSectionFx } from "../hooks/useSectionFx";
import { ActFrame, ActSlug } from "./ActFrame";

export function Origins() {
  const ref = useRef<HTMLElement>(null);
  useSectionFx(ref);
  const c = COPY.origins;

  return (
    <ActFrame ref={ref} index={1} className="gutter pb-[24vh] pt-[22vh]">
      <ActSlug index={1} />

      <div className="mt-[8vh] grid grid-cols-12 gap-x-6 gap-y-14">
        <h2 className="col-span-12 font-display uppercase leading-[0.82] md:col-span-7">
          <span data-split="chars" className="block text-[22vw] text-bone md:text-[13.5vw]">
            {c.heading[0]}
          </span>
          <span data-split="chars" className="outline-type block pl-[6vw] text-[22vw] md:text-[13.5vw]">
            {c.heading[1]}
          </span>
        </h2>

        <figure data-parallax="0.12" className="col-span-10 col-start-3 self-end md:col-span-4 md:col-start-9">
          <div data-clip className="relative aspect-[3/4] overflow-hidden">
            <img src={IMAGES.tatooine} alt="The twin suns of Tatooine" className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-[#d8a865]/10 mix-blend-multiply" />
          </div>
          <figcaption className="mt-3 flex justify-between hud">
            <span>Fig. 01 — Tatooine</span>
            <span>Twin suns</span>
          </figcaption>
        </figure>

        <div className="col-span-12 md:col-span-5 md:col-start-2">
          <p data-scrub-words className="font-sans text-[clamp(20px,2.1vw,34px)] font-light leading-[1.25] text-bone">
            {c.body}
          </p>
        </div>

        <div className="col-span-12 flex flex-col justify-end gap-10 md:col-span-4 md:col-start-9">
          <dl data-fade className="grid grid-cols-3 border-t border-bone/15 pt-5">
            {c.stats.map((s) => (
              <div key={s.k}>
                <dt className="hud">{s.k}</dt>
                <dd className="mt-2 font-display text-3xl text-bone md:text-4xl">{s.v}</dd>
              </div>
            ))}
          </dl>
          <p data-split="lines" className="font-serif text-[clamp(22px,2.2vw,36px)] italic leading-[1.1] accent">
            “{c.aside}”
          </p>
        </div>
      </div>
    </ActFrame>
  );
}
