import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo, type ReactNode } from "react";
import {
  getSectionLocalProgress,
  subscribeStoryScroll,
  TOTAL_PAGES,
} from "../../hooks/useStoryScroll";

interface SectionProps {
  children: ReactNode;
  index: number;
  align?: "left" | "right" | "center";
  mobileTop?: boolean;
  className?: string;
  /** Widen content column for statement / epitaph layouts */
  wide?: boolean;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const alignClass = {
  left: "items-start text-left",
  right: "items-end text-right",
  center: "items-center text-center",
};

/**
 * Full-viewport story beat with scroll-windowed opacity / translate.
 */
const Section = ({
  children,
  index,
  align = "left",
  mobileTop = false,
  className = "",
  wide = false,
}: SectionProps) => {
  const local = useMotionValue(0);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    const sync = () => local.set(getSectionLocalProgress(index, TOTAL_PAGES));
    sync();
    return subscribeStoryScroll(sync);
  }, [index, local]);

  const opacity = useTransform(
    local,
    [-0.2, 0.08, 0.72, 1.05],
    [0, 1, 1, 0]
  );
  const y = useTransform(local, [-0.2, 0.08, 0.72, 1.05], [40, 0, 0, -24]);

  const column = wide
    ? "max-w-5xl lg:max-w-6xl"
    : align === "center"
      ? "max-w-3xl lg:max-w-4xl"
      : "max-w-xl lg:max-w-2xl";

  return (
    <motion.section
      style={reduced ? { opacity: 1 } : { opacity, y }}
      className={`
        h-screen w-screen px-6 sm:px-10 md:px-16 lg:px-24
        py-10 md:py-14 mx-auto
        flex flex-col select-none pointer-events-none
        ${mobileTop ? "justify-start pt-16 md:pt-14 md:justify-center" : "justify-center"}
        ${alignClass[align]}
        ${className}
      `}
    >
      <div
        className={`w-full ${column} ${align === "right" ? "md:ml-auto" : ""} ${align === "center" ? "mx-auto" : ""}`}
      >
        {children}
      </div>
    </motion.section>
  );
};

export default Section;
