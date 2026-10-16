import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase, useGSAP);

/** House eases — heavy, deliberate, Imperial. */
CustomEase.create("sith", "0.7, 0, 0.2, 1");
CustomEase.create("ignite", "M0,0 C0.08,0.62 0.18,1 1,1");

gsap.defaults({ ease: "power3.out", duration: 1 });

/** Glyph pool for scramble-decoding HUD text. */
export const SCRAMBLE_CHARS = "█▓▒░/\\<>[]{}=+*#01";

// Dev-only handle for scripted visual QA (slow-motion filmstrips)
if (import.meta.env.DEV) Object.assign(window, { __gsap: gsap });

export { gsap, ScrollTrigger, SplitText, useGSAP };
