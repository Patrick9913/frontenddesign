import * as THREE from "three";

function drawMoonColor(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#585858";
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 28; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 40 + Math.random() * 120;
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, "rgba(28, 28, 32, 0.85)");
    grd.addColorStop(0.6, "rgba(40, 40, 46, 0.35)");
    grd.addColorStop(1, "rgba(40, 40, 46, 0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 900; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 0.8 + Math.random() * 7;
    ctx.fillStyle = `rgba(18, 18, 22, ${0.25 + Math.random() * 0.45})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(210, 210, 220, ${0.08 + Math.random() * 0.14})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }
}

function drawMoonBump(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 750; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 1 + Math.random() * 9;
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, "#303030");
    grd.addColorStop(0.55, "#909090");
    grd.addColorStop(1, "#808080");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function createMoonTextures() {
  if (typeof document === "undefined") return null;

  const w = 2048;
  const h = 1024;

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = w;
  colorCanvas.height = h;
  const colorCtx = colorCanvas.getContext("2d");
  if (!colorCtx) return null;
  drawMoonColor(colorCtx, w, h);

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = w;
  bumpCanvas.height = h;
  const bumpCtx = bumpCanvas.getContext("2d");
  if (!bumpCtx) return null;
  drawMoonBump(bumpCtx, w, h);

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.ClampToEdgeWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;

  return { colorMap, bumpMap };
}

export function createStarfield(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 40 + Math.random() * 25;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}
