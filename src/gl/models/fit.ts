import { Box3, Matrix4, Vector3, type Mesh, type Object3D } from "three";

const tmpBox = new Box3();
const inv = new Matrix4();
const rel = new Matrix4();

/** Objects flagged `userData.noBounds` (and their children) are ignored. */
function isExcluded(obj: Object3D, root: Object3D) {
  for (let o: Object3D | null = obj; o && o !== root; o = o.parent) {
    if (o.userData.noBounds) return true;
  }
  return false;
}

/** Bounding box of every mesh under `root`, expressed in root's local space. */
export function localBounds(root: Object3D) {
  root.updateWorldMatrix(true, true);
  inv.copy(root.matrixWorld).invert();
  const box = new Box3();
  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh || isExcluded(mesh, root)) return;
    const geometry = mesh.geometry;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    rel.multiplyMatrices(inv, mesh.matrixWorld);
    tmpBox.copy(geometry.boundingBox!).applyMatrix4(rel);
    box.union(tmpBox);
  });
  return box;
}

/**
 * Scales `wrapper` so its content is `height` tall, centered on X/Z, with the
 * pivot at the feet (`bottom`) or the middle (`center`). Returns the scale.
 */
export function fitToHeight(wrapper: Object3D, height: number, anchor: "bottom" | "center") {
  wrapper.scale.setScalar(1);
  wrapper.position.set(0, 0, 0);
  const box = localBounds(wrapper);
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());
  const scale = height / size.y;
  wrapper.scale.setScalar(scale);
  wrapper.position.set(
    -center.x * scale,
    anchor === "bottom" ? -box.min.y * scale : -center.y * scale,
    -center.z * scale,
  );
  return scale;
}
