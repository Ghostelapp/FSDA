import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { execSync } from 'child_process';

const playStoreDir = path.resolve('public/play-store');
if (!fs.existsSync(playStoreDir)) {
  fs.mkdirSync(playStoreDir, { recursive: true });
}

// 1. Generate real RSA-2048 certificate & PKCS12 keystore via OpenSSL
const keyPemPath = path.join(playStoreDir, 'release-key.pem');
const certPemPath = path.join(playStoreDir, 'release-cert.pem');
const keystorePath = path.join(playStoreDir, 'android.keystore');
const androidKeystoreCopy = path.resolve('android/android.keystore');

execSync(
  `openssl req -x509 -newkey rsa:2048 -nodes -keyout "${keyPemPath}" -out "${certPemPath}" -days 10000 -subj "/CN=Full Stack Academy/OU=Mobile/O=FullStackAcademy/L=Warsaw/ST=Mazowieckie/C=PL"`,
  { stdio: 'ignore' }
);

execSync(
  `openssl pkcs12 -export -in "${certPemPath}" -inkey "${keyPemPath}" -out "${keystorePath}" -name "android" -passout pass:fullstack2026`,
  { stdio: 'ignore' }
);

fs.copyFileSync(keystorePath, androidKeystoreCopy);

// Extract real SHA-256 fingerprint
const fingerprintOutput = execSync(`openssl x509 -in "${certPemPath}" -noout -fingerprint -sha256`).toString().trim();
// e.g. sha256 Fingerprint=AA:BB:CC...
const sha256Fingerprint = fingerprintOutput.split('=')[1].trim();

// Clean up temporary PEM files so only keystore remains
fs.unlinkSync(keyPemPath);
fs.unlinkSync(certPemPath);

console.log('Generated real Android Keystore with SHA-256:', sha256Fingerprint);

// 2. Update public/.well-known/assetlinks.json with real SHA-256
const assetLinks = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'com.fullstackacademy.app',
      sha256_cert_fingerprints: [sha256Fingerprint],
    },
  },
];

fs.writeFileSync(
  path.resolve('public/.well-known/assetlinks.json'),
  JSON.stringify(assetLinks, null, 2),
  'utf-8'
);

// 3. Helper to generate valid PNG buffers for Google Play Store Graphics
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

function createGraphicPng(width, height, variant = 'feature') {
  const rowSize = width * 4;
  const rawData = Buffer.alloc(height * (rowSize + 1));

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // No filter
    const ny = y / height;

    for (let x = 0; x < width; x++) {
      const nx = x / width;

      // Dark slate base (#020617 to #0f172a)
      let r = Math.round(2 + ny * 15);
      let g = Math.round(6 + ny * 20);
      let b = Math.round(23 + ny * 35);

      // Decorative glowing orb & UI cards simulation
      const dx1 = (x - width * 0.28) / (height * 0.45);
      const dy1 = (y - height * 0.48) / (height * 0.45);
      const d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

      if (d1 < 1.0) {
        const glow = Math.pow(1 - d1, 2);
        r = Math.min(255, Math.round(r + 79 * glow));
        g = Math.min(255, Math.round(g + 70 * glow));
        b = Math.min(255, Math.round(b + 229 * glow));
      }

      const dx2 = (x - width * 0.72) / (height * 0.45);
      const dy2 = (y - height * 0.52) / (height * 0.45);
      const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

      if (d2 < 1.0) {
        const glow2 = Math.pow(1 - d2, 2);
        r = Math.min(255, Math.round(r + 6 * glow2));
        g = Math.min(255, Math.round(g + 182 * glow2));
        b = Math.min(255, Math.round(b + 212 * glow2));
      }

      // Draw modern UI card frame inside screenshot/banner
      const inCardX = nx > 0.1 && nx < 0.9;
      const inCardY = ny > 0.14 && ny < 0.86;
      if (inCardX && inCardY) {
        // Card border
        if (nx < 0.105 || nx > 0.895 || ny < 0.145 || ny > 0.855) {
          r = 99;
          g = 102;
          b = 241;
        } else if (ny > 0.22 && ny < 0.28 && nx > 0.16 && nx < 0.65) {
          // Accent header bar
          r = 56;
          g = 189;
          b = 248;
        } else if (
          variant === 'editor' &&
          ny > 0.35 &&
          ny < 0.75 &&
          nx > 0.16 &&
          nx < 0.84 &&
          Math.floor(y / 14) % 2 === 0
        ) {
          // Code lines in editor screenshot
          r = 52;
          g = 211;
          b = 153;
        } else if (
          variant === 'cert' &&
          ny > 0.38 &&
          ny < 0.72 &&
          nx > 0.2 &&
          nx < 0.8
        ) {
          // Gold certificate accent
          r = Math.min(255, r + 45);
          g = Math.min(255, g + 35);
          b = Math.min(255, b + 10);
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = 255;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    signature,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', deflated),
    createChunk('IEND', Buffer.alloc(0)),
  ]);
}

// Generate Google Play Feature Graphic (1024x500) & 3 Phone Screenshots (540x960 - 9:16)
fs.writeFileSync(
  path.join(playStoreDir, 'feature-graphic-1024x500.png'),
  createGraphicPng(1024, 500, 'feature')
);
fs.writeFileSync(
  path.join(playStoreDir, 'screenshot-1-dashboard.png'),
  createGraphicPng(540, 960, 'dashboard')
);
fs.writeFileSync(
  path.join(playStoreDir, 'screenshot-2-editor.png'),
  createGraphicPng(540, 960, 'editor')
);
fs.writeFileSync(
  path.join(playStoreDir, 'screenshot-3-certificate.png'),
  createGraphicPng(540, 960, 'cert')
);

// 4. Write ready-to-paste Google Play Store Listing Metadata JSON
const storeListingData = {
  appId: 'com.fullstackacademy.app',
  versionName: '1.0.0',
  versionCode: 1,
  defaultLanguage: 'pl-PL',
  title: 'Full Stack Academy — Kurs IT',
  shortDescription: 'Nauka programowania od zera do Full Stack Developera: HTML, JS, React, SQL i Git',
  fullDescription: `Zostań profesjonalnym Full Stack Developerem z aplikacją mobilną Full Stack Academy!

Ucz się programowania krok po kroku poprzez interaktywne lekcje, praktyczne ćwiczenia w edytorze kodu, symulator terminala Bash/Git oraz studio baz danych SQL.

GŁÓWNE FUNKCJE APLIKACJI:
• 15 kompletnych modułów szkoleniowych (od podstaw Internetu i HTML5, przez CSS3, JavaScript ES6+, TypeScript i React, aż po Node.js, Express, SQL, Cyberbezpieczeństwo i DevOps).
• Wbudowana Piaskownica Kodu (HTML/CSS/JS) z automatyczną weryfikacją testów jednostkowych.
• Interaktywny symulator Terminala UNIX / Bash oraz systemu kontroli wersji Git.
• Studio Bazy Danych SQL z wykonywaniem zapytań na żywo.
• Egzaminy Live Coding (Mock Interviews) przygotowujące do rozmów kwalifikacyjnych.
• System grywalizacji: punkty XP, poziomy, dzienna seria nauki (Streak), odznaki oraz imienny Certyfikat Ukończenia Kursu.
• Tryb Offline (Service Worker) pozwalający na przeglądanie lekcji bez dostępu do sieci.

Dla kogo?
Kurs został zaprojektowany zarówno dla osób stawiających pierwsze kroki w branży IT, jak i początkujących programistów chcących uporządkować wiedzę i zbudować portfolio 12 projektów komercyjnych.`,
  category: 'Edukacja (Education)',
  contentRating: 'PEGI 3 / Dla każdego',
  contactEmail: 'zordonzordon1@gmail.com',
  privacyPolicyUrl: 'https://ais-pre-4ucmmlowc42fnc3g36cfl7-601573615813.europe-west3.run.app/privacy-policy.html',
  productionAppUrl: 'https://ais-pre-4ucmmlowc42fnc3g36cfl7-601573615813.europe-west3.run.app',
  keystoreInfo: {
    file: 'play-store/android.keystore',
    alias: 'android',
    storePassword: 'fullstack2026',
    keyPassword: 'fullstack2026',
    sha256Fingerprint,
  },
  assets: {
    icon512: '/pwa-512x512.png',
    maskable512: '/pwa-maskable-512x512.png',
    featureGraphic1024x500: '/play-store/feature-graphic-1024x500.png',
    screenshots: [
      '/play-store/screenshot-1-dashboard.png',
      '/play-store/screenshot-2-editor.png',
      '/play-store/screenshot-3-certificate.png',
    ],
  },
};

fs.writeFileSync(
  path.join(playStoreDir, 'karta-sklepu-play.json'),
  JSON.stringify(storeListingData, null, 2),
  'utf-8'
);

console.log('Google Play Store assets and listing metadata generated successfully!');
