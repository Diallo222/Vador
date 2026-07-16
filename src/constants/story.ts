/** Official Star Wars stills via Disney Lumiere CDN (starwars.com). */
export const STORY_IMAGES = {
  origins:
    "https://lumiere-a.akamaihd.net/v1/images/vergence-main_eb0065a4.jpeg",
  discovery:
    "https://lumiere-a.akamaihd.net/v1/images/Qui-Gon-Jinn_d89416e8.jpeg",
  redemption:
    "https://lumiere-a.akamaihd.net/v1/images/open-uri20150608-27674-r9hjy6_e810fdca.jpeg",
} as const;

export type StoryAccent = "crimson" | "sky" | "ember" | "bone";

export interface StoryChapter {
  id: string;
  index: number;
  code: string;
  title: string;
  kicker?: string;
  lines: string[];
  quote?: string;
  image?: {
    src: string;
    alt: string;
  };
  accent: StoryAccent;
  align: "left" | "right" | "center";
  layout: "hero" | "dossier" | "mirror" | "statement" | "epitaph";
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "home",
    index: 0,
    code: "01",
    title: "Darth Vader",
    kicker: "Welcome to the dark side",
    lines: [],
    accent: "crimson",
    align: "left",
    layout: "hero",
  },
  {
    id: "origins",
    index: 1,
    code: "02",
    title: "Origins",
    kicker: "Tatooine",
    lines: [
      "Born without a father. Raised in chains on Tatooine.",
      "A slave boy with a gift for machines — and a storm gathering behind his eyes.",
      "Whispers called his birth a miracle. The desert only called him property.",
    ],
    image: {
      src: STORY_IMAGES.origins,
      alt: "Young Anakin Skywalker before the Jedi Council",
    },
    accent: "crimson",
    align: "left",
    layout: "dossier",
  },
  {
    id: "discovery",
    index: 2,
    code: "03",
    title: "Discovery",
    kicker: "Qui-Gon Jinn",
    lines: [
      "A Jedi Master finds him in the dust of Tatooine.",
      "In the boy, he senses the Force — and a destiny the Order cannot ignore.",
      "Qui-Gon sees what the Council fears: the Chosen One, raw and unbound.",
    ],
    quote: "The Chosen One",
    image: {
      src: STORY_IMAGES.discovery,
      alt: "Jedi Master Qui-Gon Jinn",
    },
    accent: "sky",
    align: "right",
    layout: "mirror",
  },
  {
    id: "prodigy",
    index: 3,
    code: "04",
    title: "Prodigious Jedi",
    kicker: "The prophecy",
    lines: [
      "Pilot. Warrior. Prodigy.",
      "His connection to the Force was unmatched — and his fate already written in whispers of balance.",
      "Trained as a Jedi, he soared above every trial — yet attachment coiled quietly beneath the armor of duty.",
    ],
    accent: "sky",
    align: "left",
    layout: "statement",
  },
  {
    id: "fall",
    index: 4,
    code: "05",
    title: "Sith Master",
    kicker: "The fall",
    lines: [
      "Fear of loss. Anger without end.",
      "Visions of Padmé dying drive him into Palpatine's open hand.",
      "The Chosen One kneels — and rises as Darth Vader, bound in black.",
    ],
    accent: "ember",
    align: "left",
    layout: "statement",
  },
  {
    id: "empire",
    index: 5,
    code: "06",
    title: "The Empire",
    kicker: "Enforcer",
    lines: [
      "Iron will. Black armor. A breath that silences rooms.",
      "He becomes the fist of the Emperor — terror given form.",
      "Rebels whisper his name like a curse. Worlds fall quieter when his shuttle descends.",
    ],
    accent: "ember",
    align: "center",
    layout: "statement",
  },
  {
    id: "redemption",
    index: 6,
    code: "07",
    title: "Redemption",
    kicker: "A father's choice",
    lines: [
      "Luke stands before him — not as enemy, but as son.",
      "To save him, Vader turns on the Emperor.",
      "In one selfless act, the prophecy is fulfilled — and the dark side loses its greatest servant.",
    ],
    image: {
      src: STORY_IMAGES.redemption,
      alt: "Anakin Skywalker unmasked — redeemed",
    },
    accent: "bone",
    align: "left",
    layout: "dossier",
  },
  {
    id: "legacy",
    index: 7,
    code: "08",
    title: "Legacy",
    kicker: "Eternal",
    lines: [
      "Tyrant. Father. Redeemed.",
      "The helmet endures — a symbol of how far one can fall, and how far one can return.",
      "His breath still echoes through the saga: a warning, a tragedy, and a hope that even the darkest path can turn.",
    ],
    accent: "bone",
    align: "center",
    layout: "epitaph",
  },
];

export const TOTAL_STORY_PAGES = STORY_CHAPTERS.length;
