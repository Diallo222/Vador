import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { HOTSPOTS } from "../../content/story";
import { director } from "../../core/director";
import { synth } from "../../core/audio";
import * as shots from "../../core/timeline";
import { stage } from "../stageClock";

/** Rendered into a DOM layer above the story so the markers stay hoverable. */
const layer = { current: document.getElementById("hotspot-layer") as HTMLElement };

/** Armor anatomy annotations, anchored to Vader's local space. */
export function Hotspots() {
  const nodes = useRef<(HTMLDivElement | null)[]>([]);

  useFrame(() => {
    const visible = shots.sample(shots.hotspots, stage.t);
    nodes.current.forEach((el, i) => {
      if (!el) return;
      const delay = i * 0.12;
      const o = Math.max(0, Math.min(1, (visible - delay) / (1 - delay)));
      el.style.opacity = String(o);
      el.style.pointerEvents = o > 0.5 ? "auto" : "none";
      el.style.transform = `translate3d(0, ${(1 - o) * 12}px, 0)`;
      el.classList.toggle("is-active", director.hotspot === i);
    });
  });

  return (
    <>
      {HOTSPOTS.map((spot, i) => (
        <Html key={spot.id} position={spot.position} portal={layer} zIndexRange={[20, 10]} style={{ pointerEvents: "none" }}>
          <div
            ref={(el) => (nodes.current[i] = el)}
            className="hotspot group relative opacity-0"
            data-cursor="Inspect"
            onPointerEnter={() => {
              director.hotspot = i;
              synth.tick(1500 + i * 220);
            }}
            onPointerLeave={() => {
              if (director.hotspot === i) director.hotspot = -1;
            }}
          >
            <span className="hotspot-dot" />
            <span className="hotspot-code hud">{spot.code}</span>
            <div className="hotspot-card">
              <p className="hud !text-[9px] accent">
                {spot.code} — Schematic
              </p>
              <p className="mt-2 font-display text-xl uppercase leading-none text-bone">{spot.title}</p>
              <p className="mt-2 font-sans text-[12px] leading-snug text-bone/70">{spot.spec}</p>
            </div>
          </div>
        </Html>
      ))}
    </>
  );
}
