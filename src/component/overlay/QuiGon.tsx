import { STORY_CHAPTERS } from "../../constants/story";
import Section from "./Section";
import { ChapterLabel, ACCENT_TEXT } from "./ui/ChapterLabel";
import { CinematicFrame, Hairline, QuoteMark } from "./ui/CinematicFrame";
import { SplitLines } from "./ui/SplitLines";

const chapter = STORY_CHAPTERS[2];

const QuiGon = () => {
  return (
    <Section index={2} align="right" mobileTop wide>
      <div className="flex flex-col-reverse lg:flex-row lg:items-center gap-8 lg:gap-14">
        {chapter.image ? (
          <CinematicFrame
            src={chapter.image.src}
            alt={chapter.image.alt}
            accent={chapter.accent}
            sectionIndex={2}
            className="shrink-0 self-center lg:self-auto"
          />
        ) : null}
        <div className="flex-1 min-w-0 lg:text-right">
          <ChapterLabel
            code={chapter.code}
            kicker={chapter.kicker}
            accent={chapter.accent}
            className="lg:justify-end"
          />
          <h2
            data-cursor="expand"
            className={`mt-3 font-display text-4xl md:text-5xl ${ACCENT_TEXT[chapter.accent]}`}
          >
            {chapter.title}
          </h2>
          {chapter.quote ? (
            <div className="mt-5 lg:flex lg:justify-end">
              <QuoteMark accent={chapter.accent}>{chapter.quote}</QuoteMark>
            </div>
          ) : null}
          <Hairline
            accent={chapter.accent}
            className="mt-4 mb-5 lg:ml-auto"
          />
          <SplitLines
            lines={chapter.lines}
            sectionIndex={2}
            className="lg:ml-auto lg:[&_p]:ml-auto"
          />
        </div>
      </div>
    </Section>
  );
};

export default QuiGon;
