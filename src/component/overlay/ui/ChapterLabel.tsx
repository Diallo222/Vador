import type { StoryAccent } from "../../../constants/story";

const ACCENT_TEXT: Record<StoryAccent, string> = {
  crimson: "text-crimson",
  sky: "text-sky-light",
  ember: "text-crimson-ember",
  bone: "text-bone-warm",
};

const ACCENT_BORDER: Record<StoryAccent, string> = {
  crimson: "border-crimson",
  sky: "border-sky-light",
  ember: "border-crimson-ember",
  bone: "border-bone",
};

interface ChapterLabelProps {
  code: string;
  kicker?: string;
  accent?: StoryAccent;
  className?: string;
}

export function ChapterLabel({
  code,
  kicker,
  accent = "crimson",
  className = "",
}: ChapterLabelProps) {
  return (
    <div
      className={`flex items-center gap-3 font-mono text-[10px] md:text-xs tracking-chapter uppercase text-steel ${className}`}
    >
      <span className={`${ACCENT_TEXT[accent]} font-medium`}>{code}</span>
      <span className={`h-px w-6 md:w-10 ${ACCENT_BORDER[accent]} border-t`} />
      {kicker ? <span className="text-steel-dim">{kicker}</span> : null}
    </div>
  );
}

export { ACCENT_TEXT, ACCENT_BORDER };
