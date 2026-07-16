import { useEffect, useRef } from "react";
import { STORY_CHAPTERS } from "../../constants/story";
import {
  getStoryScrollOffset,
  subscribeStoryScroll,
  useStoryChapter,
} from "../../hooks/useStoryScroll";

/**
 * Vertical chapter pathfinder — orientation only, no jump-to.
 * Collapses to a bottom dot rail on mobile.
 */
export function ChapterRail({ visible }: { visible: boolean }) {
  const active = useStoryChapter();

  if (!visible) return null;

  return (
    <>
      {/* Desktop vertical rail */}
      <nav
        aria-label="Story chapters"
        className="hidden md:flex fixed right-5 lg:right-8 top-1/2 -translate-y-1/2 z-30 flex-col gap-3 pointer-events-none"
      >
        {STORY_CHAPTERS.map((chapter, i) => {
          const isActive = i === active;
          return (
            <div
              key={chapter.id}
              className="flex items-center justify-end gap-2"
            >
              <span
                className={`font-mono text-[9px] tracking-chapter transition-opacity duration-300 ${
                  isActive ? "opacity-100 text-crimson" : "opacity-0 text-steel"
                }`}
              >
                {chapter.code}
              </span>
              <span
                className={`block transition-all duration-300 ${
                  isActive
                    ? "w-1.5 h-1.5 bg-crimson"
                    : "w-1 h-1 bg-steel/40"
                }`}
              />
            </div>
          );
        })}
      </nav>

      {/* Mobile bottom dots */}
      <nav
        aria-label="Story progress"
        className="flex md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 gap-2 pointer-events-none"
      >
        {STORY_CHAPTERS.map((chapter, i) => (
          <span
            key={chapter.id}
            className={`block h-1 transition-all duration-300 ${
              i === active ? "w-4 bg-crimson" : "w-1 bg-steel/40"
            }`}
          />
        ))}
      </nav>
    </>
  );
}

/** Thin top scrub bar driven by scroll offset (ref-updated, no React re-render). */
export function StoryProgress({ visible }: { visible: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;

    const sync = () => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${getStoryScrollOffset()})`;
      }
    };
    sync();
    return subscribeStoryScroll(sync);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-30 h-[2px] bg-void-elevated/80 pointer-events-none"
      aria-hidden
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-crimson will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
