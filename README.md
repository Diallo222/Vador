# VADER — Anatomy of a Fall

### A scroll-driven WebGL tragedy in seven acts: the rise, fall and redemption of Anakin Skywalker

The whole story is told through **one object, the mask**. Scroll and the helmet burns into ash. The ash becomes Tatooine sand and then Force motes. Anakin takes shape out of the dust, and Vader takes shape out of fire. A lightsaber seam splits the frame between light and dark, and you can drag it. Vader dissolves into light, and the helmet comes back one last time with a different name behind it.

> **Live demo:** https://darthvador.netlify.app · **Repo:** [Diallo222/Vador](https://github.com/Diallo222/Vador)

<br />

<p align="center">
  <img src="./src/assets/vador.png" alt="Darth Vader helmet" width="120" />
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React_18-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-R3F-000000?style=for-the-badge&logo=threedotjs&logoColor=white" />
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-ScrollTrigger_·_SplitText-0AE448?style=for-the-badge&logo=greensock&logoColor=black" />
  <img alt="GLSL" src="https://img.shields.io/badge/GLSL-Custom_shaders-B11226?style=for-the-badge" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

Creative docs: [Concept](./docs/redesign/CONCEPT.md) · [Plan](./docs/redesign/PLAN.md) · [Commit plan](./docs/redesign/COMMITS.md)

---

## Signature moments

| # | Moment | How |
|---|---|---|
| 1 | **Hold to ignite.** The loading bar is a saber blade. Holding plays a synthesized hum, then the blast doors open. | GSAP timeline + WebAudio synth (no audio assets) |
| 2 | **Cursor flashlight.** The key light follows the pointer and the helmet turns to look at you. | Pointer → director store → spot light + damped rotation |
| 3 | **Scroll-scrubbed disintegration.** The helmet burns into embers and rebuilds when you scroll back. | `onBeforeCompile` noise dissolve with an HDR edge; ash points sampled on the mesh surface, sharing the same noise |
| 4 | **Atmosphere per act.** Sand, Force swirl, Mustafar embers, falling ash. | One GPU particle system; colour and motion keyed per act |
| 5 | **Pilot · Warrior · Prodigy.** A horizontal ride with skew and marquee that react to scroll velocity. | Sticky section + scrubbed ScrollTrigger + `gsap.quickTo` |
| 6 | **The Duality Blade.** A full-screen saber seam grades the frame Jedi-cold on one side and Sith-fire on the other. Drag it and the hum changes pitch with your speed. | Custom `postprocessing` Effect + WebAudio |
| 7 | **Mustafar heat haze.** | `mainUv` distortion in the same effect |
| 8 | **Armor anatomy.** 3D-anchored hotspots with spec cards, an ECG drawn by scroll, and counters. | drei `<Html>` portal layer + SVG stroke scrub |
| 9 | **Dissolve into light.** Same shader, gold edge. The saber retracts. | Shot-list tracks |
| 10 | **VADER → ANAKIN.** The last frame mirrors the first, with the name changed. | Troika 3D outlined text |
| 11 | **Rewind the saga.** VHS rewind back to the start. | Scanlines, line jitter, RGB split, Lenis `scrollTo` |
| 12 | **Index menu.** Saber-cut wipe, scramble-decoded titles, and a preview that trails the cursor. | Clip-path timeline + ScrambleText |
| 13 | **Hyperspace jump.** Picking an act warps the frame into star streaks, slams blast doors on the act's title card, teleports, then splits the card open as the warp decelerates. | `uWarp` radial smear + streaks, fov stretch, GSAP door timeline |

---

## Tech stack

| Layer | Tools |
|---|---|
| **App** | React 18, TypeScript, Vite 5 |
| **3D** | Three.js r170, React Three Fiber 8, Drei 9 (`<Html>`, troika text, PerformanceMonitor, Preload) |
| **Shaders** | Dissolve material patch, ash and atmosphere points, smoke dome, `SithEffect` (grade · duality · heat · rewind · ACES) |
| **Motion** | GSAP 3.15 (ScrollTrigger, SplitText, ScrambleText, CustomEase), Lenis smooth scroll |
| **Audio** | Howler (breath loop) + hand-rolled WebAudio saber synth |
| **Look** | Tailwind CSS · Anton · Instrument Serif · Inter Tight · JetBrains Mono · Moonhouse |

---

## Architecture

```
window scroll (Lenis) ─▶ GSAP ticker ─▶ ScrollTrigger
        │
        ▼
 director (mutable store) ── t = act index + local progress (0 → 8)
        │                     pointer · velocity · split drag · intro · rewind
        ▼
 timeline.ts — the "shot list": keyframed tracks sampled at t
        │       camera orbit rig · actors · dissolve · mood colours · post uniforms
        ▼
 R3F useFrame — reads samples, writes uniforms (zero React re-renders per frame)
```

- **No Theatre.js.** The camera path is code: `[t, value, ease]` keys that are easy to diff and review, fully reversible, and independent of section heights.
- **Story time** is computed from cached section offsets on every scroll event, so menu jumps and rewinds stay correct.
- **Pinning** uses CSS `position: sticky`, which avoids GSAP pin-spacing conflicts with Lenis.

```text
src/
├── core/        gsap · director · timeline (shot list) · smoothScroll · audio · device
├── content/     story copy, images, hotspots
├── gl/          Stage · CameraRig · Lights
│   ├── models/   Helmet · Vader · Anakin · fit · useActor · assets
│   ├── materials/ dissolve
│   ├── effects/  Ash · Atmosphere · Backdrop · Floor · TitleText · Hotspots · BlobShadow
│   └── post/     SithEffect · Post
├── ui/          Preloader · Hud · Cursor · Menu · ActTransition
├── sections/    Prologue → Legacy (8 acts)
└── hooks/       useSectionFx (declarative scroll FX) · useMagnetic
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

```bash
yarn build      # typecheck + production bundle
yarn preview    # serve dist/
yarn typecheck
yarn lint
```

---

## Performance notes

- **Draco-compressed models** (6.4 MB → 3.1 MB; the helmet alone 2 MB → 164 KB) with a self-hosted decoder in `public/draco/`.
- **Vendor chunks** (`three`, `r3f`, `motion`) cache separately from app code.
- **Adaptive DPR** via drei `PerformanceMonitor`; DPR is capped per device tier.
- **Uniform-branch dissolve.** Intact meshes skip the noise entirely, and fully dissolved actors are hidden.
- **Render loop pauses** while the index menu covers the stage.
- **Mobile tier.** About 40% of the particles, no MSAA, and no custom cursor.
- **No reflector.** The obsidian floor is a single unlit shader instead of a second scene render per frame.
- **`prefers-reduced-motion`.** No smooth-scroll inertia, no staggered reveals, and instant jumps.

---

## Credits & disclaimer

- **3D models**: helmet / Darth / Skywalker GLBs in `public/` (community assets; see original authors where applicable)
- **Story stills**: Disney Lumiere CDN (official Star Wars media used for editorial illustration)
- **Fonts**: Anton, Instrument Serif, Inter Tight, JetBrains Mono (Google Fonts), Moonhouse display face
- **Research**: Codrops (cinematic GSAP scroll, shader dissolve + particles), Awwwards scrollytelling inspiration

**Star Wars**, **Darth Vader**, and related marks are trademarks of Lucasfilm Ltd. / Disney.
This is a **non-commercial fan / portfolio project**, not affiliated with or endorsed by Lucasfilm or Disney.

---

## License

 © Diallo — feel free to learn from it or use this repo; please don’t rebrand it as an official Star Wars product.

---

<p align="center"><em>Welcome to the dark side.</em></p>
