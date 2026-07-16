import { STORY_CHAPTERS } from "../../constants/story";
import Section from "./Section";
import { ChapterLabel, ACCENT_TEXT } from "./ui/ChapterLabel";
import { SplitLines } from "./ui/SplitLines";

const chapter = STORY_CHAPTERS[5];

const Monster = () => {
  return (
    <Section index={5} align="center" wide>
      <ChapterLabel
        code={chapter.code}
        kicker={chapter.kicker}
        accent={chapter.accent}
        className="justify-center"
      />
      <h2
        data-cursor="expand"
        className={`mt-6 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] ${ACCENT_TEXT[chapter.accent]}`}
      >
        The
        <br />
        Empire
      </h2>
      <div className="mt-8 mx-auto max-w-lg">
        <SplitLines
          lines={chapter.lines}
          sectionIndex={5}
          className="[&_p]:text-center [&_p]:mx-auto"
        />
      </div>
    </Section>
  );
};

export default Monster;
