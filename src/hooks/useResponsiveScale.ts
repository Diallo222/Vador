import { useMemo } from "react";

const MOBILE_UA = /iPhone|iPad|iPod|Android/i;

/** Responsive group scale matching the original Scene numbers. */
export function useResponsiveScale(): number {
  return useMemo(() => {
    const isMobile = MOBILE_UA.test(navigator.userAgent);
    return Math.min(
      Math.max(window.innerWidth / 1300, isMobile ? 0.6 : 0.8),
      isMobile ? 1.0 : 1.2
    );
  }, []);
}
