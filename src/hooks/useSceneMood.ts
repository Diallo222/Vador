import { useMemo, useState, useEffect } from "react";
import type { ColorRepresentation } from "three";
import { getStoryChapter, subscribeStoryScroll } from "./useStoryScroll";

export type SceneMoodId = "void" | "sky" | "ember" | "bone";

export interface SceneMood {
  id: SceneMoodId;
  fog: ColorRepresentation;
  ambient: ColorRepresentation;
  ambientIntensity: number;
  particle: ColorRepresentation;
  particleCount: number;
  rim: ColorRepresentation;
  rimIntensity: number;
  fillIntensity: number;
}

const MOODS: SceneMood[] = [
  // 01 Home, 02 Origins
  {
    id: "void",
    fog: "#050505",
    ambient: "#2a1010",
    ambientIntensity: 0.18,
    particle: "#b11226",
    particleCount: 80,
    rim: "#4a2020",
    rimIntensity: 0.35,
    fillIntensity: 0.12,
  },
  // 03 Discovery, 04 Prodigy
  {
    id: "sky",
    fog: "#06080c",
    ambient: "#101820",
    ambientIntensity: 0.2,
    particle: "#7dd3fc",
    particleCount: 60,
    rim: "#3a5a7a",
    rimIntensity: 0.4,
    fillIntensity: 0.15,
  },
  // 05 Fall, 06 Empire
  {
    id: "ember",
    fog: "#080303",
    ambient: "#3a0c0c",
    ambientIntensity: 0.16,
    particle: "#e11d2e",
    particleCount: 120,
    rim: "#6a1010",
    rimIntensity: 0.45,
    fillIntensity: 0.1,
  },
  // 07 Redemption, 08 Legacy
  {
    id: "bone",
    fog: "#080706",
    ambient: "#1a1814",
    ambientIntensity: 0.22,
    particle: "#e7e5e4",
    particleCount: 40,
    rim: "#5a5040",
    rimIntensity: 0.3,
    fillIntensity: 0.18,
  },
];

function moodForChapter(chapter: number): SceneMood {
  if (chapter <= 1) return MOODS[0];
  if (chapter <= 3) return MOODS[1];
  if (chapter <= 5) return MOODS[2];
  return MOODS[3];
}

/** Chapter-synced atmosphere mood for the 3D scene (does not touch Theatre). */
export function useSceneMood(): SceneMood {
  const [mood, setMood] = useState(() => moodForChapter(getStoryChapter()));

  useEffect(() => {
    return subscribeStoryScroll(() => {
      setMood(moodForChapter(getStoryChapter()));
    });
  }, []);

  return mood;
}

export function useIsMobileScene(): boolean {
  return useMemo(() => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent), []);
}
