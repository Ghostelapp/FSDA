import { buildZipArchive, isNotHtmlFallback, isValidZipBuffer, type ZipEntryInput } from './zipBuilder';

const SHA256_FINGERPRINT =
  'A6:5D:54:DB:3F:7C:C1:DF:CF:E4:45:1D:26:21:41:15:B8:49:58:D4:D2:D8:93:9D:AF:81:34:4F:81:23:86:23';
const PRODUCTION_HOST = 'ais-pre-4ucmmlowc42fnc3g36cfl7-601573615813.europe-west3.run.app';

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
     https://${PRODUCTION_HOST}
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
   - Odcisk SHA-256: ${SHA256_FINGERPRINT}
========================================================================
`;

const ANDROID_BUILD_GRADLE = `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.5.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`;

const ANDROID_APP_BUILD_GRADLE = `apply plugin: 'com.android.application'

android {
    namespace "com.fullstackacademy.app"
    compileSdk 35

    defaultConfig {
        applicationId "com.fullstackacademy.app"
        minSdk 21
        targetSdk 35
        versionCode 2
        versionName "2.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"

        manifestPlaceholders = [
            hostName: "${PRODUCTION_HOST}",
            defaultUrl: "https://${PRODUCTION_HOST}/",
            launcherName: "@string/launcher_name",
            assetStatements: '[{ "relation": ["delegate_permission/common.handle_all_urls"], "target": { "namespace": "android_app", "package_name": "com.fullstackacademy.app", "sha256_cert_fingerprints": ["${SHA256_FINGERPRINT}"] } }]'
        ]
    }

    signingConfigs {
        release {
            storeFile file("../android.keystore")
            storePassword "fullstack2026"
            keyAlias "android"
            keyPassword "fullstack2026"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
}
`;

const PROGUARD_RULES = `# ProGuard / R8 rules for Full Stack Academy Trusted Web Activity (TWA)
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
-keep class com.google.androidbrowserhelper.** { *; }
-keep class androidx.browser.** { *; }
-keepclassmembers class **.R$* {
    public static <fields>;
}
`;

function triggerBlobDownload(bytes: Uint8Array, filename: string, mimeType: string): void {
  const blob = new Blob([bytes as unknown as BlobPart], { type: mimeType });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }, 1500);
}

async function fetchBinarySafe(url: string): Promise<Uint8Array | null> {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/octet-stream, application/json, image/png, */*' },
    });
    if (!res.ok) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    if (!isNotHtmlFallback(buf)) return null;
    return buf;
  } catch {
    return null;
  }
}

/**
 * Downloads the complete Google Play Store Release Pack as a standard, verified .zip file.
 * Verifies PKZIP magic bytes ("PK\x03\x04") and automatically falls back to building
 * a fresh PKZIP archive in memory if a proxy or cached Service Worker alters the stream.
 */
export async function downloadVerifiedPlayStoreZip(): Promise<void> {
  const staticZip = await fetchBinarySafe('/fullstack-academy-google-play-pack.zip');
  if (staticZip && isValidZipBuffer(staticZip)) {
    triggerBlobDownload(staticZip, 'fullstack-academy-google-play-pack.zip', 'application/zip');
    return;
  }

  // Fallback: build a verified PKZIP archive directly in memory
  const entries: ZipEntryInput[] = [
    { path: 'INSTRUKCJA_SZYBKI_START.txt', data: QUICK_START_TXT },
    { path: 'android/build.gradle', data: ANDROID_BUILD_GRADLE },
    { path: 'android/settings.gradle', data: `rootProject.name = "FullStackAcademy"\ninclude ':app'\n` },
    {
      path: 'android/gradle.properties',
      data: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8\nandroid.useAndroidX=true\nandroid.enableJetifier=true\nandroid.nonTransitiveRClass=true\n`,
    },
    { path: 'android/app/build.gradle', data: ANDROID_APP_BUILD_GRADLE },
    { path: 'android/app/proguard-rules.pro', data: PROGUARD_RULES },
  ];

  const assetsToFetch: Array<{ url: string; zipPath: string }> = [
    { url: '/twa-manifest.json', zipPath: 'twa-manifest.json' },
    { url: '/.well-known/assetlinks.json', zipPath: 'public/.well-known/assetlinks.json' },
    { url: '/play-store/karta-sklepu-play.json', zipPath: 'public/play-store/karta-sklepu-play.json' },
    { url: '/play-store/android.keystore', zipPath: 'android/android.keystore' },
    { url: '/play-store/android.keystore', zipPath: 'public/play-store/android.keystore' },
    { url: '/pwa-192x192.png', zipPath: 'public/pwa-192x192.png' },
    { url: '/pwa-512x512.png', zipPath: 'public/pwa-512x512.png' },
    { url: '/pwa-maskable-512x512.png', zipPath: 'public/pwa-maskable-512x512.png' },
    { url: '/play-store/feature-graphic-1024x500.png', zipPath: 'public/play-store/feature-graphic-1024x500.png' },
    { url: '/play-store/screenshot-1-dashboard.png', zipPath: 'public/play-store/screenshot-1-dashboard.png' },
    { url: '/play-store/screenshot-2-editor.png', zipPath: 'public/play-store/screenshot-2-editor.png' },
    { url: '/play-store/screenshot-3-certificate.png', zipPath: 'public/play-store/screenshot-3-certificate.png' },
  ];

  await Promise.all(
    assetsToFetch.map(async (item) => {
      const bytes = await fetchBinarySafe(item.url);
      if (bytes) {
        entries.push({ path: item.zipPath, data: bytes });
      }
    })
  );

  const zipBuffer = buildZipArchive(entries);
  triggerBlobDownload(zipBuffer, 'fullstack-academy-google-play-pack.zip', 'application/zip');
}

/**
 * Downloads an individual Play Store configuration/asset file via fetch + Blob,
 * bypassing Service Worker NavigationRoute so it never saves index.html by mistake.
 */
export async function downloadVerifiedAssetFile(
  url: string,
  filename: string,
  mimeType: string,
  fallbackText?: string
): Promise<void> {
  const bytes = await fetchBinarySafe(url);
  if (bytes) {
    triggerBlobDownload(bytes, filename, mimeType);
    return;
  }
  if (fallbackText) {
    const encoded = new TextEncoder().encode(fallbackText);
    triggerBlobDownload(encoded, filename, mimeType);
  }
}
