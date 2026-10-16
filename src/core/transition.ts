import { scrollToAct } from "./smoothScroll";

type Handler = (index: number) => void;

let handler: Handler | null = null;

/** The transition layer registers itself here; anything can request a jump. */
export function registerTravel(fn: Handler) {
  handler = fn;
  return () => {
    if (handler === fn) handler = null;
  };
}

/** Navigate to an act through the hyperspace transition (falls back to a glide). */
export function travelTo(index: number) {
  if (handler) handler(index);
  else scrollToAct(index);
}
