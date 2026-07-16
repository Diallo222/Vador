import { useEffect, useRef, useState } from "react";

const CURSOR_SPEED = 0.12;

export const Cursor = () => {
  const cursorOutline = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const outline = useRef({ x: 0, y: 0 });
  const rafId = useRef(0);
  const [expanded, setExpanded] = useState(false);

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

    const onMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };

    document.addEventListener("mousemove", onMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  useEffect(() => {
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const magnetic = target.closest(
        "h1, h2, button, [data-cursor='expand']"
      );
      setExpanded(Boolean(magnetic));
    };
    document.addEventListener("mouseover", onOver);
    return () => document.removeEventListener("mouseover", onOver);
  }, []);

  return (
    <div
      ref={cursorOutline}
      aria-hidden
      className={`invisible md:visible fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none mix-blend-difference transition-[width,height,background-color] duration-300 ease-out ${
        expanded
          ? "w-20 h-20 bg-bone"
          : "w-2.5 h-2.5 bg-crimson"
      }`}
    />
  );
};
