import fs from 'node:fs';
import path from 'node:path';
import { buildZipArchive, isValidZipBuffer, type ZipEntryInput } from '../src/utils/zipBuilder';

const rootDir = process.cwd();

// 1. Ensure expo-mobile-app/assets has icon.png, adaptive-icon.png, and splash.png
const expoAssetsDir = path.join(rootDir, 'expo-mobile-app/assets');
if (!fs.existsSync(expoAssetsDir)) {
  fs.mkdirSync(expoAssetsDir, { recursive: true });
}
fs.copyFileSync(path.join(rootDir, 'public/pwa-512x512.png'), path.join(expoAssetsDir, 'icon.png'));
fs.copyFileSync(path.join(rootDir, 'public/pwa-512x512.png'), path.join(expoAssetsDir, 'splash.png'));
fs.copyFileSync(path.join(rootDir, 'public/pwa-maskable-512x512.png'), path.join(expoAssetsDir, 'adaptive-icon.png'));

const QUICK_START_TXT = `========================================================================
  FULL STACK ACADEMY — PAKIET PUBLIKACJI GOOGLE PLAY & EXPO APK (v2.0.0)
  Pakiet Android: com.fullstackacademy.app | Target SDK: 35 (Android 15)
========================================================================

SPOSÓB 1 — NAJSZYBSZY: GENEROWANIE .APK PRZEZ EXPO (EAS BUILD W CHMURZE)
Nie wymaga instalowania Android Studio ani Java JDK na komputerze!
1. Wejdź do folderu expo-mobile-app:
     cd expo-mobile-app
     npm install
2. Zaloguj się do darmowego konta Expo (https://expo.dev):
     npx eas-cli login
3. Wygeneruj instalator .APK (do bezpośredniej instalacji na telefonie):
     npx eas-cli build -p android --profile preview
   (Lub wygeneruj plik .AAB do sklepu Google Play Console):
     npx eas-cli build -p android --profile production
4. Po zakończeniu kompilacji w chmurze otrzymasz link oraz kod QR do pobrania
   gotowego pliku .apk prosto na telefon!

------------------------------------------------------------------------
SPOSÓB 2 — BEZPOŚREDNIA INSTALACJA NA TELEFONIE (WebAPK / Chrome):
1. Otwórz adres aplikacji w Chrome na telefonie Android:
     https://ais-pre-4ucmmlowc42fnc3g36cfl7-601573615813.europe-west3.run.app
2. W menu Chrome (⋮) wybierz "Zainstaluj aplikację".

------------------------------------------------------------------------
SPOSÓB 3 — ANDROID STUDIO / GRADLE (FOLDER android/):
1. Otwórz folder "android" w Android Studio lub uruchom:
     cd android && gradle bundleRelease assembleRelease
2. Dane klucza podpisu (android.keystore):
   - Alias: android
   - Hasło: fullstack2026
   - SHA-256: A6:5D:54:DB:3F:7C:C1:DF:CF:E4:45:1D:26:21:41:15:B8:49:58:D4:D2:D8:93:9D:AF:81:34:4F:81:23:86:23
========================================================================
`;

function collectDirectoryFiles(dirPath: string, entries: ZipEntryInput[], baseDir: string) {
  if (!fs.existsSync(dirPath)) return;
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const item of items) {
    if (item.name === 'node_modules' || item.name === '.expo') continue;
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      collectDirectoryFiles(fullPath, entries, baseDir);
    } else if (item.isFile()) {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      entries.push({
        path: relPath,
        data: new Uint8Array(fs.readFileSync(fullPath)),
      });
    }
  }
}

// A. Build dedicated Expo APK project archive: public/fullstack-academy-expo-apk.zip
const expoEntries: ZipEntryInput[] = [];
collectDirectoryFiles(path.join(rootDir, 'expo-mobile-app'), expoEntries, rootDir);
const expoZipBytes = buildZipArchive(expoEntries);
if (!isValidZipBuffer(expoZipBytes)) {
  throw new Error('Generated Expo ZIP buffer failed PKZIP integrity validation!');
}
const outExpoZipPath = path.join(rootDir, 'public/fullstack-academy-expo-apk.zip');
fs.writeFileSync(outExpoZipPath, Buffer.from(expoZipBytes));
console.log(`Successfully built valid Expo ZIP archive: ${outExpoZipPath} (${expoZipBytes.length} bytes, ${expoEntries.length} files)`);

// B. Build complete Google Play + Expo + Android TWA archive: public/fullstack-academy-google-play-pack.zip
const fullEntries: ZipEntryInput[] = [
  {
    path: 'INSTRUKCJA_SZYBKI_START.txt',
    data: QUICK_START_TXT,
  },
];

collectDirectoryFiles(path.join(rootDir, 'expo-mobile-app'), fullEntries, rootDir);
collectDirectoryFiles(path.join(rootDir, 'android'), fullEntries, rootDir);
collectDirectoryFiles(path.join(rootDir, 'public/play-store'), fullEntries, rootDir);

const singleFiles = [
  'ANDROID_PLAY_STORE_GUIDE.md',
  'twa-manifest.json',
  'public/.well-known/assetlinks.json',
  'public/privacy-policy.html',
  'public/pwa-192x192.png',
  'public/pwa-512x512.png',
  'public/pwa-maskable-512x512.png',
  'scripts/build-android-apk.sh',
  '.github/workflows/google-play-publish.yml',
];

for (const rel of singleFiles) {
  const full = path.join(rootDir, rel);
  if (fs.existsSync(full)) {
    fullEntries.push({
      path: rel,
      data: new Uint8Array(fs.readFileSync(full)),
    });
  }
}

const fullZipBytes = buildZipArchive(fullEntries);
if (!isValidZipBuffer(fullZipBytes)) {
  throw new Error('Generated Full ZIP buffer failed PKZIP integrity validation!');
}

const outFullZipPath = path.join(rootDir, 'public/fullstack-academy-google-play-pack.zip');
fs.writeFileSync(outFullZipPath, Buffer.from(fullZipBytes));
console.log(`Successfully built valid Full ZIP archive: ${outFullZipPath} (${fullZipBytes.length} bytes, ${fullEntries.length} files)`);
