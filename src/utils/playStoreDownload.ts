import { buildZipArchive, isNotHtmlFallback, isValidZipBuffer, type ZipEntryInput } from './zipBuilder';

const SHA256_FINGERPRINT =
  'A6:5D:54:DB:3F:7C:C1:DF:CF:E4:45:1D:26:21:41:15:B8:49:58:D4:D2:D8:93:9D:AF:81:34:4F:81:23:86:23';
const PRODUCTION_HOST = 'fsda-phi.vercel.app';

const EXPO_PACKAGE_JSON = JSON.stringify(
  {
    name: 'fullstack-academy-expo',
    version: '2.0.0',
    private: true,
    main: 'App.tsx',
    scripts: {
      start: 'expo start',
      android: 'expo start --android',
      ios: 'expo start --ios',
      web: 'expo start --web',
      'build:apk': 'eas build -p android --profile preview',
      'build:aab': 'eas build -p android --profile production',
      'build:ios-preview': 'eas build -p ios --profile preview',
      'build:ios': 'eas build -p ios --profile production',
      'submit:ios': 'eas submit -p ios --profile production',
    },
    dependencies: {
      expo: '~54.0.0',
      'expo-asset': '~12.0.14',
      'expo-constants': '~18.0.14',
      'expo-status-bar': '~3.0.9',
      react: '19.1.0',
      'react-native': '0.81.5',
      'react-native-safe-area-context': '~5.6.0',
      'react-native-webview': '13.15.0',
    },
    devDependencies: {
      '@babel/core': '^7.25.2',
      '@types/react': '~19.1.10',
      typescript: '~5.9.2',
    },
  },
  null,
  2
);

const EXPO_APP_JSON = JSON.stringify(
  {
    expo: {
      name: 'Full Stack Academy',
      slug: 'fullstack-academy',
      version: '2.0.0',
      orientation: 'portrait',
      icon: './assets/icon.png',
      userInterfaceStyle: 'dark',
      newArchEnabled: false,
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#020617',
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.fullstackacademy.app',
        buildNumber: '3',
        infoPlist: {
          ITSAppUsesNonExemptEncryption: false,
        },
      },
      android: {
        package: 'com.fullstackacademy.app',
        versionCode: 3,
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: '#020617',
        },
        permissions: ['INTERNET', 'ACCESS_NETWORK_STATE'],
      },
      plugins: ['./plugins/withFmtConstevalFix.js'],
      extra: {
        appUrl: `https://${PRODUCTION_HOST}`,
      },
    },
  },
  null,
  2
);

const EXPO_FMT_PLUGIN_JS = `const fs = require('fs');
const path = require('path');

let withDangerousMod;
try {
  ({ withDangerousMod } = require('expo/config-plugins'));
} catch {
  ({ withDangerousMod } = require('@expo/config-plugins'));
}

module.exports = function withFmtConstevalFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfilePath)) return cfg;
      let podfile = fs.readFileSync(podfilePath, 'utf8');
      if (podfile.includes('FMT_USE_CONSTEVAL')) return cfg;
      const rubyPatch = \`
    # [Xcode 26 Fix] Disable consteval in fmt C++ library for Apple Clang 17+
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_config|
        defs = build_config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] || ['$(inherited)']
        defs = [defs] if defs.is_a?(String)
        defs << 'FMT_USE_CONSTEVAL=0' unless defs.include?('FMT_USE_CONSTEVAL=0')
        build_config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = defs

        cpp_flags = build_config.build_settings['OTHER_CPLUSPLUSFLAGS'] || ['$(inherited)']
        cpp_flags = [cpp_flags] if cpp_flags.is_a?(String)
        cpp_flags << '-DFMT_USE_CONSTEVAL=0' unless cpp_flags.include?('-DFMT_USE_CONSTEVAL=0')
        build_config.build_settings['OTHER_CPLUSPLUSFLAGS'] = cpp_flags
      end
    end

    ['Pods/fmt/include/fmt/core.h', 'Pods/fmt/include/fmt/base.h'].each do |rel_header|
      header_path = File.join(__dir__, rel_header)
      if File.exist?(header_path)
        File.chmod(0644, header_path)
        src = File.read(header_path)
        patched = src.gsub(/#define\\\\s+FMT_USE_CONSTEVAL\\\\s+1/, '#define FMT_USE_CONSTEVAL 0')
        File.write(header_path, patched) if src != patched
      end
    end
\`;
      if (podfile.includes('post_install do |installer|')) {
        podfile = podfile.replace('post_install do |installer|', \`post_install do |installer|\${rubyPatch}\`);
      } else {
        podfile += \`\\npost_install do |installer|\${rubyPatch}\\nend\\n\`;
      }
      fs.writeFileSync(podfilePath, podfile, 'utf8');
      return cfg;
    },
  ]);
};
`;

const EXPO_EAS_JSON = JSON.stringify(
  {
    cli: {
      version: '>= 12.0.0',
      appVersionSource: 'local',
    },
    build: {
      development: {
        developmentClient: true,
        distribution: 'internal',
        android: { buildType: 'apk' },
      },
      preview: {
        distribution: 'internal',
        android: { buildType: 'apk' },
        ios: { image: 'latest' },
      },
      production: {
        android: { buildType: 'app-bundle' },
        ios: { image: 'latest' },
      },
    },
    submit: {
      production: {},
    },
  },
  null,
  2
);

const EXPO_APP_TSX = `import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { registerRootComponent } from 'expo';
import { WebView } from 'react-native-webview';

const ACADEMY_URL = 'https://${PRODUCTION_HOST}';

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      {hasError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Brak połączenia z Internetem</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setHasError(false);
              setIsLoading(true);
              webViewRef.current?.reload();
            }}
          >
            <Text style={styles.retryButtonText}>Spróbuj ponownie</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.webviewWrapper}>
          <WebView
            ref={webViewRef}
            source={{ uri: ACADEMY_URL }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            onNavigationStateChange={(nav) => setCanGoBack(nav.canGoBack)}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Uruchamianie Full Stack Academy...</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  webviewWrapper: { flex: 1, backgroundColor: '#020617' },
  webview: { flex: 1, backgroundColor: '#020617' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { marginTop: 14, color: '#cbd5e1', fontSize: 13, fontWeight: '600' },
  errorContainer: { flex: 1, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center', padding: 28 },
  errorTitle: { color: '#ffffff', fontSize: 18, fontWeight: '800', marginBottom: 16 },
  retryButton: { backgroundColor: '#4f46e5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  retryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
});

registerRootComponent(App);
`;

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
     https://${PRODUCTION_HOST}
2. W menu Chrome (⋮) wybierz "Zainstaluj aplikację".

------------------------------------------------------------------------
SPOSÓB 3 — ANDROID STUDIO / GRADLE (FOLDER android/):
1. Otwórz folder "android" w Android Studio lub uruchom:
     cd android && gradle bundleRelease assembleRelease
2. Dane klucza podpisu (android.keystore):
   - Alias: android
   - Hasło: fullstack2026
   - SHA-256: ${SHA256_FINGERPRINT}
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
 * Downloads the dedicated Expo (React Native + EAS Build) project as a verified .zip archive
 * so the user can build a signed .apk or .aab in Expo Cloud without installing Android Studio.
 */
export async function downloadVerifiedExpoZip(): Promise<void> {
  const staticExpoZip = await fetchBinarySafe('/fullstack-academy-expo-apk.zip');
  if (staticExpoZip && isValidZipBuffer(staticExpoZip)) {
    triggerBlobDownload(staticExpoZip, 'fullstack-academy-expo-apk.zip', 'application/zip');
    return;
  }

  const gitignoreContent = `node_modules/\n.expo/\ndist/\nweb-build/\n*.jks\n*.p8\n*.p12\n*.key\n*.mobileprovision\n.DS_Store\n`;
  const easignoreContent = `node_modules/\n.expo/\ndist/\nweb-build/\n.git/\n/ios\n/android\n`;

  const entries: ZipEntryInput[] = [
    { path: 'expo-mobile-app/.gitignore', data: gitignoreContent },
    { path: 'expo-mobile-app/.easignore', data: easignoreContent },
    { path: 'expo-mobile-app/INSTRUKCJA_EXPO_APK.md', data: QUICK_START_TXT },
    { path: 'expo-mobile-app/package.json', data: EXPO_PACKAGE_JSON },
    { path: 'expo-mobile-app/app.json', data: EXPO_APP_JSON },
    { path: 'expo-mobile-app/eas.json', data: EXPO_EAS_JSON },
    { path: 'expo-mobile-app/App.tsx', data: EXPO_APP_TSX },
    { path: 'expo-mobile-app/plugins/withFmtConstevalFix.js', data: EXPO_FMT_PLUGIN_JS },
    {
      path: 'expo-mobile-app/tsconfig.json',
      data: `{\n  "extends": "expo/tsconfig.base",\n  "compilerOptions": { "strict": true }\n}\n`,
    },
  ];

  const icon512 = await fetchBinarySafe('/pwa-512x512.png');
  const maskable512 = await fetchBinarySafe('/pwa-maskable-512x512.png');
  if (icon512) {
    entries.push({ path: 'expo-mobile-app/assets/icon.png', data: icon512 });
    entries.push({ path: 'expo-mobile-app/assets/splash.png', data: icon512 });
  }
  if (maskable512) {
    entries.push({ path: 'expo-mobile-app/assets/adaptive-icon.png', data: maskable512 });
  }

  const zipBuffer = buildZipArchive(entries);
  triggerBlobDownload(zipBuffer, 'fullstack-academy-expo-apk.zip', 'application/zip');
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

  const gitignoreContent = `node_modules/\n.expo/\ndist/\nweb-build/\n*.jks\n*.p8\n*.p12\n*.key\n*.mobileprovision\n.DS_Store\n`;
  const easignoreContent = `node_modules/\n.expo/\ndist/\nweb-build/\n.git/\n/ios\n/android\n`;

  const entries: ZipEntryInput[] = [
    { path: 'INSTRUKCJA_SZYBKI_START.txt', data: QUICK_START_TXT },
    { path: 'expo-mobile-app/.gitignore', data: gitignoreContent },
    { path: 'expo-mobile-app/.easignore', data: easignoreContent },
    { path: 'expo-mobile-app/package.json', data: EXPO_PACKAGE_JSON },
    { path: 'expo-mobile-app/app.json', data: EXPO_APP_JSON },
    { path: 'expo-mobile-app/eas.json', data: EXPO_EAS_JSON },
    { path: 'expo-mobile-app/App.tsx', data: EXPO_APP_TSX },
    { path: 'expo-mobile-app/plugins/withFmtConstevalFix.js', data: EXPO_FMT_PLUGIN_JS },
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
    { url: '/pwa-512x512.png', zipPath: 'expo-mobile-app/assets/icon.png' },
    { url: '/pwa-512x512.png', zipPath: 'expo-mobile-app/assets/splash.png' },
    { url: '/pwa-maskable-512x512.png', zipPath: 'public/pwa-maskable-512x512.png' },
    { url: '/pwa-maskable-512x512.png', zipPath: 'expo-mobile-app/assets/adaptive-icon.png' },
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
