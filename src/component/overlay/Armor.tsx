import { STORY_CHAPTERS } from "../../constants/story";
import Section from "./Section";
import { ChapterLabel, ACCENT_TEXT } from "./ui/ChapterLabel";
import { Hairline } from "./ui/CinematicFrame";
import { SplitLines } from "./ui/SplitLines";

const chapter = STORY_CHAPTERS[4];

const Armor = () => {
  return (
    <Section index={4} align="left">
      <ChapterLabel
        code={chapter.code}
        kicker={chapter.kicker}
        accent={chapter.accent}
      />
      <h2
        data-cursor="expand"
        className={`mt-3 font-display text-4xl md:text-6xl ${ACCENT_TEXT[chapter.accent]}`}
      >
        {chapter.title}
      </h2>
      {/* Fracture hairline — visual metaphor for the fall */}
      <div className="relative mt-5 mb-6 w-40 md:w-56 h-px">
        <Hairline accent={chapter.accent} className="w-full" />
        <span className="absolute top-0 left-[42%] w-8 h-px bg-crimson-ember rotate-12 origin-left" />
      </div>
      <SplitLines lines={chapter.lines} sectionIndex={4} />
    </Section>
  );
};

export default Armor;
