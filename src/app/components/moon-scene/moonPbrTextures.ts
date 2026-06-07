import * as THREE from "three";

const MOON_COLOR_URL = "/textures/moon_2k_color.jpg";
const MOON_COLOR_FALLBACK_URL = "/textures/moon_color.jpg";
const MOON_HEIGHT_URL = "/textures/moon_bump.jpg";

export const MOON_PBR_TEXTURES = [MOON_COLOR_URL, MOON_HEIGHT_URL] as const;

function sampleHeight(data: ImageData, x: number, y: number) {
  const w = data.width;
  const h = data.height;
  const sx = Math.max(0, Math.min(w - 1, x));
  const sy = Math.max(0, Math.min(h - 1, y));
  const index = (sy * w + sx) * 4;
  return data.data[index] / 255;
}

function sampleLuminance(data: ImageData, x: number, y: number) {
  const w = data.width;
  const h = data.height;
  const sx = Math.max(0, Math.min(w - 1, x));
  const sy = Math.max(0, Math.min(h - 1, y));
  const index = (sy * w + sx) * 4;
  const r = data.data[index] / 255;
  const g = data.data[index + 1] / 255;
  const b = data.data[index + 2] / 255;
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function drawToCanvas(source: CanvasImageSource, maxSize: number) {
  const width =
    "width" in source && typeof source.width === "number" ? source.width : maxSize;
  const height =
    "height" in source && typeof source.height === "number" ? source.height : maxSize;
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear el canvas para mapas lunares.");
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/** Convierte un height map en normal map tangencial (OpenGL / Three.js). */
export function createNormalMapFromHeight(
  heightSource: CanvasImageSource,
  strength = 2.4,
  maxSize = 2048,
): THREE.Texture {
  const canvas = drawToCanvas(heightSource, maxSize);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo leer el height map lunar.");

  const { width, height } = canvas;
  const heights = ctx.getImageData(0, 0, width, height);
  const normals = ctx.createImageData(width, height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const left = sampleHeight(heights, x - 1, y);
      const right = sampleHeight(heights, x + 1, y);
      const up = sampleHeight(heights, x, y - 1);
      const down = sampleHeight(heights, x, y + 1);

      const dx = (left - right) * strength;
      const dy = (up - down) * strength;
      const nx = dx;
      const ny = -dy;
      const nz = 1;
      const length = Math.hypot(nx, ny, nz) || 1;
      const index = (y * width + x) * 4;

      normals.data[index] = Math.round((nx / length) * 0.5 * 255 + 127.5);
      normals.data[index + 1] = Math.round((ny / length) * 0.5 * 255 + 127.5);
      normals.data[index + 2] = Math.round((nz / length) * 0.5 * 255 + 127.5);
      normals.data[index + 3] = 255;
    }
  }

  ctx.putImageData(normals, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/** Regolito lunar: mares más lisos, highlands más rugosos. */
export function createRoughnessMapFromColor(
  colorSource: CanvasImageSource,
  maxSize = 2048,
): THREE.Texture {
  const canvas = drawToCanvas(colorSource, maxSize);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo leer el albedo lunar.");

  const { width, height } = canvas;
  const color = ctx.getImageData(0, 0, width, height);
  const roughness = ctx.createImageData(width, height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const r = color.data[index] / 255;
      const g = color.data[index + 1] / 255;
      const b = color.data[index + 2] / 255;
      const luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;

      const left = sampleLuminance(color, x - 1, y);
      const right = sampleLuminance(color, x + 1, y);
      const up = sampleLuminance(color, x, y - 1);
      const down = sampleLuminance(color, x, y + 1);
      const microDetail = Math.min(1, Math.abs(left - right) + Math.abs(up - down));

      const value = THREE.MathUtils.clamp(
        0.78 + luminance * 0.16 + microDetail * 0.12,
        0.76,
        0.98,
      );

      const byte = Math.round(value * 255);
      roughness.data[index] = byte;
      roughness.data[index + 1] = byte;
      roughness.data[index + 2] = byte;
      roughness.data[index + 3] = 255;
    }
  }

  ctx.putImageData(roughness, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

export function configureMoonColorMap(texture: THREE.Texture, anisotropy: number) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
}

export function configureMoonDataMap(texture: THREE.Texture, anisotropy: number) {
  texture.colorSpace = THREE.NoColorSpace;
  texture.anisotropy = anisotropy;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
}

export async function loadMoonPbrTextures(anisotropy: number) {
  let colorImage: HTMLImageElement;
  try {
    colorImage = await loadImage(MOON_COLOR_URL);
  } catch {
    colorImage = await loadImage(MOON_COLOR_FALLBACK_URL);
  }
  const heightImage = await loadImage(MOON_HEIGHT_URL);

  const colorMap = new THREE.Texture(colorImage);
  configureMoonColorMap(colorMap, anisotropy);
  colorMap.needsUpdate = true;

  const normalMap = createNormalMapFromHeight(heightImage, 2.65);
  configureMoonDataMap(normalMap, anisotropy);

  const roughnessMap = createRoughnessMapFromColor(colorImage);
  configureMoonDataMap(roughnessMap, anisotropy);

  const displacementMap = new THREE.Texture(heightImage);
  configureMoonDataMap(displacementMap, anisotropy);
  displacementMap.needsUpdate = true;

  return { colorMap, normalMap, roughnessMap, displacementMap };
}

export function getMoonSphereSegments(quality: "low" | "medium" | "high" | "ultra") {
  if (quality === "ultra") return 256;
  if (quality === "high") return 192;
  if (quality === "medium") return 144;
  return 112;
}

export function getMoonNormalScale(quality: "low" | "medium" | "high" | "ultra") {
  if (quality === "ultra") return 1.35;
  if (quality === "high") return 1.15;
  if (quality === "medium") return 0.95;
  return 0.75;
}
