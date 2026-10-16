import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Color, Vector3, type DirectionalLight, type HemisphereLight, type SpotLight } from "three";
import { director } from "../core/director";
import * as shots from "../core/timeline";
import { stage } from "./stageClock";

const tmp: number[] = [0, 0, 0];
const target = new Vector3();
const forward = new Vector3();
const right = new Vector3();
const UP = new Vector3(0, 1, 0);
const WHITE = new Color("#f4f1ec");
const pointer = { x: 0, y: 0 };

/**
 * Camera-relative three-point lighting, so the orbit never flattens the subject:
 * a 3/4 key above camera-right that the cursor drags around like a flashlight,
 * two mood-colored rims always *behind* the subject (true edge light, never a
 * colored front wash), and a dim hemisphere fill. The environment is a neutral
 * studio: reflections read as black lacquer, the color comes from the rims.
 */
export function Lights() {
  const key = useRef<SpotLight>(null);
  const rimL = useRef<DirectionalLight>(null);
  const rimR = useRef<DirectionalLight>(null);
  const fill = useRef<HemisphereLight>(null);

  useFrame(({ camera }, delta) => {
    const t = stage.t;
    const k = 1 - Math.exp(-Math.min(delta, 0.05) * 4);
    pointer.x += (director.pointer.x - pointer.x) * k;
    pointer.y += (director.pointer.y - pointer.y) * k;

    shots.sampleVec(shots.camera.target, t, tmp);
    target.fromArray(tmp);
    forward.subVectors(target, camera.position).setY(0).normalize();
    right.crossVectors(forward, UP).normalize();

    const spot = key.current;
    if (spot) {
      spot.position
        .copy(target)
        .addScaledVector(forward, -3.4)
        .addScaledVector(right, 2.2 + pointer.x * 2.6);
      spot.position.y = target.y + 2.4 + pointer.y * 1.4;
      spot.target.position.copy(target);
      spot.target.updateMatrixWorld();
      shots.sampleVec(shots.mood.key, t, tmp);
      spot.color.fromArray(tmp);
    }

    shots.sampleVec(shots.mood.rim, t, tmp);
    const rim = shots.sample(shots.mood.rimIntensity, t);
    const place = (light: DirectionalLight | null, side: number, height: number, gain: number, neutral: number) => {
      if (!light) return;
      light.position.copy(target).addScaledVector(forward, 4).addScaledVector(right, side);
      light.position.y = target.y + height;
      light.target.position.copy(target);
      light.target.updateMatrixWorld();
      light.color.fromArray(tmp).lerp(WHITE, neutral);
      light.intensity = rim * gain;
    };
    // One rim carries the mood, the other is near-white so silhouettes stay legible
    place(rimL.current, -3.2, 2.2, 1, 0);
    place(rimR.current, 3.4, 1.2, 0.6, 0.65);

    if (fill.current) {
      shots.sampleVec(shots.mood.backdrop, t, tmp);
      fill.current.groundColor.fromArray(tmp);
    }
  });

  return (
    <>
      <hemisphereLight ref={fill} args={["#9aa4b4", "#2a0a08", 0.35]} />
      <spotLight ref={key} angle={0.5} penumbra={1} intensity={30} distance={14} decay={1.6} />
      <directionalLight ref={rimL} />
      <directionalLight ref={rimR} />
      <Environment resolution={128} frames={1}>
        <color attach="background" args={["#000000"]} />
        {/* Overhead softbox: the long highlight down the helmet dome */}
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 5, -1]} scale={[6, 1.4, 1]} rotation-x={Math.PI / 2} />
        {/* Side strips: crisp vertical speculars on the armor edges */}
        <Lightformer form="rect" intensity={0.9} color="#f2e8e4" position={[-5, 1.5, -1]} scale={[0.6, 5, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={0.8} color="#dfeaf5" position={[5, 1.5, 1]} scale={[0.6, 5, 1]} rotation-y={-Math.PI / 2} />
        {/* Faint front bounce so black never reads as a hole */}
        <Lightformer form="ring" intensity={0.6} color="#ffffff" position={[0, 1.5, 6]} scale={1.6} />
        <Lightformer form="rect" intensity={0.25} color="#ffffff" position={[0, -2, 2]} scale={[8, 2, 1]} rotation-x={-Math.PI / 2} />
      </Environment>
    </>
  );
}
