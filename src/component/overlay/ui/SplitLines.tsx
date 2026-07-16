import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";
import {
  getSectionLocalProgress,
  subscribeStoryScroll,
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

  useEffect(() => {
    const sync = () => local.set(getSectionLocalProgress(sectionIndex));
    sync();
    return subscribeStoryScroll(sync);
  }, [local, sectionIndex]);

  const baseOpacity = useTransform(local, [-0.15, 0.12, 0.75, 1.05], [0, 1, 1, 0]);
  const baseY = useTransform(local, [-0.15, 0.12, 0.75, 1.05], [28, 0, 0, -16]);

  if (reduced) {
    return (
      <div className={`space-y-3 ${className}`}>
        {lines.map((line) => (
          <p key={line} className="font-body text-sm md:text-lg text-bone/90 leading-relaxed">
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
          className="font-body text-sm md:text-lg text-bone/90 leading-relaxed max-w-md text-balance"
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}
