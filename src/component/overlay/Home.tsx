import { STORY_CHAPTERS } from "../../constants/story";
import Section from "./Section";
import { ChapterLabel, ACCENT_TEXT } from "./ui/ChapterLabel";
import { ScrollCue } from "./ui/CinematicFrame";

const chapter = STORY_CHAPTERS[0];

const Home = () => {
  return (
    <Section index={0} align="left" mobileTop>
      <ChapterLabel
        code={chapter.code}
        kicker="Prologue"
        accent={chapter.accent}
      />
      <h1
        data-cursor="expand"
        className={`mt-4 font-Jedi4 text-5xl sm:text-6xl md:text-7xl lg:text-8xl ${ACCENT_TEXT[chapter.accent]} leading-[0.95]`}
      >
        {chapter.title}
      </h1>
      {chapter.kicker ? (
        <p className="mt-4 font-display text-base md:text-xl text-bone/80 tracking-wide">
          {chapter.kicker}
        </p>
      ) : null}
      <ScrollCue />
    </Section>
  );
};

export default Home;
