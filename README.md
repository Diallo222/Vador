# VADOR

### A scroll-driven cinematic experience into the rise, fall, and redemption of Darth Vader

An immersive **WebGL storytelling site** where a Theatre.js–choreographed 3D stage and an Awwwards-inspired HTML overlay move as one film. Scroll is the timeline. The dark side is the art direction.

> **Live demo:** https://darthvador.netlify.app · **Repo:** [Diallo222/Vador](https://github.com/Diallo222/Vador)

<br />

<p align="center">
  <img src="./src/assets/vador.png" alt="Darth Vader helmet" width="120" />
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React_18-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-R3F-000000?style=for-the-badge&logo=threedotjs&logoColor=white" />
  <img alt="Theatre.js" src="https://img.shields.io/badge/Theatre.js-Scroll_Timeline-B11226?style=for-the-badge" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

---

## Why this project

Most portfolios show components. **Vador shows systems thinking** — how motion design, 3D cinematography, and editorial UI share a single scroll clock without fighting each other.

It was built to demonstrate:

- **Cinematic product craft** — pacing, hierarchy, restraint (not effect spam)
- **Scroll ↔ WebGL sync** — Drei `ScrollControls` driving a Theatre.js sequence
- **Layered architecture** — Theatre owns transforms; React owns look, mood, and chrome
- **Modern frontend stack** — TypeScript, Vite, Tailwind, Framer Motion, Howler

---

## Features

### Story overlay (Imperial Archive × Cinematic Opera)

- **8 full-viewport chapters** — Origins → Discovery → Fall → Empire → Redemption → Legacy
- **Scroll-windowed typography** — enter / hold / exit tied to chapter progress
- **Persistent chrome** — chapter rail, scrub progress, redesigned audio & cursor
- **Chapter accents** — crimson → sky → ember → bone, mirrored in the 3D mood
- **Film grain + vignette** — atmospheric CSS overlays that don’t steal pointer events

### 3D theatre stage

- **Theatre.js camera path** — dolly, orbit, zoom authored as a positional sequence
- **Helmet + duel beat** — helmet exit, Anakin vs Vader enter, SpotLight color/intensity keys
- **Filmic post stack** — ACES tone mapping, SMAA, tuned bloom, soft chromatic aberration
- **Chapter-synced atmosphere** — fog, particles, and ambient shift with the story (no Theatre re-authoring)
- **Contact shadows + rim/fill lights** — depth without washing the void

### Craft details

- Responsive scale (resize-aware) with camera kept outside the scale group
- Mobile particle caps & DPR clamp for smoother devices
- Official Star Wars stills via Disney Lumiere CDN for story frames
- Ambient audio loop (Howler) with Imperial-style mute control

---

## Tech stack

| Layer                 | Tools                                                                      |
| --------------------- | -------------------------------------------------------------------------- |
| **App**               | React 18, TypeScript, Vite 5                                               |
| **3D**                | Three.js, React Three Fiber, Drei                                          |
| **Motion / timeline** | Theatre.js (`@theatre/core` + `@theatre/r3f`), Framer Motion / Motion 3D   |
| **Look**              | Tailwind CSS, `@react-three/postprocessing`, custom Imperial design tokens |
| **Audio**             | Howler                                                                     |
| **Quality**           | ESLint, `tsc --noEmit` on build                                            |

---

## Architecture

```
Scroll offset (0 → 1)
        │
        ├──────────────► Theatre sequence (length 10)
        │                      │
        │                      ├─ Camera
        │                      ├─ Helmet
        │                      ├─ battle (Darth + Anakin)
        │                      └─ SpotLight1
        │
        └──────────────► Story store
                               │
                               ├─ Overlay chapter fades / chrome
                               └─ 3D mood (fog · particles · ambient)
```

**Hard rule:** Theatre.js owns positions, rotations, scales, and SpotLight1 keyed props.  
React enhances **materials, fog, particles, postFX, and non-Theatre lights** — never fights the choreography.

---

## Project structure

```text
src/
├── App.tsx                 # Canvas, ScrollControls, chrome
├── Vador.json              # Theatre sheet (camera & object keys)
├── constants/story.ts      # Chapter copy + CDN stills
├── hooks/
│   ├── useStoryScroll.ts   # Shared scroll offset store
│   ├── useSceneMood.ts     # Chapter → atmosphere map
│   └── useResponsiveScale.ts
├── component/
│   ├── canvas/             # Scene, models, postFX, loader
│   └── overlay/            # 8 chapters + UI atoms + chrome
└── index.css               # Tokens, grain, fonts
```

---

## Getting started

**Requirements:** Node 18+, Yarn 4 (Corepack)

```bash
corepack enable
git clone https://github.com/Diallo222/Vador.git
cd Vador
yarn install
yarn dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

```bash
yarn build      # typecheck + production bundle
yarn preview    # serve dist/
yarn typecheck
yarn lint
```

---

## Performance notes

- Canvas `dpr` clamped to `[1, 1.5]`
- `antialias: false` + SMAA for a sharper filmic edge budget
- Particle counts reduced on mobile UA
- GLBs preloaded via `useGLTF.preload`
- Theatre scrub is a single `useFrame` write — no competing scroll libraries (no Lenis/GSAP)

---

## Credits & disclaimer

- **3D models** — helmet / Darth / Skywalker GLBs in `public/` (community assets; see original authors where applicable)
- **Story stills** — Disney Lumiere CDN (Star Wars official media used for editorial illustration)
- **Fonts** — Cinzel, Exo 2, IBM Plex Mono, custom Jedi display face

**Star Wars**, **Darth Vader**, and related marks are trademarks of Lucasfilm Ltd. / Disney.  
This is a **non-commercial fan / portfolio project** — not affiliated with or endorsed by Lucasfilm or Disney.

---

## What this shows on a résumé / portfolio

| Skill                 | Evidence in this repo                                           |
| --------------------- | --------------------------------------------------------------- |
| Creative engineering  | Scroll-as-timeline, film credit UI, Imperial art direction      |
| WebGL / R3F           | Multi-model scene, shadows, postprocessing, responsive framing  |
| Animation systems     | Theatre.js sequence + Framer Motion UI without desync           |
| Frontend architecture | Shared scroll store, mood layer, frozen vs free scene contracts |
| Product polish        | Loader boot sequence, audio UX, reduced-motion, mobile chrome   |

---

## License

 © Diallo — feel free to learn from it or use this repo; please don’t rebrand it as an official Star Wars product.

---

<p align="center"><em>Welcome to the dark side.</em></p>
