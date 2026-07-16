import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";
import {
  getSectionLocalProgress,
  subscribeStoryScroll,
  TOTAL_PAGES,
} from "../../../hooks/useStoryScroll";

interface SplitLinesProps {
  lines: string[];
  className?: string;
  sectionIndex: number;
  delayPerLine?: number;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function SplitLines({
  lines,
  className = "",
  sectionIndex,
  delayPerLine = 0.06,
}: SplitLinesProps) {
  const local = useMotionValue(0);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const isFinale = sectionIndex === TOTAL_PAGES - 1;

  useEffect(() => {
    const sync = () => local.set(getSectionLocalProgress(sectionIndex));
    sync();
    return subscribeStoryScroll(sync);
  }, [local, sectionIndex]);

  const range = isFinale
    ? ([-0.2, 0.08, 1, 1.2] as const)
    : ([-0.15, 0.12, 0.75, 1.05] as const);
  const opacityOut = isFinale
    ? ([0, 1, 1, 1] as const)
    : ([0, 1, 1, 0] as const);
  const yOut = isFinale
    ? ([24, 0, 0, 0] as const)
    : ([28, 0, 0, -16] as const);

  const baseOpacity = useTransform(local, [...range], [...opacityOut]);
  const baseY = useTransform(local, [...range], [...yOut]);

  if (reduced) {
    return (
      <div className={`space-y-3 ${className}`}>
        {lines.map((line) => (
          <p
            key={line}
            className="font-body font-semibold text-sm md:text-lg text-bone leading-relaxed"
          >
            {line}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {lines.map((line, i) => (
        <motion.p
          key={line}
          style={{
            opacity: baseOpacity,
            y: baseY,
            transitionDelay: `${i * delayPerLine}s`,
          }}
          className="font-body font-semibold text-sm md:text-lg text-bone leading-relaxed max-w-lg text-balance"
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}
