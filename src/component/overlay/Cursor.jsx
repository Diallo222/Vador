import { useEffect, useRef, useState } from "react";

const CURSOR_SPEED = 0.08;

let mouseX = -10;
let mouseY = -10;
let outlineX = 0;
let outlineY = 0;

export const Cursor = () => {
  const cursorOutline = useRef();
  const [hoverButton, setHoverButton] = useState(false);

  useEffect(() => {
    const animate = () => {
      let distX = mouseX - outlineX;
      let distY = mouseY - outlineY;

      outlineX = outlineX + distX * CURSOR_SPEED;
      outlineY = outlineY + distY * CURSOR_SPEED;

      if (cursorOutline.current) {
        cursorOutline.current.style.left = `${outlineX}px`;
        cursorOutline.current.style.top = `${outlineY}px`;
      }
      requestAnimationFrame(animate);
    };

    const mouseEventsListener = (event) => {
      mouseX = event.pageX;
      mouseY = event.pageY;
    };
    document.addEventListener("mousemove", mouseEventsListener);
    const animateEvent = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener("mousemove", mouseEventsListener);
      cancelAnimationFrame(animateEvent);
    };
  }, []);

  useEffect(() => {
    const mouseEventListener = (e) => {
      if (e.target.tagName.toLowerCase() === "h1") {
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
    <>
      <div
        className={`invisible md:visible  z-50 fixed -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-transform
        ${
          hoverButton
            ? " bg-red-600 w-32 h-32  mix-blend-difference"
            : "bg-red-600 w-3 h-3"
        }`}
        ref={cursorOutline}
      ></div>
    </>
  );
};
