import { Howl } from "howler";

import breathSound from "/Darth.mp3";

export { STORY_CHAPTERS, TOTAL_STORY_PAGES } from "./story";
export type { StoryAccent, StoryChapter } from "./story";

export const sounds = {
  background: new Howl({
    src: [breathSound],
    loop: true,
    volume: 0.4,
    preload: true,
    onload: () => console.log("Audio file loaded successfully"),
    onloaderror: (_id, error) => console.error("Error loading audio:", error),
  }),
};
