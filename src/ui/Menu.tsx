import { useEffect, useRef, useState } from "react";
import { ACTS } from "../content/story";
import { synth } from "../core/audio";
import { setState, useDirector } from "../core/director";
import { gsap, SCRAMBLE_CHARS, useGSAP } from "../core/gsap";
import { getLenis } from "../core/smoothScroll";
import { travelTo } from "../core/transition";

/** Full-screen chapter index, opened with a saber-cut wipe. */
export function Menu() {
  const open = useDirector((s) => s.menuOpen);
  const current = useDirector((s) => s.act);
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [hovered, setHovered] = useState(-1);
  const lastFocus = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      gsap.set(root.current, { clipPath: "inset(50% 0% 50% 0%)", visibility: "hidden" });
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: "visible" })
        .fromTo(".menu-seam", { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.4, ease: "ignite" })
        .to(root.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "sith" }, 0.25)
        .to(".menu-seam", { opacity: 0, duration: 0.3 }, 0.6)
        .fromTo(".menu-item", { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1, stagger: 0.05, ease: "sith" }, 0.45)
        .from(".menu-meta", { opacity: 0, duration: 0.6, stagger: 0.05 }, 0.8);
    },
    { scope: root },
  );

  useEffect(() => {
    const lenis = getLenis();
    // Closed menu is removed from the tab order / a11y tree
    root.current?.toggleAttribute("inert", !open);
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement | null;
      lenis?.stop();
      tl.current?.timeScale(1).play();
      window.setTimeout(() => root.current?.querySelector<HTMLButtonElement>(".menu-item")?.focus(), 500);
    } else {
      lenis?.start();
      tl.current?.timeScale(1.6).reverse();
      lastFocus.current?.focus?.();
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setState({ menuOpen: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Preview card trails the cursor
  useEffect(() => {
    const el = preview.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });
    const rTo = gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(Math.max(-12, Math.min(12, (e.clientX - lastX) * 0.6)));
      lastX = e.clientX;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useGSAP(() => {
    gsap.to(preview.current, {
      opacity: hovered >= 0 ? 1 : 0,
      scale: hovered >= 0 ? 1 : 0.85,
      duration: 0.5,
      ease: "power3.out",
    });
  }, [hovered]);

  // The transition layer closes the menu once its doors cover the screen
  const go = (index: number) => travelTo(index);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[60] overflow-hidden bg-void/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Chapter index"
      aria-hidden={!open}
    >
      <div className="menu-seam pointer-events-none absolute left-0 right-0 top-1/2 z-10 h-[2px] bg-white text-saber glow-saber" />

      <div
        ref={preview}
        className="pointer-events-none fixed left-0 top-0 z-0 hidden h-[34vh] w-[26vw] overflow-hidden opacity-0 md:block"
        style={{ translate: "-50% -50%" }}
      >
        {ACTS.map((a, i) => (
          <img
            key={a.id}
            src={a.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover grayscale-[40%] transition-[opacity,transform] duration-700"
            style={{ opacity: hovered === i ? 1 : 0, transform: hovered === i ? "scale(1)" : "scale(1.15)" }}
            loading="lazy"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-void/70 to-transparent" />
      </div>

      <div className="relative z-[1] flex h-full flex-col justify-between p-[var(--gutter)]">
        <div className="flex items-start justify-between">
          <p className="menu-meta hud">Imperial Archive // Chapter index</p>
          <button
            className="menu-meta group flex h-10 items-center gap-3 rounded-full border border-bone/25 px-4 hover:border-bone"
            onClick={() => {
              synth.whoosh(false);
              setState({ menuOpen: false });
            }}
            data-cursor="Close"
          >
            <span className="hud text-bone">Close</span>
            <span className="relative h-3 w-3" aria-hidden>
              <span className="absolute left-0 top-1/2 block h-px w-3 rotate-45 bg-bone" />
              <span className="absolute left-0 top-1/2 block h-px w-3 -rotate-45 bg-bone" />
            </span>
          </button>
        </div>

        <nav aria-label="Acts">
          <ul onPointerLeave={() => setHovered(-1)}>
            {ACTS.map((a, i) => (
              <li key={a.id} className="overflow-hidden border-b border-bone/10 first:border-t">
                <button
                  className="menu-item group flex w-full items-baseline gap-4 py-[0.9vh] text-left md:gap-8"
                  onPointerEnter={(e) => {
                    setHovered(i);
                    synth.tick(1200 + i * 120);
                    const title = e.currentTarget.querySelector(".menu-title");
                    if (title)
                      gsap.to(title, {
                        duration: 0.6,
                        scrambleText: { text: a.title, chars: SCRAMBLE_CHARS, speed: 0.8 },
                      });
                  }}
                  onClick={() => go(i)}
                  data-cursor="Jump"
                >
                  <span className="hud w-10 shrink-0 tabular-nums">{a.numeral === "0" ? "00" : a.numeral}</span>
                  <span
                    className={`menu-title font-display text-[8.4vw] uppercase leading-[0.95] transition-[color,transform] duration-500 ease-out4 group-hover:translate-x-4 md:text-[7vh] ${
                      i === current ? "accent" : "text-bone group-hover:text-bone"
                    } ${hovered >= 0 && hovered !== i ? "opacity-30" : "opacity-100"}`}
                  >
                    {a.title}
                  </span>
                  <span className="hud ml-auto hidden md:inline">{a.place}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex justify-between">
          <p className="menu-meta hud">Esc to close</p>
          <p className="menu-meta hud">You are in act {ACTS[current].numeral}</p>
        </div>
      </div>
    </div>
  );
}
