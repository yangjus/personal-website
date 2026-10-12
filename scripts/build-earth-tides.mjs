// Offline coast-distance texture. Longitude wraps, so tides also join at the map seam.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = new URL('../public/images/earth/', import.meta.url);
const width = 1024, height = 512, reach = 24;
const mask = await sharp(fileURLToPath(new URL('water-mask.svg', root)))
  .resize(width, height).removeAlpha().greyscale().raw().toBuffer();
const vertical = new Float32Array(width * height);
const input = new Float64Array(width * 3), output = new Float64Array(width * 3);
const sites = new Int32Array(width * 3), edges = new Float64Array(width * 3 + 1);

// Linear-time squared Euclidean distance transform of one row/column.
function distance(length) {
  let k = 0;
  sites[0] = 0; edges[0] = -Infinity; edges[1] = Infinity;
  for (let q = 1; q < length; q++) {
    let s;
    do {
      const v = sites[k];
      s = ((input[q] + q * q) - (input[v] + v * v)) / (2 * (q - v));
      if (s <= edges[k]) k--;
      else break;
    } while (k >= 0);
    k++; sites[k] = q; edges[k] = s; edges[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < length; q++) {
    while (edges[k + 1] < q) k++;
    const delta = q - sites[k]; output[q] = delta * delta + input[sites[k]];
  }
}

for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) input[y] = mask[y * width + x] < 128 ? 0 : 1e8;
  distance(height);
  for (let y = 0; y < height; y++) vertical[y * width + x] = output[y];
}
const pixels = Buffer.alloc(width * height);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width * 3; x++) input[x] = vertical[y * width + x % width];
  distance(width * 3);
  for (let x = 0; x < width; x++) {
    pixels[y * width + x] = Math.round(Math.min(1, Math.sqrt(output[x + width]) / reach) * 255);
  }
}
await sharp(pixels, { raw: { width, height, channels: 1 } }).png()
  .toFile(fileURLToPath(new URL('shore-distance.png', root)));
console.log(`Built ${width}×${height} coast-distance texture for animated tidal bands.`);
