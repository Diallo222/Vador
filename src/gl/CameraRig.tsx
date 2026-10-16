import { useFrame } from "@react-three/fiber";
import { Vector3, type PerspectiveCamera } from "three";
import { director } from "../core/director";
import * as shots from "../core/timeline";
import { stage } from "./stageClock";

const target = new Vector3();
const tmp: number[] = [0, 0, 0];
const pointer = { x: 0, y: 0 };

// Dev-only handles for scripted visual QA (snap story time for screenshots)
if (import.meta.env.DEV) Object.assign(window, { __stage: stage, __director: director });

/**
 * Advances the shared stage clock, then flies the camera along the shot list:
 * an orbit rig (target · distance · azimuth · elevation · fov · roll) with a
 * damped pointer parallax on top. Mounted first so every actor reads fresh time.
 */
export function CameraRig() {
  useFrame((state, delta) => {
    if (import.meta.env.DEV) (window as unknown as { __r3f: unknown }).__r3f = state;
    const dt = Math.min(delta, 1 / 20);
    // Weighty follow on top of Lenis smoothing
    stage.t += (director.t - stage.t) * (1 - Math.exp(-dt * 7));
    stage.time += dt;
    const t = stage.t;
    stage.risePhase += dt * shots.sample(shots.mood.rise, t);
    stage.swirlPhase += dt * shots.sample(shots.mood.swirl, t) * 0.35;

    pointer.x += (director.pointer.x - pointer.x) * (1 - Math.exp(-dt * 3));
    pointer.y += (director.pointer.y - pointer.y) * (1 - Math.exp(-dt * 3));

    shots.sampleVec(shots.camera.target, t, tmp);
    target.set(tmp[0], tmp[1], tmp[2]);
    // Ignition: the camera pushes in from the dark while the helmet assembles
    const intro = director.intro * director.intro;
    const dist = shots.sample(shots.camera.distance, t) + intro * 3.2;
    const az = shots.sample(shots.camera.azimuth, t) + pointer.x * 0.07 - intro * 0.35;
    const el = shots.sample(shots.camera.elevation, t) + pointer.y * 0.04 + intro * 0.18;
    const cam = state.camera as PerspectiveCamera;
    cam.position.set(
      target.x + Math.sin(az) * Math.cos(el) * dist,
      target.y + Math.sin(el) * dist,
      target.z + Math.cos(az) * Math.cos(el) * dist,
    );
    cam.lookAt(target);
    cam.rotateZ(shots.sample(shots.camera.roll, t));

    // Narrow screens: pull back so the subjects keep breathing room
    const aspect = state.size.width / state.size.height;
    // Hyperspace: the lens stretches wide while jumping between acts
    const fov = shots.sample(shots.camera.fov, t) * (aspect < 1 ? 1.45 : 1) * (1 + director.warp * director.warp * 0.7);
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
