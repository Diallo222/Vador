import { forwardRef, type ReactNode } from "react";
import { ACTS } from "../content/story";

interface ActFrameProps {
  index: number;
  /** Section height in vh — taller sections host sticky / scrubbed scenes; omit for content height */
  vh?: number;
  className?: string;
  children: ReactNode;
}

/** Story section: registers itself as an act for story-time measurement. */
export const ActFrame = forwardRef<HTMLElement, ActFrameProps>(function ActFrame(
  { index, vh, className = "", children },
  ref,
) {
  const act = ACTS[index];
  return (
    <section
      ref={ref}
      id={act.id}
      data-act={index}
      aria-label={`${act.numeral === "0" ? "Prologue" : `Act ${act.numeral}`}: ${act.title}`}
      className={`relative w-full ${className}`}
      style={vh ? { height: `${vh}vh` } : undefined}
    >
      {children}
    </section>
  );
});

/** Archive-style slug line: numeral — label · place ……… file */
export function ActSlug({ index, className = "" }: { index: number; className?: string }) {
  const act = ACTS[index];
  return (
    <div data-fade className={`flex items-center gap-4 ${className}`}>
      <span className="font-display text-2xl leading-none accent">{act.numeral}</span>
      <span className="h-px w-10 bg-bone/30" />
      <span className="hud text-bone/80">{act.label}</span>
      <span className="hud hidden sm:inline">· {act.place}</span>
      <span className="hud ml-auto hidden lg:inline">{act.file}</span>
    </div>
  );
}
