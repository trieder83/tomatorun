import * as THREE from 'three';

let gradient: THREE.DataTexture | null = null;

/** 3-stufiger Verlauf für den Cartoon-Look. */
function gradientMap(): THREE.DataTexture {
  if (!gradient) {
    gradient = new THREE.DataTexture(new Uint8Array([90, 170, 255]), 3, 1, THREE.RedFormat);
    gradient.minFilter = THREE.NearestFilter;
    gradient.magFilter = THREE.NearestFilter;
    gradient.needsUpdate = true;
  }
  return gradient;
}

export function toon(color: number, emissive = 0x000000): THREE.MeshToonMaterial {
  return new THREE.MeshToonMaterial({ color, emissive, gradientMap: gradientMap() });
}

/** Schwarzer Comic-Umriss (umgedrehte, leicht vergrösserte Hülle). */
export function withOutline(mesh: THREE.Mesh, thickness = 0.04): THREE.Mesh {
  const outline = new THREE.Mesh(
    mesh.geometry,
    new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }),
  );
  mesh.geometry.computeBoundingSphere();
  const r = mesh.geometry.boundingSphere?.radius ?? 1;
  outline.scale.setScalar(1 + thickness / r);
  mesh.add(outline);
  return mesh;
}
