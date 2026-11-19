import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const appStoreDir = path.resolve('public/app-store');
const expoAssetsDir = path.resolve('expo-mobile-app/assets');

if (!fs.existsSync(appStoreDir)) {
  fs.mkdirSync(appStoreDir, { recursive: true });
}
if (!fs.existsSync(expoAssetsDir)) {
  fs.mkdirSync(expoAssetsDir, { recursive: true });
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

/**
 * Generates an opaque (RGB color type 2 — zero alpha channel!) 1024x1024 PNG
 * strictly conforming to Apple App Store Connect requirements.
 */
function generateOpaqueIosIconPng(size = 1024) {
  const rowSize = size * 3; // RGB 24-bit (no alpha channel)
  const rawData = Buffer.alloc(size * (rowSize + 1));
  const half = size / 2;

  let offset = 0;
  for (let y = 0; y < size; y++) {
    rawData[offset++] = 0; // filter None
    const ny = y / size;

    for (let x = 0; x < size; x++) {
      const nx = x / size;

      // Deep slate background (#020617 -> #0f172a)
      let r = 2 + Math.round(ny * 13);
      let g = 6 + Math.round(ny * 17);
      let b = 23 + Math.round(ny * 28);

      // Subtle indigo/cyan radial glow
      const distCenter = Math.hypot(x - half, y - half) / size;
      if (distCenter < 0.56) {
        const glow = Math.pow(1 - distCenter / 0.56, 2);
        r = Math.min(255, Math.round(r + 65 * glow * (1 - nx * 0.4)));
        g = Math.min(255, Math.round(g + 120 * glow * (0.4 + nx * 0.6)));
        b = Math.min(255, Math.round(b + 215 * glow));
      }

      // Inner rounded badge (centered gradient square with soft border)
      const pad = size * 0.16;
      const boxLeft = pad;
      const boxRight = size - pad;
      const cornerR = size * 0.17;
      const qx = Math.max(boxLeft + cornerR - x, 0, x - (boxRight - cornerR));
      const qy = Math.max(boxLeft + cornerR - y, 0, y - (boxRight - cornerR));
      const sdfBox = Math.hypot(qx, qy) - cornerR;

      if (sdfBox <= 0) {
        const grad = (nx + ny) * 0.5;
        r = Math.round(79 * (1 - grad) + 6 * grad);
        g = Math.round(70 * (1 - grad) + 182 * grad);
        b = Math.round(229 * (1 - grad) + 212 * grad);

        // Soft outer highlight border (4px)
        if (sdfBox > -size * 0.008) {
          r = Math.min(255, r + 55);
          g = Math.min(255, g + 55);
          b = Math.min(255, b + 55);
        }
      }

      // Crisp "</>" code symbol inside the badge
      const strokeRadius = size * 0.032;
      const dLeftTop = distanceToSegment(x, y, size * 0.38, size * 0.36, size * 0.27, size * 0.50);
      const dLeftBot = distanceToSegment(x, y, size * 0.27, size * 0.50, size * 0.38, size * 0.64);
      const dRightTop = distanceToSegment(x, y, size * 0.62, size * 0.36, size * 0.73, size * 0.50);
      const dRightBot = distanceToSegment(x, y, size * 0.73, size * 0.50, size * 0.62, size * 0.64);
      const dSlash = distanceToSegment(x, y, size * 0.55, size * 0.32, size * 0.45, size * 0.68);

      const minD = Math.min(dLeftTop, dLeftBot, dRightTop, dRightBot, dSlash);
      if (minD < strokeRadius + 1.5) {
        const aa = Math.max(0, Math.min(1, strokeRadius + 1.2 - minD));
        r = Math.round(r * (1 - aa) + 255 * aa);
        g = Math.round(g * (1 - aa) + 255 * aa);
        b = Math.round(b * (1 - aa) + 255 * aa);
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
    }
  }

  const deflated = zlib.deflateSync(rawData, { level: 6 });
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type 2: RGB (opaque, NO alpha channel - App Store compliant)
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    signature,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', deflated),
    createChunk('IEND', Buffer.alloc(0)),
  ]);
}

const iosIconBuffer = generateOpaqueIosIconPng(1024);
fs.writeFileSync(path.join(appStoreDir, 'app-store-icon-1024x1024.png'), iosIconBuffer);
fs.writeFileSync(path.join(expoAssetsDir, 'ios-icon-1024x1024.png'), iosIconBuffer);

console.log(`Generated opaque 1024x1024 iOS App Store icon (${iosIconBuffer.length} bytes)`);
