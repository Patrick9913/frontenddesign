import * as THREE from "three";

export type CardShellAssets = {
  group: THREE.Group;
  body: THREE.Mesh;
  edges: THREE.LineSegments;
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
};

const CARD_WIDTH = 4.6;
const CARD_HEIGHT = 4.9;
const CARD_DEPTH = 0.045;

export const THREE_CARD_WIDTH = CARD_WIDTH;
export const THREE_CARD_HEIGHT = CARD_HEIGHT;

function trackGeometry(geometries: THREE.BufferGeometry[], geometry: THREE.BufferGeometry) {
  geometries.push(geometry);
  return geometry;
}

function trackMaterial(materials: THREE.Material[], material: THREE.Material) {
  materials.push(material);
  return material;
}

export function createThreeCardShell(): CardShellAssets {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const group = new THREE.Group();

  const bodyGeometry = trackGeometry(
    geometries,
    new THREE.BoxGeometry(CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH)
  );

  const bodyMaterial = trackMaterial(
    materials,
    new THREE.MeshStandardMaterial({
      color: 0x050505,
      metalness: 0.15,
      roughness: 0.82,
    })
  );

  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);

  const edgeGeometry = trackGeometry(geometries, new THREE.EdgesGeometry(bodyGeometry, 18));
  const edgeMaterial = trackMaterial(
    materials,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.14,
    })
  );

  const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
  group.add(edges);

  const rimGeometry = trackGeometry(
    geometries,
    new THREE.PlaneGeometry(CARD_WIDTH * 0.998, 0.028)
  );
  const rimMaterial = trackMaterial(
    materials,
    new THREE.MeshBasicMaterial({
      color: 0x0a0a0a,
      transparent: true,
      opacity: 0.95,
    })
  );
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.y = CARD_HEIGHT / 2 - 0.14;
  rim.position.z = CARD_DEPTH / 2 + 0.001;
  group.add(rim);

  return { group, body, edges, geometries, materials };
}
