import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("public/artworks");
fs.mkdirSync(root, { recursive: true });

const assets = "C:/Users/victo/.cursor/projects/c-Users-victo-Desktop-art-gallery-art-gallery/assets";

const jobs = [
  { file: "4h7mtjULE9xg-0547b5ed-56a4-4000-8fa7-3c405ceca68d.jpg", out: "golden-descent.jpg", cut: false },
  { file: "5tpxzf2WBh-6d38e97e-7b3f-4773-8bae-7ba296c377cd.jpg", out: "winged-horse.jpg", cut: false },
  { file: "sIqDvHdhi8-c5ebf885-dbd3-4141-81cb-cf04f0fd822c.jpg", out: "green-eye.jpg", cut: false },
  { file: "e82q6ZChb9rX-7ec661da-5d5f-4678-b6cb-7ca6f0fea3d7.jpg", out: "horse-and-ships.jpg", cut: false },
  { file: "QIkTtzGB9O-d2e009bf-d710-4c51-856d-bbc0c8743e29.jpg", out: "two-faces.png", cut: true, inset: 16 },
  { file: "OLd6iQ2ZYf-cf48c792-19e6-4534-b024-e4843b78b708.jpg", out: "the-profile.png", cut: true, inset: 0 },
  { file: "m61QVg7IAv-d8272a1e-2ce4-46a7-a341-22b020cb125c.jpg", out: "the-walk.png", cut: true, inset: 28 },
];

function cornerColor(data, width, height) {
  const samples = [];
  const take = (x0, y0) => {
    for (let y = y0; y < y0 + 12; y += 1) {
      for (let x = x0; x < x0 + 12; x += 1) {
        const i = (y * width + x) * 4;
        samples.push([data[i], data[i + 1], data[i + 2]]);
      }
    }
  };
  take(0, 0);
  take(width - 12, 0);
  take(0, height - 12);
  take(width - 12, height - 12);
  samples.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
  return samples[(samples.length / 2) | 0];
}

function isPaint(data, i, bg) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const dist = Math.hypot(r - bg[0], g - bg[1], b - bg[2]);
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  return dist > 34 || chroma > 26;
}

function dilate(mask, width, height, radius) {
  const next = new Uint8Array(mask.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = y * width + x;
      if (!mask[p]) continue;
      for (let dy = -radius; dy <= radius; dy += 1) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = x + dx;
          if (nx < 0 && nx >= width) continue;
          if (nx >= 0 && nx < width) next[ny * width + nx] = 1;
        }
      }
    }
  }
  return next;
}

function erode(mask, width, height, radius) {
  const next = new Uint8Array(mask.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let keep = true;
      for (let dy = -radius; dy <= radius && keep; dy += 1) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) {
          keep = false;
          break;
        }
        const row = ny * width;
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = x + dx;
          if (nx < 0 || nx >= width || !mask[row + nx]) {
            keep = false;
            break;
          }
        }
      }
      if (keep) next[y * width + x] = 1;
    }
  }
  return next;
}

function cutOut(data, width, height, inset) {
  const bg = cornerColor(data, width, height);
  let paint = new Uint8Array(width * height);
  for (let p = 0; p < paint.length; p += 1) {
    if (isPaint(data, p * 4, bg)) paint[p] = 1;
  }
  paint = dilate(paint, width, height, 5);

  const outside = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (outside[p] || paint[p]) return;
    outside[p] = 1;
    queue[tail++] = p;
  };
  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }
  while (head < tail) {
    const p = queue[head++];
    const x = p % width;
    const y = (p / width) | 0;
    push(x - 1, y);
    push(x + 1, y);
    push(x, y - 1);
    push(x, y + 1);
  }

  let keep = new Uint8Array(width * height);
  for (let p = 0; p < keep.length; p += 1) {
    if (!outside[p]) keep[p] = 1;
  }
  keep = erode(keep, width, height, 11);

  let boxMinX = width;
  let boxMinY = height;
  let boxMaxX = 0;
  let boxMaxY = 0;
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  for (let p = 0; p < keep.length; p += 1) {
    if (!keep[p]) continue;
    const x = p % width;
    const y = (p / width) | 0;
    if (x < boxMinX) boxMinX = x;
    if (y < boxMinY) boxMinY = y;
    if (x > boxMaxX) boxMaxX = x;
    if (y > boxMaxY) boxMaxY = y;
    sumX += x;
    sumY += y;
    count += 1;
  }
  const boxW = boxMaxX - boxMinX + 1;
  const boxH = boxMaxY - boxMinY + 1;
  if (count > 0 && boxW / boxH > 0.9 && boxW / boxH < 1.1) {
    const cx = sumX / count;
    const cy = sumY / count;
    const dists = [];
    for (let y = boxMinY; y <= boxMaxY; y += 1) {
      for (let x = boxMinX; x <= boxMaxX; x += 1) {
        const p = y * width + x;
        if (!keep[p]) continue;
        const edge =
          x === 0 ||
          y === 0 ||
          x === width - 1 ||
          y === height - 1 ||
          !keep[p - 1] ||
          !keep[p + 1] ||
          !keep[p - width] ||
          !keep[p + width];
        if (edge) dists.push(Math.hypot(x - cx, y - cy));
      }
    }
    dists.sort((a, b) => a - b);
    const radius = dists[Math.max(0, Math.floor(dists.length * 0.16))] - inset;
    for (let p = 0; p < keep.length; p += 1) {
      if (!keep[p]) continue;
      const x = p % width;
      const y = (p / width) | 0;
      if (Math.hypot(x - cx, y - cy) > radius) keep[p] = 0;
    }
  }

  for (let p = 0; p < keep.length; p += 1) {
    if (!keep[p]) data[p * 4 + 3] = 0;
  }

  const label = new Int32Array(width * height);
  let bestId = 0;
  let bestCount = 0;
  let current = 0;
  const stack = [];

  for (let start = 0; start < width * height; start += 1) {
    if (data[start * 4 + 3] === 0 || label[start]) continue;
    current += 1;
    let count = 0;
    stack.push(start);
    label[start] = current;
    while (stack.length) {
      const p = stack.pop();
      count += 1;
      const x = p % width;
      const y = (p / width) | 0;
      const neighbors = [p - 1, p + 1, p - width, p + width];
      for (const n of neighbors) {
        if (n < 0 || n >= width * height || label[n] || data[n * 4 + 3] === 0) continue;
        const nx = n % width;
        if (Math.abs(nx - x) > 1) continue;
        label[n] = current;
        stack.push(n);
      }
    }
    if (count > bestCount) {
      bestCount = count;
      bestId = current;
    }
  }

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let p = 0; p < width * height; p += 1) {
    if (label[p] !== bestId) {
      data[p * 4 + 3] = 0;
      continue;
    }
    const x = p % width;
    const y = (p / width) | 0;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  return { minX, minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

for (const job of jobs) {
  const input = path.join(assets, job.file);
  const output = path.join(root, job.out);
  if (!job.cut) {
    const info = await sharp(input)
      .rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(output);
    console.log(`${job.out} ${info.width}x${info.height}`);
    continue;
  }

  const { data, info } = await sharp(input).rotate().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const box = cutOut(data, info.width, info.height, job.inset ?? 0);
  const saved = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left: box.minX, top: box.minY, width: box.width, height: box.height })
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .png()
    .toFile(output);
  console.log(`${job.out} ${saved.width}x${saved.height}`);
}
