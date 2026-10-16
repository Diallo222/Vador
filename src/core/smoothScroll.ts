import Lenis from "lenis";
import { device } from "./device";
import { actStart, director, measureActs, updateStoryTime } from "./director";
import { gsap, ScrollTrigger } from "./gsap";

let lenis: Lenis | null = null;

/** Lenis on the GSAP ticker → one RAF loop for scroll, ScrollTrigger and tweens. */
export function initSmoothScroll() {
  if (lenis) return lenis;

  lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: !device.reducedMotion,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.4,
  });

  lenis.on("scroll", (l: Lenis) => {
    director.velocity = l.velocity;
    updateStoryTime(l.scroll);
    ScrollTrigger.update();
  });

  const raf = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  const remeasure = () => {
    measureActs();
    updateStoryTime(window.scrollY);
  };
  ScrollTrigger.addEventListener("refresh", remeasure);
  remeasure();

  // Velocity decays to zero when scrolling stops
  gsap.ticker.add(() => {
    director.velocity *= 0.9;
  });

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle("is-locked", locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}

export function scrollToAct(index: number, duration = 2.2) {
  const target = actStart(index) + (index === 0 ? 0 : window.innerHeight * 0.02);
  lenis?.scrollTo(target, {
    immediate: device.reducedMotion,
    duration,
    easing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  });
}

/** Teleport to an act — used under the transition cover, so no scroll-through. */
export function jumpToAct(index: number) {
  const target = actStart(index) + (index === 0 ? 0 : window.innerHeight * 0.02);
  if (lenis) {
    lenis.start();
    lenis.scrollTo(target, { immediate: true, force: true });
  } else {
    window.scrollTo(0, target);
  }
  director.velocity = 0;
  updateStoryTime(target);
  ScrollTrigger.update();
}

/** Rewind the whole saga: VHS distortion while scrolling back to the top. */
export function rewindToStart() {
  const l = lenis;
  if (!l) return;
  gsap.to(director, { rewind: 1, duration: 0.5, ease: "power2.out" });
  l.scrollTo(0, {
    immediate: device.reducedMotion,
    duration: 4.2,
    easing: (x) => x * x * (3 - 2 * x),
    onComplete: () => {
      gsap.to(director, { rewind: 0, duration: 0.8, ease: "power2.inOut" });
    },
  });
}
