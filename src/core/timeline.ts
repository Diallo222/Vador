import { Color } from "three";

/**
 * The shot list — code-authored replacement for the old Theatre.js project.
 * Every track is a list of [storyTime, value, ease?] keys. Story time `t` runs
 * 0 → 8 (act index + local progress), so tracks read like a film script.
 */

type Ease = "linear" | "inOut" | "in" | "out";
type Vec = readonly number[];
type Key<V> = readonly [t: number, value: V, ease?: Ease];

const EASES: Record<Ease, (x: number) => number> = {
  linear: (x) => x,
  inOut: (x) => x * x * x * (x * (x * 6 - 15) + 10),
  in: (x) => x * x * x,
  out: (x) => 1 - Math.pow(1 - x, 3),
};

function locate<V>(keys: readonly Key<V>[], t: number) {
  if (t <= keys[0][0]) return { a: keys[0], b: keys[0], k: 0 };
  const last = keys[keys.length - 1];
  if (t >= last[0]) return { a: last, b: last, k: 0 };
  let i = 0;
  while (i < keys.length - 2 && t >= keys[i + 1][0]) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const raw = (t - a[0]) / (b[0] - a[0]);
  return { a, b, k: EASES[b[2] ?? "inOut"](raw) };
}

export function sample(keys: readonly Key<number>[], t: number) {
  const { a, b, k } = locate(keys, t);
  return a[1] + (b[1] - a[1]) * k;
}

export function sampleVec(keys: readonly Key<Vec>[], t: number, out: number[]) {
  const { a, b, k } = locate(keys, t);
  for (let i = 0; i < a[1].length; i++) out[i] = a[1][i] + (b[1][i] - a[1][i]) * k;
  return out;
}

/** Hex → linear RGB triplet (once, at module load). */
const c = (hex: string): Vec => new Color(hex).toArray();

export const PALETTE = {
  void: "#050505",
  bone: "#ece6dc",
  saber: "#ff2a2a",
  blood: "#9e0f1c",
  kyber: "#5cc8ff",
  sand: "#d8a865",
  gold: "#f2d49b",
  ember: "#ff5a1f",
} as const;

/** Accent per act — mirrored into the DOM via `--accent`. */
export const ACT_ACCENTS = [
  PALETTE.saber,
  PALETTE.sand,
  PALETTE.kyber,
  PALETTE.kyber,
  PALETTE.ember,
  PALETTE.saber,
  PALETTE.gold,
  PALETTE.bone,
] as const;

const HALF_PI = Math.PI / 2;

/* ------------------------------------------------------------------ */
/* Camera — orbit rig: target + distance + azimuth + elevation          */
/* ------------------------------------------------------------------ */

export const camera = {
  target: [
    [0, [0, 1.5, 0]],
    [0.9, [0, 1.55, 0]],
    [1.6, [0, 1.85, 0]],
    [2.3, [0, 2.1, 0]],
    [2.75, [-1.5, 1.1, 0]],
    [3.2, [-1.85, 1.05, 0]],
    [3.6, [-1.7, 1.1, 0]],
    [4.05, [0, 1.05, 0]],
    [4.8, [0, 1.1, 0]],
    [5.2, [0.85, 1.1, 0]],
    [5.55, [0.75, 1.1, 0]],
    [5.9, [0.8, 1.15, 0]],
    [6.25, [1.15, 1.45, 0]],
    [6.75, [1.1, 1.4, 0]],
    [7.2, [0, 1.5, 0]],
    [8, [0, 1.5, 0]],
  ] as Key<Vec>[],
  distance: [
    [0, 6.2],
    [0.9, 5.0],
    [1.6, 5.6],
    [2.3, 7.2],
    [2.75, 5.0],
    [3.2, 4.6],
    [3.6, 4.2],
    [4.05, 6.4],
    [4.8, 5.3],
    [5.2, 5.6],
    [5.55, 5.2],
    [5.9, 5.4],
    [6.25, 3.6],
    [6.75, 4.0],
    [7.2, 7.6],
    [8, 6.2],
  ] as Key<number>[],
  azimuth: [
    [0, 0],
    [0.9, 0.12],
    [1.6, 0.4],
    [2.3, -0.25],
    [2.75, -0.75],
    [3.2, -1.05],
    [3.6, -0.55],
    [4.05, 0],
    [4.8, 0.08],
    [5.2, -0.35],
    [5.55, 0.15],
    [5.9, 0.55],
    [6.25, 0.1],
    [6.75, -0.05],
    [7.2, -0.25],
    [8, 0],
  ] as Key<number>[],
  elevation: [
    [0, 0.03],
    [0.9, 0.06],
    [1.6, 0.14],
    [2.3, 0.42],
    [2.75, 0.08],
    [3.2, -0.14],
    [3.6, -0.04],
    [4.05, 0.04],
    [4.8, 0.08],
    [5.2, 0.12],
    [5.55, 0.22],
    [5.9, 0.05],
    [6.25, 0.0],
    [6.75, 0.04],
    [7.2, 0.05],
    [8, 0.03],
  ] as Key<number>[],
  fov: [
    [0, 30],
    [2.3, 34],
    [3.2, 32],
    [4.05, 30],
    [6.25, 27],
    [7.2, 30],
  ] as Key<number>[],
  /** Dutch angle (radians) for dramatic beats */
  roll: [
    [0, 0],
    [2.75, 0],
    [3.2, 0.035],
    [3.6, 0],
    [4.4, -0.025],
    [4.9, 0],
  ] as Key<number>[],
};

/* ------------------------------------------------------------------ */
/* Actors                                                              */
/* ------------------------------------------------------------------ */

export const helmet = {
  position: [
    [0, [0, 1.5, 0]],
    [1.5, [0, 1.75, 0]],
    [6.9, [0, 1.65, 0]],
    [8, [0, 1.5, 0]],
  ] as Key<Vec>[],
  rotationY: [
    [0, 0],
    [1.4, 0.55],
    [6.9, -0.4],
    [7.7, 0],
  ] as Key<number>[],
  /** 0 = whole, 1 = ash */
  dissolve: [
    [0, 0],
    [0.55, 0],
    [1.45, 1, "in"],
    [6.95, 1],
    [7.75, 0, "out"],
  ] as Key<number>[],
  edge: [
    [0, c(PALETTE.ember)],
    [1.2, c(PALETTE.sand)],
    [6.8, c(PALETTE.gold)],
  ] as Key<Vec>[],
};

export const anakin = {
  position: [[0, [-1.2, 0, 0]]] as Key<Vec>[],
  rotationY: [
    [0, 0.55],
    [3.2, 0.55],
    [3.95, HALF_PI],
  ] as Key<number>[],
  dissolve: [
    [0, 1],
    [2.55, 1],
    [3.25, 0, "out"],
    [4.85, 0],
    [5.3, 1, "in"],
  ] as Key<number>[],
  edge: [
    [0, c(PALETTE.kyber)],
    [4.5, c(PALETTE.kyber)],
    [4.85, c(PALETTE.ember)],
  ] as Key<Vec>[],
};

export const vader = {
  position: [[0, [1.2, 0, 0]]] as Key<Vec>[],
  rotationY: [
    [0, -HALF_PI],
    [5.05, -HALF_PI],
    [5.5, -0.22],
  ] as Key<number>[],
  dissolve: [
    [0, 1],
    [3.65, 1],
    [4.3, 0, "out"],
    [6.15, 0],
    [6.8, 1, "in"],
  ] as Key<number>[],
  edge: [
    [0, c(PALETTE.ember)],
    [5.9, c(PALETTE.ember)],
    [6.1, c(PALETTE.gold)],
  ] as Key<Vec>[],
  /** Saber blade length — retracts at the redemption */
  saber: [
    [0, 1],
    [6.05, 1],
    [6.3, 0, "in"],
  ] as Key<number>[],
};

/** Giant 3D titles behind the helmet */
export const titles = {
  vader: [
    [0, 1],
    [0.7, 1],
    [1.05, 0],
  ] as Key<number>[],
  anakin: [
    [0, 0],
    [7.15, 0],
    [7.7, 1],
  ] as Key<number>[],
};

/* ------------------------------------------------------------------ */
/* Atmosphere                                                          */
/* ------------------------------------------------------------------ */

export const mood = {
  fog: [
    [0, c("#050303")],
    [1.5, c("#0a0704")],
    [2.4, c("#03070b")],
    [3.55, c("#03070b")],
    [3.9, c("#0b0402")],
    [5.2, c("#060203")],
    [6.4, c("#0b0906")],
    [7.4, c("#060606")],
  ] as Key<Vec>[],
  /** Particle color + behavior: rise speed, swirl, size, opacity */
  particle: [
    [0, c(PALETTE.saber)],
    [1.3, c(PALETTE.sand)],
    [2.2, c(PALETTE.kyber)],
    [3.55, c(PALETTE.kyber)],
    [3.9, c(PALETTE.ember)],
    [5.2, c("#ff3a3a")],
    [6.3, c(PALETTE.gold)],
    [7.4, c(PALETTE.bone)],
  ] as Key<Vec>[],
  rise: [
    [0, 0.12],
    [1.3, 0.05],
    [2.2, 0.08],
    [3.9, 0.55],
    [5.2, 0.18],
    [6.3, 0.3],
    [7.4, 0.08],
  ] as Key<number>[],
  swirl: [
    [0, 0.1],
    [1.3, 0.55],
    [2.2, 1],
    [3.6, 0.6],
    [3.9, 0.2],
    [6.3, 0.35],
    [7.4, 0.1],
  ] as Key<number>[],
  particleOpacity: [
    [0, 0.35],
    [1.3, 0.75],
    [2.2, 0.9],
    [3.9, 1],
    [5.2, 0.5],
    [6.3, 0.85],
    [7.4, 0.4],
  ] as Key<number>[],
  key: [
    [0, c("#ffd6c9")],
    [1.4, c("#ffd9a8")],
    [2.3, c("#cfe9ff")],
    [3.55, c("#dcefff")],
    [3.9, c("#ffb08a")],
    [5.2, c("#ffe2e2")],
    [6.3, c("#ffe7bd")],
    [7.4, c("#f2ede6")],
  ] as Key<Vec>[],
  rim: [
    [0, c(PALETTE.saber)],
    [1.3, c(PALETTE.sand)],
    [2.2, c(PALETTE.kyber)],
    [3.55, c(PALETTE.kyber)],
    [3.9, c(PALETTE.ember)],
    [5.2, c("#ff4636")],
    [6.3, c(PALETTE.gold)],
    [7.4, c("#c8c0b4")],
  ] as Key<Vec>[],
  rimIntensity: [
    [0, 2.2],
    [1.3, 4],
    [3.9, 6.5],
    [5.2, 3.4],
    [7.4, 2.2],
  ] as Key<number>[],
  backdrop: [
    [0, c("#3a0408")],
    [1.3, c("#3a2208")],
    [2.2, c("#06253a")],
    [3.55, c("#0a2236")],
    [3.9, c("#4a1004")],
    [5.2, c("#2a0306")],
    [6.3, c("#3a2c14")],
    [7.4, c("#1a1816")],
  ] as Key<Vec>[],
};

/* ------------------------------------------------------------------ */
/* Post-processing                                                     */
/* ------------------------------------------------------------------ */

export const grade = {
  tint: [
    [0, c("#ffe3df")],
    [1.3, c("#fff0d8")],
    [2.2, c("#e3f3ff")],
    [3.55, c("#e8f4ff")],
    [3.9, c("#ffe8dc")],
    [5.2, c("#ffe0e0")],
    [6.3, c("#fff4e0")],
    [7.4, c("#ffffff")],
  ] as Key<Vec>[],
  saturation: [
    [0, 0.9],
    [1.3, 0.95],
    [2.2, 1.0],
    [3.9, 1.05],
    [5.2, 0.7],
    [6.3, 0.85],
    [7.4, 0.55],
  ] as Key<number>[],
  /** Duality split: amount of the effect and the base seam position (0‥1 of screen) */
  duality: [
    [0, 0],
    [3.85, 0],
    [4.15, 1],
    [4.85, 1],
    [5.1, 0],
  ] as Key<number>[],
  split: [
    [0, 0.82],
    [4.05, 0.82],
    [4.85, 0.12, "linear"],
  ] as Key<number>[],
  heat: [
    [0, 0],
    [3.8, 0],
    [4.2, 1],
    [4.9, 1],
    [5.2, 0],
  ] as Key<number>[],
  bloom: [
    [0, 1.1],
    [3.9, 1.5],
    [5.2, 1.15],
    [6.3, 1.6],
    [7.4, 1.0],
  ] as Key<number>[],
  exposure: [
    [0, 1],
    [6.1, 1],
    [6.45, 1.18],
    [7.2, 1],
  ] as Key<number>[],
};

/** Hotspot visibility window (Empire) */
export const hotspots = [
  [0, 0],
  [5.3, 0],
  [5.45, 1],
  [5.95, 1],
  [6.08, 0],
] as Key<number>[];
