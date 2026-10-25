import fs from 'node:fs';
import path from 'node:path';
import { buildZipArchive, isValidZipBuffer, type ZipEntryInput } from '../src/utils/zipBuilder';

const QUICK_START_TXT = `========================================================================
  FULL STACK ACADEMY — PAKIET PUBLIKACJI GOOGLE PLAY STORE (v2.0.0)
  Pakiet Android: com.fullstackacademy.app | Target SDK: 35 (Android 15)
========================================================================

WAŻNE — PRZECZYTAJ PRZED OTWARCIEM:
Ten plik (.zip) to kompletny pakiet deweloperski zawierający projekt
Android Studio / Gradle, klucz podpisu (android.keystore), konfigurację
Digital Asset Links (assetlinks.json) oraz grafiki i opisy do sklepu.

1. JAK ZAINSTALOWAĆ APLIKACJĘ BEZPOŚREDNIO NA TELEFONIE ANDROID (BEZ KOMPILACJI):
   - Otwórz adres aplikacji w przeglądarce Google Chrome na telefonie Android:
     https://ais-pre-4ucmmlowc42fnc3g36cfl7-601573615813.europe-west3.run.app
   - Kliknij przycisk "App / Play Store" -> zakładka "Instalacja na Telefonie"
     -> kliknij "Zainstaluj teraz" (lub w menu Chrome ⋮ wybierz "Zainstaluj aplikację").
   - System Android automatycznie utworzy i zainstaluje natywny pakiet WebAPK.

2. JAK WYGENEROWAĆ PODPISANY PLIK .AAB (DO GOOGLE PLAY) LUB .APK (NA TELEFON):
   Opcja A — Automatycznie w chmurze GitHub Actions (bez instalacji Android Studio):
   - Wypchnij projekt na swoje konto GitHub.
   - Wejdź w zakładkę "Actions" -> "Build Signed Android AAB/APK & Publish to Google Play".
   - Kliknij "Run workflow", a po zakończeniu pobierz gotowy plik app-release.aab i app-release.apk!

   Opcja B — Lokalnie na komputerze (Android Studio lub Gradle + JDK 17):
   - Otwórz folder "android" z tego archiwum w programie Android Studio
     LUB uruchom w terminalu:
       cd android
       gradle bundleRelease assembleRelease
   - Gotowe, podpisane pliki znajdziesz w:
     * AAB (do Google Play Console): android/app/build/outputs/bundle/release/app-release.aab
     * APK (do instalacji na telefonie): android/app/build/outputs/apk/release/app-release.apk

3. DANE KLUCZA PODPISU (KEYSTORE):
   - Plik klucza: android/android.keystore (oraz public/play-store/android.keystore)
   - Alias klucza: android
   - Hasło Keystore / Klucza: fullstack2026
   - Odcisk SHA-256: A6:5D:54:DB:3F:7C:C1:DF:CF:E4:45:1D:26:21:41:15:B8:49:58:D4:D2:D8:93:9D:AF:81:34:4F:81:23:86:23
========================================================================
`;

function collectDirectoryFiles(dirPath: string, entries: ZipEntryInput[], rootDir: string) {
  if (!fs.existsSync(dirPath)) return;
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      collectDirectoryFiles(fullPath, entries, rootDir);
    } else if (item.isFile()) {
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
      entries.push({
        path: relPath,
        data: new Uint8Array(fs.readFileSync(fullPath)),
      });
    }
  }
}

const rootDir = process.cwd();
const entries: ZipEntryInput[] = [
  {
    path: 'INSTRUKCJA_SZYBKI_START.txt',
    data: QUICK_START_TXT,
  },
];

// Collect all Android project files
collectDirectoryFiles(path.join(rootDir, 'android'), entries, rootDir);

// Collect Play Store graphics, keystore, and metadata
collectDirectoryFiles(path.join(rootDir, 'public/play-store'), entries, rootDir);

// Collect individual root & public files
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
    entries.push({
      path: rel,
      data: new Uint8Array(fs.readFileSync(full)),
    });
  }
}

const zipBytes = buildZipArchive(entries);
if (!isValidZipBuffer(zipBytes)) {
  throw new Error('Generated ZIP buffer failed PKZIP integrity validation!');
}

const outZipPath = path.join(rootDir, 'public/fullstack-academy-google-play-pack.zip');
fs.writeFileSync(outZipPath, Buffer.from(zipBytes));
console.log(`Successfully built valid ZIP archive: ${outZipPath} (${zipBytes.length} bytes, ${entries.length} files)`);
