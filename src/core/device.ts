const mq = (query: string) =>
  typeof window !== "undefined" && window.matchMedia(query).matches;

/** Evaluated once at boot — layout-level decisions don't need live updates. */
export const device = {
  reducedMotion: mq("(prefers-reduced-motion: reduce)"),
  finePointer: mq("(hover: hover) and (pointer: fine)"),
  mobile: mq("(max-width: 767px)") || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
};

/** Quality tier for the WebGL stage. */
export const quality = device.mobile
  ? { dpr: [1, 1.5] as [number, number], ash: 3500, atmosphere: 900, msaa: 0 }
  : { dpr: [1, 1.75] as [number, number], ash: 9000, atmosphere: 2600, msaa: 4 };
