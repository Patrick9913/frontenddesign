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

/** Segmentos del arco principal (antes 128 → ~56; un InstancedMesh en lugar de N meshes). */
const ARC_SEGMENTS = 56;
/** Muestreo de líneas de borde sobre el arco. */
const RIM_STEP = 8;

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

function buildRimLineSegments(
  geometries: THREE.BufferGeometry[],
  arcSegments: number,
  rimStep: number,
  rimY: number,
  buildSegment: (angle: number) => [THREE.Vector3, THREE.Vector3]
) {
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= arcSegments; i += rimStep) {
    const angle = (i / arcSegments) * Math.PI * 2;
    const [a, b] = buildSegment(angle);
    points.push(a, b);
  }

  const geometry = trackGeometry(geometries, new THREE.BufferGeometry().setFromPoints(points));
  return new THREE.LineSegments(geometry);
}

export function createHaloRing(segmentCount = 16): RingAssets {
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const matrixHelper = new THREE.Object3D();

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

  const slabLength = ((Math.PI * 2 * HALO_MAJOR_RADIUS) / ARC_SEGMENTS) * 1.01;
  const slabGeometry = trackGeometry(
    geometries,
    new THREE.BoxGeometry(slabLength, BAND_DEPTH, bandRadialWidth)
  );

  const slabInstances = new THREE.InstancedMesh(slabGeometry, bodyMaterial, ARC_SEGMENTS);
  for (let i = 0; i < ARC_SEGMENTS; i++) {
    const angle = ((i + 0.5) / ARC_SEGMENTS) * Math.PI * 2;
    matrixHelper.position.set(
      Math.cos(angle) * HALO_MAJOR_RADIUS,
      0,
      Math.sin(angle) * HALO_MAJOR_RADIUS
    );
    matrixHelper.rotation.set(0, -angle, 0);
    matrixHelper.updateMatrix();
    slabInstances.setMatrixAt(i, matrixHelper.matrix);
  }
  slabInstances.instanceMatrix.needsUpdate = true;
  group.add(slabInstances);

  const rimY = BAND_DEPTH * 0.48;

  const innerTopLines = buildRimLineSegments(
    geometries,
    ARC_SEGMENTS,
    RIM_STEP,
    rimY,
    (angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [
        new THREE.Vector3(cos * innerRadius, rimY, sin * innerRadius),
        new THREE.Vector3(cos * outerRadius, rimY, sin * outerRadius),
      ];
    }
  );
  innerTopLines.material = edgeMaterial;
  group.add(innerTopLines);

  const innerVerticalLines = buildRimLineSegments(
    geometries,
    ARC_SEGMENTS,
    RIM_STEP,
    rimY,
    (angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [
        new THREE.Vector3(cos * innerRadius, rimY, sin * innerRadius),
        new THREE.Vector3(cos * innerRadius, -rimY, sin * innerRadius),
      ];
    }
  );
  innerVerticalLines.material = innerRimMaterial;
  group.add(innerVerticalLines);

  const outerVerticalLines = buildRimLineSegments(
    geometries,
    ARC_SEGMENTS,
    RIM_STEP,
    rimY,
    (angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [
        new THREE.Vector3(cos * outerRadius, rimY, sin * outerRadius),
        new THREE.Vector3(cos * outerRadius, -rimY, sin * outerRadius),
      ];
    }
  );
  outerVerticalLines.material = outerRimMaterial;
  group.add(outerVerticalLines);

  const innerFaceGeometry = trackGeometry(
    geometries,
    new THREE.RingGeometry(innerRadius + 0.01, innerRadius + bandRadialWidth * 0.22, ARC_SEGMENTS)
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
  const panelInstances = new THREE.InstancedMesh(panelGeometry, panelMaterial, segmentCount);
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 2;
    matrixHelper.position.set(
      Math.cos(angle) * panelRadius,
      0,
      Math.sin(angle) * panelRadius
    );
    matrixHelper.lookAt(0, 0, 0);
    matrixHelper.rotateY(Math.PI / 2);
    matrixHelper.updateMatrix();
    panelInstances.setMatrixAt(i, matrixHelper.matrix);
  }
  panelInstances.instanceMatrix.needsUpdate = true;
  group.add(panelInstances);

  const bridgeCount = Math.ceil(segmentCount / 2);
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

  const bridgeInstances = new THREE.InstancedMesh(bridgeGeometry, bridgeMaterial, bridgeCount);
  for (let i = 0; i < bridgeCount; i++) {
    const angle = ((i * 2) / segmentCount) * Math.PI * 2;
    matrixHelper.position.set(
      Math.cos(angle) * (panelRadius + 0.03),
      0,
      Math.sin(angle) * (panelRadius + 0.03)
    );
    matrixHelper.lookAt(0, 0, 0);
    matrixHelper.updateMatrix();
    bridgeInstances.setMatrixAt(i, matrixHelper.matrix);
  }
  bridgeInstances.instanceMatrix.needsUpdate = true;
  group.add(bridgeInstances);

  return { group, geometries, materials };
}
