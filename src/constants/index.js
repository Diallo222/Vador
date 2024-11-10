import { Howl } from "howler";

import breathSound from "/Darth.mp3"; 

export const sounds = {
    background: new Howl({
      src: [breathSound],
      loop: true,
      volume: 0.4,
    })
  };