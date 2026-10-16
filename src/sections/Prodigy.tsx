import { useRef } from "react";
import { COPY, IMAGES } from "../content/story";
import { director } from "../core/director";
import { gsap } from "../core/gsap";
import { useSectionFx } from "../hooks/useSectionFx";
import { ActFrame, ActSlug } from "./ActFrame";

export function Prodigy() {
  const ref = useRef<HTMLElement>(null);
  const c = COPY.prodigy;

  useSectionFx(ref, ({ root, reduced }) => {
    const track = root.querySelector<HTMLElement>(".pro-track")!;
    // Vertical scroll → horizontal ride across three panels
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: reduced ? true : 0.6,
        invalidateOnRefresh: true,
      },
    });

    root.querySelectorAll<HTMLElement>(".pro-word").forEach((word) => {
      gsap.fromTo(
        word,
        { xPercent: 18 },
        {
          xPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: true },
        },
      );
    });

    if (reduced) return;
    // Skew + marquee react to scroll velocity
    const skewTo = gsap.quickTo(track, "skewX", { duration: 0.4, ease: "power3" });
    const marquee = root.querySelector<HTMLElement>(".pro-marquee")!;
    let x = 0;
    const tick = () => {
      const v = director.velocity;
      skewTo(gsap.utils.clamp(-8, 8, -v * 0.12));
      x -= 0.6 + Math.abs(v) * 0.35;
      const half = marquee.scrollWidth / 2;
      if (-x > half) x += half;
      marquee.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  });

  return (
    <ActFrame ref={ref} index={3} vh={460}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <ActSlug index={3} className="gutter absolute inset-x-0 top-[16vh] z-10" />

        <div className="pro-track will-transform flex h-full w-max">
          {c.panels.map((p, i) => (
            <div key={p.word} className="relative flex h-full w-screen shrink-0 items-center">
              <span
                className={`pro-word pointer-events-none absolute left-[4vw] top-1/2 -translate-y-1/2 select-none font-display text-[34vw] uppercase leading-none outline-type`}
              >
                {p.word}
              </span>
              <div className="gutter relative z-10 flex w-full justify-start md:pl-[12vw]">
                <div className="w-[min(380px,80vw)]">
                  <p className="hud accent">
                    {String(i + 1).padStart(2, "0")} / {String(c.panels.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-display text-[clamp(56px,7vw,120px)] uppercase leading-[0.85] text-bone">{p.word}</h3>
                  <p className="mt-5 font-sans text-[clamp(16px,1.25vw,20px)] font-light leading-snug text-bone/75">{p.note}</p>
                  {i === 1 && (
                    <div className="mt-6 aspect-[16/9] overflow-hidden">
                      <img src={IMAGES.warrior} alt="Anakin Skywalker, Clone Wars general" className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-[calc(var(--gutter)+48px)] overflow-hidden border-y border-bone/10 py-3">
          <div className="pro-marquee will-transform flex w-max whitespace-nowrap">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} className="flex">
                {Array.from({ length: 6 }).map((__, i) => (
                  <span key={i} className="px-6 font-serif text-[clamp(22px,2.4vw,40px)] italic text-bone/80">
                    {c.marquee} <span className="not-italic accent">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ActFrame>
  );
}
