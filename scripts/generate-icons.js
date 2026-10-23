import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Ensure public directory exists
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Ensure .well-known directory exists
const wellKnownDir = path.join(publicDir, '.well-known');
if (!fs.existsSync(wellKnownDir)) {
  fs.mkdirSync(wellKnownDir, { recursive: true });
}

// CRC32 table & function for PNG chunks
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
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function generatePngBuffer(width, height, isMaskable = false) {
  // Color palette:
  // Background: Deep Slate-950 (#020617) -> [2, 6, 23]
  // Accent gradient: Indigo (#6366f1) to Cyan (#06b6d4)
  // Foreground: White / Bright Cyan
  const rowSize = width * 4;
  const rawData = Buffer.alloc(height * (rowSize + 1));

  const centerX = width / 2;
  const centerY = height / 2;
  const safeRadius = isMaskable ? width * 0.38 : width * 0.46;

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default background color (Deep slate gradient)
      let r = 2;
      let g = 6;
      let b = 23;
      let a = 255;

      // Rounded container or full bleed
      if (dist < safeRadius) {
        // Gradient inner badge
        const gradientT = (x + y) / (width + height);
        r = Math.round(79 * (1 - gradientT) + 14 * gradientT);
        g = Math.round(70 * (1 - gradientT) + 165 * gradientT);
        b = Math.round(229 * (1 - gradientT) + 233 * gradientT);

        // Draw code bracket symbol in center
        // Left bracket `<` and right bracket `>` and slash `/`
        const normX = (x - centerX) / (safeRadius * 0.7);
        const normY = (y - centerY) / (safeRadius * 0.7);

        // Center slash: line from (-0.2, 0.4) to (0.2, -0.4)
        const slashDist = Math.abs(normX * 0.8 + normY * 0.4);
        const isSlash = slashDist < 0.12 && Math.abs(normY) < 0.55;

        // Left angle bracket `<`
        const isLeftBracket = 
          (Math.abs(normX + 0.45 + Math.abs(normY) * 0.6) < 0.12) && 
          Math.abs(normY) < 0.5 && 
          normX < -0.2;

        // Right angle bracket `>`
        const isRightBracket = 
          (Math.abs(normX - 0.45 - Math.abs(normY) * 0.6) < 0.12) && 
          Math.abs(normY) < 0.5 && 
          normX > 0.2;

        if (isSlash || isLeftBracket || isRightBracket) {
          r = 255;
          g = 255;
          b = 255;
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const deflatedData = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT Chunk
  const idatChunk = createChunk('IDAT', deflatedData);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate files
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePngBuffer(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePngBuffer(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePngBuffer(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePngBuffer(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generatePngBuffer(64, 64, false));

// Also write public/icon.svg
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="fsdaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bgGradient)" />
  <circle cx="256" cy="256" r="180" fill="url(#fsdaGradient)" opacity="0.15" />
  <rect x="76" y="76" width="360" height="360" rx="90" fill="none" stroke="url(#fsdaGradient)" stroke-width="8" stroke-dasharray="16 8" />
  <!-- Code Brackets & Slash -->
  <path d="M 190 180 L 120 256 L 190 332" fill="none" stroke="#22d3ee" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M 322 180 L 392 256 L 322 332" fill="none" stroke="#818cf8" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" />
  <line x1="285" y1="160" x2="227" y2="352" stroke="#ffffff" stroke-width="30" stroke-linecap="round" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');

console.log('PNG and SVG icons generated successfully!');
