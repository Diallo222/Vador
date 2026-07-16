import { STORY_CHAPTERS } from "../../constants/story";
import Section from "./Section";
import { ChapterLabel, ACCENT_TEXT } from "./ui/ChapterLabel";
import { Hairline } from "./ui/CinematicFrame";
import { SplitLines } from "./ui/SplitLines";

const chapter = STORY_CHAPTERS[7];

const Legacy = () => {
  return (
    <Section index={7} align="center" wide>
      <ChapterLabel
        code={chapter.code}
        kicker={chapter.kicker}
        accent={chapter.accent}
        className="justify-center"
      />
      <h2
        data-cursor="expand"
        className={`mt-6 font-display text-5xl md:text-6xl lg:text-7xl ${ACCENT_TEXT[chapter.accent]}`}
      >
        {chapter.title}
      </h2>
      <Hairline accent={chapter.accent} className="mx-auto mt-6 mb-8" />
      <div className="max-w-md mx-auto">
        <SplitLines
          lines={chapter.lines}
          sectionIndex={7}
          className="[&_p]:text-center [&_p]:mx-auto"
        />
      </div>
      <p className="mt-12 font-mono text-[10px] tracking-imperial text-steel-dim uppercase">
        End of transmission
      </p>
    </Section>
  );
};

export default Legacy;
