import { useSyncExternalStore } from "react";

export const ACT_COUNT = 8;

/**
 * The director — a single mutable store shared by the DOM and the WebGL stage.
 * Per-frame values (t, velocity, pointer…) are read imperatively; React only
 * subscribes to coarse state (act, started, menu) through `useDirector`.
 */
export const director = {
  /** Story time: act index + local progress, 0 → ACT_COUNT */
  t: 0,
  /** Raw Lenis velocity (px / frame) */
  velocity: 0,
  /** Pointer in NDC (-1 → 1), y up */
  pointer: { x: 0, y: 0 },
  /** User offset on the duality blade (-1 → 1 of screen width) */
  splitOffset: 0,
  /** 1 = helmet in ashes at boot; tweened to 0 on ignite */
  intro: 1,
  /** 0 → 1 VHS rewind distortion */
  rewind: 0,
  /** 0 → 1 full-frame flash */
  flash: 0,
  /** Respirator loudness 0 → 1 (sine fallback when silent) */
  breath: 0,
  /** Hovered/active armor hotspot, -1 = none */
  hotspot: -1,
  /** 0 → 1 hyperspace warp while jumping between acts */
  warp: 0,
};

interface CoarseState {
  act: number;
  started: boolean;
  menuOpen: boolean;
  muted: boolean;
}

let state: CoarseState = { act: 0, started: false, menuOpen: false, muted: false };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setState(patch: Partial<CoarseState>) {
  const next = { ...state, ...patch };
  const changed = (Object.keys(patch) as (keyof CoarseState)[]).some((k) => next[k] !== state[k]);
  if (!changed) return;
  state = next;
  emit();
}

export function getState() {
  return state;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useDirector<T>(select: (s: CoarseState) => T): T {
  return useSyncExternalStore(subscribe, () => select(state), () => select(state));
}

/* ------------------------------------------------------------------ */
/* Story time ⇄ scroll                                                 */
/* ------------------------------------------------------------------ */

let starts: number[] = [];
let maxScroll = 1;

/** Cache the absolute scroll offset where each act begins. */
export function measureActs() {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-act]"));
  starts = els.map((el) => el.getBoundingClientRect().top + window.scrollY);
  maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

/** Scroll position → story time. Robust to jumps (no per-section triggers). */
export function scrollToStoryTime(scroll: number) {
  if (!starts.length) return 0;
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];
    const end = i + 1 < starts.length ? starts[i + 1] : maxScroll;
    if (scroll < end || i === starts.length - 1) {
      const span = Math.max(1, end - start);
      return Math.min(ACT_COUNT, i + Math.max(0, Math.min(1, (scroll - start) / span)));
    }
  }
  return ACT_COUNT;
}

export function actStart(index: number) {
  return starts[index] ?? 0;
}

export function updateStoryTime(scroll: number) {
  director.t = scrollToStoryTime(scroll);
  const act = Math.min(ACT_COUNT - 1, Math.floor(director.t + 0.02));
  if (act !== state.act) setState({ act });
}
