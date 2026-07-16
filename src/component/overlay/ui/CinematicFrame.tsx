import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo, type ReactNode } from "react";
import type { StoryAccent } from "../../../constants/story";
import {
  getSectionLocalProgress,
  subscribeStoryScroll,
} from "../../../hooks/useStoryScroll";
import { ACCENT_BORDER } from "./ChapterLabel";

interface CinematicFrameProps {
  src: string;
  alt: string;
  accent?: StoryAccent;
  sectionIndex: number;
  className?: string;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function Corner({ className }: { className: string }) {
  return <span className={`absolute w-4 h-4 border-bone/50 ${className}`} />;
}

export function CinematicFrame({
  src,
  alt,
  accent = "crimson",
  sectionIndex,
  className = "",
}: CinematicFrameProps) {
  const local = useMotionValue(0);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    const sync = () => local.set(getSectionLocalProgress(sectionIndex));
    sync();
    return subscribeStoryScroll(sync);
  }, [local, sectionIndex]);

  const clip = useTransform(
    local,
    [-0.1, 0.2, 0.8, 1.1],
    [
      "inset(100% 0% 0% 0%)",
      "inset(0% 0% 0% 0%)",
      "inset(0% 0% 0% 0%)",
      "inset(0% 0% 100% 0%)",
    ]
  );
  const opacity = useTransform(local, [-0.1, 0.15, 0.8, 1.1], [0, 1, 1, 0]);

  return (
    <motion.div
      style={reduced ? undefined : { clipPath: clip, opacity }}
      className={`relative w-56 h-64 sm:w-72 sm:h-80 md:w-80 md:h-96 ${className}`}
    >
      <Corner className="top-0 left-0 border-t border-l" />
      <Corner className="top-0 right-0 border-t border-r" />
      <Corner className="bottom-0 left-0 border-b border-l" />
      <Corner className="bottom-0 right-0 border-b border-r" />
      <div
        className={`absolute inset-3 border ${ACCENT_BORDER[accent]}/30 overflow-hidden`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-center opacity-90"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent" />
      </div>
    </motion.div>
  );
}

export function Hairline({
  className = "",
  accent = "crimson",
}: {
  className?: string;
  accent?: StoryAccent;
}) {
  const color =
    accent === "sky"
      ? "bg-sky-light"
      : accent === "bone"
        ? "bg-bone"
        : accent === "ember"
          ? "bg-crimson-ember"
          : "bg-crimson";

  return (
    <div className={`h-px w-16 md:w-24 opacity-70 ${color} ${className}`} />
  );
}

export function ScrollCue() {
  return (
    <div className="flex flex-col items-center gap-3 mt-10 md:mt-14">
      <span className="font-mono text-[10px] tracking-imperial text-steel uppercase">
        Descend
      </span>
      <div className="relative h-12 w-px overflow-hidden bg-steel/20">
        <div className="absolute inset-0 bg-crimson animate-scroll-line" />
      </div>
    </div>
  );
}

export function QuoteMark({
  children,
  accent = "sky",
}: {
  children: ReactNode;
  accent?: StoryAccent;
}) {
  const color =
    accent === "sky"
      ? "text-sky-light"
      : accent === "bone"
        ? "text-bone-warm"
        : "text-crimson";

  return (
    <blockquote
      className={`font-display text-2xl md:text-4xl italic ${color} tracking-wide`}
    >
      “{children}”
    </blockquote>
  );
}
