import { useEffect, type RefObject } from "react";
import { device } from "../core/device";
import { useDirector } from "../core/director";
import { gsap, ScrollTrigger, SplitText } from "../core/gsap";

/**
 * Declarative scroll effects for a section. Mark up elements with:
 *  - data-split="lines" | "chars"   masked SplitText reveal on enter
 *  - data-scrub-words               words light up as you read (scrubbed)
 *  - data-clip                      image wipes open, inner <img> parallax
 *  - data-fade                      simple rise + fade on enter
 *  - data-parallax="0.2"            vertical drift while the section scrolls
 * `extra` builds any section-specific timeline inside the same context and
 * may return a cleanup function.
 */
export function useSectionFx(
  scope: RefObject<HTMLElement>,
  extra?: (self: { root: HTMLElement; reduced: boolean }) => void | (() => void),
) {
  const started = useDirector((s) => s.started);

  useEffect(() => {
    const root = scope.current;
    if (!root || !started) return;
    const reduced = device.reducedMotion;
    let ctx: gsap.Context | null = null;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
          const type = el.dataset.split === "chars" ? "chars" : "lines";
          const split = SplitText.create(el, {
            type: type === "chars" ? "lines,chars" : "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit: (self) => {
              if (reduced) return;
              const targets = type === "chars" ? self.chars : self.lines;
              return gsap.from(targets, {
                yPercent: 115,
                rotate: type === "chars" ? 8 : 2,
                duration: type === "chars" ? 1.1 : 1.3,
                stagger: type === "chars" ? 0.025 : 0.09,
                ease: "sith",
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  toggleActions: "play none none reverse",
                },
              });
            },
          });
          void split;
        });

        root.querySelectorAll<HTMLElement>("[data-scrub-words]").forEach((el) => {
          const split = SplitText.create(el, { type: "words" });
          gsap.fromTo(
            split.words,
            { opacity: 0.12 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 45%", scrub: true },
            },
          );
        });

        root.querySelectorAll<HTMLElement>("[data-clip]").forEach((el) => {
          const img = el.querySelector("img");
          if (!reduced) {
            gsap.fromTo(
              el,
              { clipPath: "inset(18% 12% 18% 12%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: { trigger: el, start: "top 95%", end: "top 35%", scrub: true },
              },
            );
          }
          if (img && !reduced && device.finePointer) {
            // Hover: the still ripples like a corrupted holo-recording
            const warp = document.querySelector<SVGFEDisplacementMapElement>("#holo-warp feDisplacementMap");
            const noise = document.querySelector<SVGFETurbulenceElement>("#holo-warp feTurbulence");
            const state = { scale: 0 };
            const apply = () => {
              warp?.setAttribute("scale", state.scale.toFixed(1));
              noise?.setAttribute("baseFrequency", `0.012 ${(0.04 + state.scale * 0.002).toFixed(4)}`);
            };
            el.addEventListener("pointerenter", () => {
              img.style.filter = "url(#holo-warp)";
              gsap.to(state, { scale: 38, duration: 0.25, ease: "power2.out", onUpdate: apply });
              gsap.to(state, { scale: 0, duration: 0.9, delay: 0.25, ease: "power3.out", onUpdate: apply, onComplete: () => void (img.style.filter = "") });
            });
          }
          if (img && !reduced) {
            gsap.fromTo(
              img,
              { yPercent: -10, scale: 1.25 },
              {
                yPercent: 10,
                scale: 1.08,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          }
        });

        root.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: reduced ? 0 : 30,
            duration: 1.2,
            ease: "sith",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
          });
        });

        root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          if (reduced) return;
          const amount = parseFloat(el.dataset.parallax || "0.2");
          gsap.fromTo(
            el,
            { yPercent: amount * 100 },
            {
              yPercent: -amount * 100,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // A returned function runs when the context reverts (ticker cleanup etc.)
        return extra?.({ root, reduced });
      }, root);
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);
}
