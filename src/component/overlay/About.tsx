import { STORY_CHAPTERS } from "../../constants/story";
import Section from "./Section";
import { ChapterLabel, ACCENT_TEXT } from "./ui/ChapterLabel";
import { CinematicFrame, Hairline } from "./ui/CinematicFrame";
import { SplitLines } from "./ui/SplitLines";

const chapter = STORY_CHAPTERS[1];

const About = () => {
  return (
    <Section index={1} align="left" mobileTop wide>
      <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-14">
        <div className="flex-1 min-w-0">
          <ChapterLabel
            code={chapter.code}
            kicker={chapter.kicker}
            accent={chapter.accent}
          />
          <h2
            data-cursor="expand"
            className={`mt-3 font-display text-4xl md:text-5xl lg:text-6xl ${ACCENT_TEXT[chapter.accent]}`}
          >
            {chapter.title}
          </h2>
          <Hairline accent={chapter.accent} className="mt-4 mb-5" />
          <SplitLines lines={chapter.lines} sectionIndex={1} />
        </div>
        {chapter.image ? (
          <CinematicFrame
            src={chapter.image.src}
            alt={chapter.image.alt}
            accent={chapter.accent}
            sectionIndex={1}
            className="shrink-0 self-center lg:self-auto"
          />
        ) : null}
      </div>
    </Section>
  );
};

export default About;
