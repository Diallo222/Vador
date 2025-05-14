import { Howl } from "howler";

import breathSound from "/Darth.mp3";

export const sounds = {
  background: new Howl({
    src: [breathSound],
    loop: true,
    volume: 0.4,
    preload: true,
    onload: () => console.log("Audio file loaded successfully"),
    onloaderror: (id, error) => console.error("Error loading audio:", error),
  }),
};
