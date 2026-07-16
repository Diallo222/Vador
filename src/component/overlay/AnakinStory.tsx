import { STORY_CHAPTERS } from "../../constants/story";
import Section from "./Section";
import { ChapterLabel, ACCENT_TEXT } from "./ui/ChapterLabel";
import { Hairline } from "./ui/CinematicFrame";
import { SplitLines } from "./ui/SplitLines";

const chapter = STORY_CHAPTERS[3];

const AnakinStory = () => {
  return (
    <Section index={3} align="left" wide>
      <ChapterLabel
        code={chapter.code}
        kicker={chapter.kicker}
        accent={chapter.accent}
      />
      <h2
        data-cursor="expand"
        className={`mt-4 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] ${ACCENT_TEXT[chapter.accent]}`}
      >
        <span className="block">Prodigious</span>
        <span className="block text-bone/90">Jedi</span>
      </h2>
      <Hairline accent={chapter.accent} className="mt-6 mb-6" />
      <SplitLines lines={chapter.lines} sectionIndex={3} />
    </Section>
  );
};

export default AnakinStory;
