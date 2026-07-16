import { useEffect, useRef, useState } from "react";

const CURSOR_SPEED = 0.08;

export const Cursor = () => {
  const cursorOutline = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -10, y: -10 });
  const outline = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const [hoverButton, setHoverButton] = useState(false);

  useEffect(() => {
    const animate = () => {
      const distX = mouse.current.x - outline.current.x;
      const distY = mouse.current.y - outline.current.y;

      outline.current.x += distX * CURSOR_SPEED;
      outline.current.y += distY * CURSOR_SPEED;

      if (cursorOutline.current) {
        cursorOutline.current.style.left = `${outline.current.x}px`;
        cursorOutline.current.style.top = `${outline.current.y}px`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    const mouseEventsListener = (event: MouseEvent) => {
      mouse.current.x = event.pageX;
      mouse.current.y = event.pageY;
    };

    document.addEventListener("mousemove", mouseEventsListener);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", mouseEventsListener);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  useEffect(() => {
    const mouseEventListener = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.tagName.toLowerCase() === "h1") {
        setHoverButton(true);
      } else {
        setHoverButton(false);
      }
    };
    document.addEventListener("mouseover", mouseEventListener);
    return () => {
      document.removeEventListener("mouseover", mouseEventListener);
    };
  }, []);

  return (
    <div
      className={`invisible md:visible  z-50 fixed -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-transform
        ${
          hoverButton
            ? " bg-red-600 w-32 h-32  mix-blend-difference"
            : "bg-red-600 w-3 h-3"
        }`}
      ref={cursorOutline}
    />
  );
};
