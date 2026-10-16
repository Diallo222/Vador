import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";
import moonhouse from "../../assets/fonts/Moonhouse-yE5M.ttf?url";
import * as shots from "../../core/timeline";
import { stage } from "../stageClock";

type TroikaText = Mesh & { fillOpacity: number; strokeOpacity: number };

const Z = -2.6;

/**
 * Giant outlined names standing behind the helmet: VADER at the start,
 * ANAKIN at the very end — the name he died with.
 */
export function TitleText() {
  const vader = useRef<TroikaText>(null);
  const anakin = useRef<TroikaText>(null);
  const aspect = useThree((s) => s.size.width / s.size.height);
  // Visible width at the text's depth (camera dist 6.2 + 2.6); the rig
  // widens the fov ×1.45 on portrait screens, so mirror that here
  const halfFov = ((aspect < 1 ? 30 * 1.45 : 30) / 2) * (Math.PI / 180);
  const visibleWidth = 2 * 8.8 * Math.tan(halfFov) * aspect;
  const size = Math.min(2.3, (visibleWidth * 0.9) / 4.4);

  useFrame(() => {
    const t = stage.t;
    const apply = (mesh: TroikaText | null, o: number, lift: number) => {
      if (!mesh) return;
      mesh.visible = o > 0.001;
      mesh.fillOpacity = o * 0.9;
      mesh.strokeOpacity = o;
      mesh.position.y = 1.5 + (1 - o) * lift;
    };
    apply(vader.current, shots.sample(shots.titles.vader, t), 0.6);
    apply(anakin.current, shots.sample(shots.titles.anakin, t), -0.4);
  });

  const common = {
    font: moonhouse,
    anchorX: "center" as const,
    anchorY: "middle" as const,
    fontSize: size,
    letterSpacing: 0.02,
    strokeWidth: "0.6%",
    position: [0, 1.5, Z] as [number, number, number],
  };

  return (
    <>
      <Text ref={vader} {...common} color="#170506" strokeColor="#ff2a2a">
        VADER
      </Text>
      <Text ref={anakin} {...common} fontSize={size * 0.82} color="#0a0a0b" strokeColor="#ece6dc">
        ANAKIN
      </Text>
    </>
  );
}
