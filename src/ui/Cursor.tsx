import { useEffect, useRef } from "react";
import { device } from "../core/device";
import { director } from "../core/director";
import { gsap } from "../core/gsap";

/**
 * Pointer tracking for the whole site (feeds the WebGL flashlight) plus a
 * custom cursor: precise dot + lagging ring that expands into a label over
 * anything tagged `data-cursor="Label"`.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const enabled = device.finePointer && !device.reducedMotion;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      director.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      director.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    if (!enabled) return () => window.removeEventListener("pointermove", onMove);

    document.documentElement.classList.add("has-cursor");
    const d = dot.current!;
    const r = ring.current!;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, x: innerWidth / 2, y: innerHeight / 2 });
    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3" });

    const follow = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    let current: Element | null = null;
    const over = (e: PointerEvent) => {
      const target = (e.target as Element).closest?.("[data-cursor]") ?? null;
      if (target === current) return;
      current = target;
      const text = target?.getAttribute("data-cursor") ?? "";
      if (label.current) label.current.textContent = text;
      gsap.to(r, {
        width: target ? 84 : 34,
        height: target ? 84 : 34,
        backgroundColor: target ? "rgba(236,230,220,1)" : "rgba(236,230,220,0)",
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(label.current, { opacity: target ? 1 : 0, scale: target ? 1 : 0.6, duration: 0.35 });
      gsap.to(d, { scale: target ? 0 : 1, duration: 0.3 });
    };
    const down = () => gsap.to(r, { scale: 0.82, duration: 0.2 });
    const up = () => gsap.to(r, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    const leaveWindow = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
    const enterWindow = () => gsap.to([d, r], { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", follow, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leaveWindow);
    document.addEventListener("pointerenter", enterWindow);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointermove", follow);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leaveWindow);
      document.removeEventListener("pointerenter", enterWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] mix-blend-difference" aria-hidden>
      <div ref={ring} className="fixed left-0 top-0 grid h-[34px] w-[34px] place-items-center rounded-full border border-bone/70">
        <span ref={label} className="font-mono text-[9px] uppercase tracking-[0.2em] text-void opacity-0" />
      </div>
      <div ref={dot} className="fixed left-0 top-0 h-[5px] w-[5px] rounded-full bg-bone" />
    </div>
  );
}
