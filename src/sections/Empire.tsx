import { useRef } from "react";
import { COPY, HOTSPOTS } from "../content/story";
import { synth } from "../core/audio";
import { director } from "../core/director";
import { gsap } from "../core/gsap";
import { useSectionFx } from "../hooks/useSectionFx";
import { ActFrame, ActSlug } from "./ActFrame";

/** Respirator telemetry — a single breath cycle as an ECG-like trace. */
const ECG =
  "M0 40 L120 40 L140 40 L150 28 L160 52 L170 10 L182 70 L192 34 L204 40 L330 40 L350 36 C380 14 420 14 450 36 L470 40 L600 40 L620 40 L630 28 L640 52 L650 10 L662 70 L672 34 L684 40 L810 40 L830 36 C860 14 900 14 930 36 L950 40 L1080 40";

export function Empire() {
  const ref = useRef<HTMLElement>(null);
  const c = COPY.empire;

  useSectionFx(ref, ({ root, reduced }) => {
    const path = root.querySelector<SVGPathElement>(".emp-ecg")!;
    const len = path.getTotalLength();
    gsap.fromTo(
      path,
      { strokeDasharray: len, strokeDashoffset: len },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: true },
      },
    );

    root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const target = parseFloat(el.dataset.count!);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: reduced ? 0 : 2.2,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = obj.v.toFixed(decimals);
        },
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
      });
    });

    gsap.from(".emp-spot", {
      opacity: 0,
      x: 30,
      stagger: 0.08,
      duration: 1,
      ease: "sith",
      scrollTrigger: { trigger: ".emp-list", start: "top 85%", toggleActions: "play none none reverse" },
    });
  });

  return (
    <ActFrame ref={ref} index={5} vh={360}>
      <div className="gutter sticky top-0 flex h-screen flex-col justify-center pt-[12vh]">
        <ActSlug index={5} className="absolute left-[var(--gutter)] right-[var(--gutter)] top-[16vh]" />

        <div className="flex items-end justify-between gap-10">
          <div className="max-w-[min(520px,90vw)]">
            <h2 data-split="lines" className="font-display text-[clamp(52px,6.2vw,110px)] uppercase leading-[0.86] text-bone">
              {c.heading}
            </h2>
            <p data-fade className="mt-6 max-w-[40ch] font-sans text-[clamp(15px,1.15vw,19px)] font-light leading-relaxed text-bone/75">
              {c.body}
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-bone/15 pt-5">
              {c.counters.map((k) => (
                <div key={k.label}>
                  <dd className="font-display text-[clamp(32px,3.4vw,56px)] leading-none text-bone">
                    <span data-count={k.value} data-decimals={k.decimals}>
                      0
                    </span>
                    <span className="ml-1 font-mono text-xs accent">{k.unit}</span>
                  </dd>
                  <dt className="hud mt-3">{k.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <ol className="emp-list hidden w-[260px] md:block" aria-label="Armor schematics">
            {HOTSPOTS.map((h, i) => (
              <li key={h.id} className="emp-spot border-t border-bone/15 last:border-b">
                <button
                  className="group flex w-full items-baseline gap-4 py-4 text-left"
                  onPointerEnter={() => {
                    director.hotspot = i;
                    synth.tick(1500 + i * 220);
                  }}
                  onPointerLeave={() => {
                    director.hotspot = -1;
                  }}
                  onFocus={() => (director.hotspot = i)}
                  onBlur={() => (director.hotspot = -1)}
                  data-cursor="Inspect"
                >
                  <span className="hud accent">{h.code}</span>
                  <span className="font-display text-xl uppercase text-bone/60 transition-colors duration-300 group-hover:text-bone">
                    {h.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-[5vh]">
          <div className="mb-2 flex justify-between hud">
            <span>Respirator telemetry</span>
            <span className="animate-[blink_1.6s_steps(1)_infinite] accent">● Live</span>
          </div>
          <svg viewBox="0 0 1080 80" preserveAspectRatio="none" className="h-[8vh] w-full overflow-visible">
            <path d="M0 40 L1080 40" stroke="rgba(236,230,220,0.08)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
            <path
              className="emp-ecg"
              d={ECG}
              stroke="var(--accent)"
              strokeWidth="1.5"
              fill="none"
              vectorEffect="non-scaling-stroke"
              style={{ filter: "drop-shadow(0 0 6px var(--accent))" }}
            />
          </svg>
        </div>
      </div>
    </ActFrame>
  );
}
