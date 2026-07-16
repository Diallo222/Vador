import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { setStoryScrollOffset } from "../../hooks/useStoryScroll";

/** Syncs Drei ScrollControls offset into the story scroll store for HTML chrome. */
export function ScrollProgressBridge() {
  const scroll = useScroll();

  useFrame(() => {
    setStoryScrollOffset(scroll.offset);
  });

  return null;
}
