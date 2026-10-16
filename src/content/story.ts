/** Official Star Wars stills via Disney's Lumiere CDN (starwars.com databank). */
const lumiere = (id: string, width = 1400) =>
  `https://lumiere-a.akamaihd.net/v1/images/${id}.jpeg?width=${width}`;

export const IMAGES = {
  tatooine: lumiere("tatooine-main_9542b896"),
  council: lumiere("vergence-main_eb0065a4"),
  quigon: lumiere("Qui-Gon-Jinn_d89416e8"),
  warrior: lumiere("Anakin-Skywalker_78d48f92"),
  mustafar: lumiere("databank_mustafar_01_169_5b470758"),
  deathStar: lumiere("death-star-ii-main_92554cb4"),
  unmasked: lumiere("open-uri20150608-27674-r9hjy6_e810fdca"),
  ghost: lumiere("anakin-skywalker-main_23e5105b"),
} as const;

export interface Act {
  id: string;
  numeral: string;
  title: string;
  /** Short HUD label */
  label: string;
  place: string;
  /** Imperial archive file reference */
  file: string;
  /** Menu preview */
  image: string;
}

export const ACTS: Act[] = [
  { id: "prologue", numeral: "0", title: "Prologue", label: "The Myth", place: "Unknown Regions", file: "IMP-0000", image: IMAGES.deathStar },
  { id: "origins", numeral: "I", title: "The Slave", label: "Origins", place: "Tatooine · Outer Rim", file: "IMP-1941", image: IMAGES.tatooine },
  { id: "discovery", numeral: "II", title: "The Chosen One", label: "Discovery", place: "Mos Espa", file: "IMP-3203", image: IMAGES.quigon },
  { id: "prodigy", numeral: "III", title: "The Prodigy", label: "Jedi", place: "Coruscant · Clone Wars", file: "IMP-1938", image: IMAGES.warrior },
  { id: "fall", numeral: "IV", title: "The Fall", label: "Duality", place: "Mustafar · 19 BBY", file: "IMP-0019", image: IMAGES.mustafar },
  { id: "empire", numeral: "V", title: "The Machine", label: "Empire", place: "Death Star · Imperial Fleet", file: "IMP-6600", image: IMAGES.deathStar },
  { id: "redemption", numeral: "VI", title: "The Return", label: "Redemption", place: "Death Star II · 4 ABY", file: "IMP-0004", image: IMAGES.unmasked },
  { id: "legacy", numeral: "VII", title: "The Legacy", label: "Epitaph", place: "Endor · Funeral Pyre", file: "IMP-∞", image: IMAGES.ghost },
];

export const COPY = {
  prologue: {
    kicker: "A tragedy in seven acts",
    line: "Welcome to the dark side.",
    sub: "Scroll to breathe in",
  },
  origins: {
    heading: ["Born", "in chains"],
    body: "Born without a father. Raised a slave on a desert world where twin suns burn everything to dust. A boy with a gift for machines — and a storm gathering quietly behind his eyes.",
    aside: "Whispers called his birth a miracle. The desert only called him property.",
    stats: [
      { k: "Age", v: "9" },
      { k: "Owner", v: "Watto" },
      { k: "Midichlorians", v: "20,000+" },
    ],
  },
  discovery: {
    quote: "The Chosen One",
    body: "A Jedi Master finds him in the dust of Mos Espa. In the boy he senses the Force — raw, unbound, louder than anything the Order has ever heard.",
    aside: "Qui-Gon sees what the Council fears.",
    prophecy: "He will bring balance to the Force.",
  },
  prodigy: {
    panels: [
      { word: "Pilot", note: "Won the Boonta Eve Classic at nine. The only human to ever survive the race." },
      { word: "Warrior", note: "Hero of the Clone Wars. The Hero With No Fear — or so the HoloNet said." },
      { word: "Prodigy", note: "Unmatched in the Force. Yet attachment coiled beneath the armor of duty." },
    ],
    marquee: "Hero with no fear",
  },
  fall: {
    left: "Anakin",
    right: "Vader",
    lines: [
      "Fear of loss.",
      "Anger without end.",
      "Visions of Padmé dying drive him into Palpatine's open hand.",
    ],
    cry: "You were the Chosen One!",
    hint: "Drag the blade",
  },
  empire: {
    heading: "More machine now than man",
    body: "Iron will. Black armor. A breath that silences rooms. He becomes the fist of the Emperor — terror given form.",
    counters: [
      { value: 2.03, decimals: 2, unit: "m", label: "Height in armor" },
      { value: 13, decimals: 0, unit: "/min", label: "Breaths, mechanical" },
      { value: 4, decimals: 0, unit: "", label: "Cybernetic limbs" },
    ],
  },
  redemption: {
    heading: ["A father's", "choice"],
    body: "Luke stands before him — not as an enemy, but as a son. To save him, Vader turns on his master. In one selfless act the prophecy is fulfilled, and the dark side loses its greatest servant.",
    quote: "Tell your sister… you were right.",
  },
  legacy: {
    epitaph: ["Tyrant.", "Father.", "Redeemed."],
    body: "The helmet endures — a symbol of how far one can fall, and how far one can return. His breath still echoes through the saga: a warning, a tragedy, and a hope that even the darkest path can turn.",
    final: "I am your father.",
  },
};

/** Armor anatomy hotspots — positions in Vader's normalized local space. */
export const HOTSPOTS = [
  {
    id: "helmet",
    code: "01",
    title: "Helmet & respirator",
    spec: "Sealed life-support mask. Vocoder grille, sensor-lensed eyes, and the breath that announces him.",
    position: [0.0, 1.86, 0.1] as [number, number, number],
  },
  {
    id: "chest",
    code: "02",
    title: "Chest control box",
    spec: "Respiratory regulator and heat dispersal. Coded slugs list scripture from the Sith Codex.",
    position: [0.02, 1.42, 0.14] as [number, number, number],
  },
  {
    id: "saber",
    code: "03",
    title: "Lightsaber",
    spec: "Kyber crystal stolen from a fallen Jedi, then bled red by hatred.",
    position: [0.3, 1.15, 0.2] as [number, number, number],
  },
  {
    id: "cape",
    code: "04",
    title: "Armorweave cape",
    spec: "Heavy, fire-resistant shroud. Hides the machine — and the man inside it.",
    position: [-0.32, 0.7, -0.1] as [number, number, number],
  },
];
