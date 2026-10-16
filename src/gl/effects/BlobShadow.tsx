import { forwardRef, useMemo } from "react";
import { CanvasTexture, type Mesh } from "three";

function createTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(0.45, "rgba(0,0,0,0.55)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

/**
 * Fake contact shadow. Real shadow maps ignore the dissolve `discard`, so a
 * soft blob whose opacity follows the dissolve reads far better.
 */
export const BlobShadow = forwardRef<Mesh, { size?: number }>(function BlobShadow({ size = 1.6 }, ref) {
  const texture = useMemo(createTexture, []);
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position-y={0.004} renderOrder={-1}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} opacity={0.85} />
    </mesh>
  );
});
