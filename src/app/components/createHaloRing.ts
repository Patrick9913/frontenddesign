import * as THREE from "three";

/** Radio central del anillo. */
const HALO_MAJOR_RADIUS = 4.2;
/**
 * Medio-espesor radial (distancia del centro al borde interior/exterior).
 * Antes era 0.32; reducido para un borde interno menos ancho.
 */
const BAND_HALF_WIDTH = 0.22;
/** Altura estructural del perfil (eje Y) — ~20 % del ancho radial, estilo Halo. */
const BAND_DEPTH = BAND_HALF_WIDTH * 2 * 0.2;

const innerRadius = HALO_MAJOR_RADIUS - BAND_HALF_WIDTH;
const outerRadius = HALO_MAJOR_RADIUS + BAND_HALF_WIDTH;
const bandRadialWidth = BAND_HALF_WIDTH * 2;

type RingAssets = {
  group: THREE.Group;
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
};

function trackGeometry(geometries: THREE.BufferGeometry[], geometry: THREE.BufferGeometry) {
  geometries.push(geometry);
  return geometry;
}

function trackMaterial(materials: THREE.Material[], material: THREE.Material) {
  materials.push(material);
  return material;
}

function placeBandSlab(
  slab: THREE.Object3D,
  angle: number,
  radius: number,
  y = 0
) {
  slab.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
  slab.rotation.y = -angle;
}

export function createHaloRing(segmentCount = 28): RingAssets {
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const bodyMaterial = trackMaterial(
    materials,
    new THREE.MeshBasicMaterial({
      color: 0x8fa3b8,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
    })
  );

  const edgeMaterial = trackMaterial(
    materials,
    new THREE.LineBasicMaterial({
      color: 0xf0f4fa,
      transparent: true,
      opacity: 0.38,
    })
  );

  const innerRimMaterial = trackMaterial(
    materials,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.34,
    })
  );

  const outerRimMaterial = trackMaterial(
    materials,
    new THREE.LineBasicMaterial({
      color: 0xc8d4e4,
      transparent: true,
      opacity: 0.24,
    })
  );

  const arcSegments = 128;
  const slabLength = ((Math.PI * 2 * HALO_MAJOR_RADIUS) / arcSegments) * 1.01;
  const slabGeometry = trackGeometry(
    geometries,
    new THREE.BoxGeometry(slabLength, BAND_DEPTH, bandRadialWidth)
  );
  const slabEdges = trackGeometry(geometries, new THREE.EdgesGeometry(slabGeometry, 20));

  const rimY = BAND_DEPTH * 0.48;
  const rimSteps = 12;

  for (let i = 0; i < arcSegments; i++) {
    const angle = ((i + 0.5) / arcSegments) * Math.PI * 2;

    const slab = new THREE.Mesh(slabGeometry, bodyMaterial);
    placeBandSlab(slab, angle, HALO_MAJOR_RADIUS);
    group.add(slab);

    const edgeLines = new THREE.LineSegments(slabEdges, edgeMaterial);
    placeBandSlab(edgeLines, angle, HALO_MAJOR_RADIUS);
    group.add(edgeLines);
  }

  for (let i = 0; i <= arcSegments; i += rimSteps) {
    const angle = (i / arcSegments) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const innerTop = trackGeometry(
      geometries,
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(cos * innerRadius, rimY, sin * innerRadius),
        new THREE.Vector3(cos * outerRadius, rimY, sin * outerRadius),
      ])
    );
    group.add(new THREE.Line(innerTop, i % (rimSteps * 2) === 0 ? innerRimMaterial : edgeMaterial));

    const innerRim = trackGeometry(
      geometries,
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(cos * innerRadius, rimY, sin * innerRadius),
        new THREE.Vector3(cos * innerRadius, -rimY, sin * innerRadius),
      ])
    );
    group.add(new THREE.Line(innerRim, innerRimMaterial));

    const outerRim = trackGeometry(
      geometries,
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(cos * outerRadius, rimY, sin * outerRadius),
        new THREE.Vector3(cos * outerRadius, -rimY, sin * outerRadius),
      ])
    );
    group.add(new THREE.Line(outerRim, outerRimMaterial));
  }

  const innerFaceGeometry = trackGeometry(
    geometries,
    new THREE.RingGeometry(innerRadius + 0.01, innerRadius + bandRadialWidth * 0.22, 96)
  );
  const innerFaceMaterial = trackMaterial(
    materials,
    new THREE.MeshBasicMaterial({
      color: 0xa8c8e8,
      transparent: true,
      opacity: 0.07,
      side: THREE.DoubleSide,
    })
  );
  const innerFace = new THREE.Mesh(innerFaceGeometry, innerFaceMaterial);
  innerFace.rotation.x = -Math.PI / 2;
  innerFace.position.y = rimY * 0.92;
  group.add(innerFace);

  const panelGeometry = trackGeometry(
    geometries,
    new THREE.BoxGeometry(0.12, BAND_DEPTH * 0.88, 0.07)
  );
  const panelMaterial = trackMaterial(
    materials,
    new THREE.MeshBasicMaterial({
      color: 0xe8eef6,
      transparent: true,
      opacity: 0.18,
    })
  );

  const panelRadius = innerRadius + bandRadialWidth * 0.35;
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 2;
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(Math.cos(angle) * panelRadius, 0, Math.sin(angle) * panelRadius);
    panel.lookAt(0, 0, 0);
    panel.rotateY(Math.PI / 2);
    group.add(panel);
  }

  const bridgeGeometry = trackGeometry(
    geometries,
    new THREE.BoxGeometry(0.05, BAND_DEPTH * 1.05, 0.05)
  );
  const bridgeMaterial = trackMaterial(
    materials,
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
    })
  );

  for (let i = 0; i < segmentCount; i += 2) {
    const angle = (i / segmentCount) * Math.PI * 2;
    const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
    bridge.position.set(
      Math.cos(angle) * (panelRadius + 0.03),
      0,
      Math.sin(angle) * (panelRadius + 0.03)
    );
    bridge.lookAt(0, 0, 0);
    group.add(bridge);
  }

  return { group, geometries, materials };
}
