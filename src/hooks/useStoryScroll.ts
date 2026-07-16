import { useSyncExternalStore } from "react";

const TOTAL_PAGES = 8;

type Listener = () => void;

let offset = 0;
const listeners = new Set<Listener>();

export function setStoryScrollOffset(value: number) {
  const next = Math.min(1, Math.max(0, value));
  if (Math.abs(next - offset) < 0.00005) return;
  offset = next;
  listeners.forEach((listener) => listener());
}

export function getStoryScrollOffset() {
  return offset;
}

export function subscribeStoryScroll(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useStoryScrollOffset() {
  return useSyncExternalStore(
    subscribeStoryScroll,
    getStoryScrollOffset,
    () => 0
  );
}

export function getStoryChapter(pages = TOTAL_PAGES) {
  return Math.min(pages - 1, Math.floor(getStoryScrollOffset() * pages));
}

export function useStoryChapter(pages = TOTAL_PAGES) {
  const scrollOffset = useStoryScrollOffset();
  return Math.min(pages - 1, Math.floor(scrollOffset * pages));
}

/** Local 0→1 progress within a chapter window. */
export function getSectionLocalProgress(
  sectionIndex: number,
  pages = TOTAL_PAGES
) {
  return getStoryScrollOffset() * pages - sectionIndex;
}

export { TOTAL_PAGES };
