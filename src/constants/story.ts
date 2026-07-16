import { young, quigon, redemption } from "../assets";

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
      "Born without a father. Raised in chains.",
      "A slave boy with a gift for machines — and a storm gathering behind his eyes.",
    ],
    image: {
      src: young,
      alt: "Young Anakin Skywalker",
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
    ],
    quote: "The Chosen One",
    image: {
      src: quigon,
      alt: "Qui-Gon Jinn",
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
      "Palpatine's shadow closes. The Chosen One kneels — and rises as Darth Vader.",
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
      "To save his son, he turns on the Emperor.",
      "In one selfless act, the prophecy is fulfilled — and the dark side loses its greatest servant.",
    ],
    image: {
      src: redemption,
      alt: "Darth Vader's redemption",
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
    ],
    accent: "bone",
    align: "center",
    layout: "epitaph",
  },
];

export const TOTAL_STORY_PAGES = STORY_CHAPTERS.length;
