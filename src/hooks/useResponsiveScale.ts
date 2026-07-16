import { useEffect, useState } from "react";

const MOBILE_UA = /iPhone|iPad|iPod|Android/i;

function computeScale() {
  const isMobile = MOBILE_UA.test(navigator.userAgent);
  return Math.min(
    Math.max(window.innerWidth / 1300, isMobile ? 0.6 : 0.8),
    isMobile ? 1.0 : 1.2
  );
}

/** Responsive group scale — updates on resize. Camera stays outside this scale. */
export function useResponsiveScale(): number {
  const [scale, setScale] = useState(computeScale);

  useEffect(() => {
    const onResize = () => setScale(computeScale());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return scale;
}
