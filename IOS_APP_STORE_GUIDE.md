# Full Stack Academy — Przewodnik Publikacji w Apple App Store (iOS / iPadOS)

Kompletny pakiet konfiguracji iOS dla aplikacji **Full Stack Academy** (`com.fullstackacademy.app`, wersja `3.0.0`, `buildNumber: "4"`, domena produkcyjna `https://fsda.tech`).

---

## 1. Co zostało przygotowane automatycznie w repozytorium?

1. **Projekt Expo SDK 54 + React Native WebView (`expo-mobile-app/`)**:
   - `app.json` zawiera:
     - `bundleIdentifier`: `com.fullstackacademy.app`
     - `buildNumber`: `"4"` (`version: "3.0.0"`)
     - `supportsTablet`: `true` (iPhone oraz iPad)
     - `icon`: `./assets/ios-icon-1024x1024.png` (1024×1024 px, bez kanału przezroczystości — wymagane przez App Store Connect)
     - `associatedDomains`: `["applinks:fsda.tech", "webcredentials:fsda.tech"]`
     - `infoPlist.ITSAppUsesNonExemptEncryption`: `false` (brak dodatkowych formularzy kryptograficznych przy publikacji w TestFlight)
     - `privacyManifests` (`PrivacyInfo.xcprivacy`): deklaracja `NSPrivacyTracking: false` oraz `NSPrivacyAccessedAPICategoryUserDefaults` (`CA92.1`), wymagana przez Apple od 2024 roku.
   - `plugins/withFmtConstevalFix.js` — poprawka Podfile dla Xcode 16 / Xcode 26 (`FMT_USE_CONSTEVAL=0`).
   - `App.tsx` — natywny kontener `WKWebView` z obsługą gestów wstecz/dalej (`allowsBackForwardNavigationGestures`), `contentInsetAdjustmentBehavior="automatic"`, płynnym odświeżaniem, obsługą trybu offline i zewnętrznych linków.
2. **Apple Universal Links (`public/.well-known/apple-app-site-association`)**:
   - Skonfigurowany plik AASA + nagłówek `Content-Type: application/json` w `vercel.json`.
   - Przed publikacją podmień `YOUR_APPLE_TEAM_ID` na swój 10-znakowy Team ID z [Apple Developer Portal](https://developer.apple.com/account).
3. **Zasoby App Store Connect (`public/app-store/`)**:
   - `karta-app-store.json` — opisy PL/EN, słowa kluczowe (≤100 znaków), podtytuł (≤30 znaków), URL prywatności i wsparcia.
   - `app-store-icon-1024x1024.png` — nieprzezroczysta ikona 1024×1024 px.
   - 3 prawdziwe zrzuty ekranu iPhone 6.7" (`1290×2796` px) gotowe do wgrania w App Store Connect.
4. **Automatyczny workflow GitHub Actions (`.github/workflows/ios-app-store-publish.yml`)**:
   - Generuje projekt Xcode na `macos-latest` (`npx expo prebuild --platform ios --clean`), instaluje CocoaPods i wykonuje weryfikację / archiwizację.

---

## 2. Sposób 1 (Najszybszy — bez komputera Mac): Expo EAS Cloud Build -> TestFlight / App Store

Expo EAS kompiluje podpisany plik **`.ipa`** na serwerach Apple/Expo w chmurze — nie potrzebujesz lokalnego macOS ani Xcode!

> **Wymagania:** płatne konto Apple Developer Program ($99/rok) do wygenerowania podpisanego `.ipa` dla TestFlight / App Store (lub darmowe konto Expo do buildu na symulator iOS).

```bash
# 1. Wejdź do folderu expo-mobile-app (lub wypakuj fullstack-academy-ios-app-pack.zip)
cd expo-mobile-app
npm install

# 2. Zaloguj się do konta Expo (https://expo.dev)
npx eas-cli login

# 3a. Opcjonalnie — build do testów na Symulatorze iOS (bez płatnego Apple Developer):
npm run build:ios-sim

# 3b. Wygeneruj podpisany plik .IPA gotowy do TestFlight i App Store Connect:
npx eas-cli build -p ios --profile production

# 4. Wyślij zbudowane .IPA bezpośrednio do App Store Connect (TestFlight):
npx eas-cli submit -p ios --profile production
```

Podczas pierwszego uruchomienia `eas build -p ios --profile production` narzędzie EAS zapyta o login Apple ID i automatycznie wygeneruje certyfikat dystrybucyjny oraz profil `Distribution Provisioning Profile`.

---

## 3. Sposób 2 (Lokalnie na macOS + Xcode)

Jeśli posiadasz komputer Mac z zainstalowanym Xcode 16+ i CocoaPods:

```bash
cd expo-mobile-app
npm install

# Wygeneruj natywny projekt Xcode (folder ios/) z zastosowaniem withFmtConstevalFix.js
npx expo prebuild --platform ios --clean

# Zainstaluj zależności CocoaPods
cd ios && pod install && cd ..

# Otwórz projekt w Xcode: Product -> Archive -> Distribute App
open ios/FullStackAcademy.xcworkspace
```

---

## 4. Publikacja w App Store Connect — lista kontrolna

1. W [App Store Connect](https://appstoreconnect.apple.com) utwórz nową aplikację z Bundle ID **`com.fullstackacademy.app`**.
2. Skopiuj swój **Apple Team ID** (np. `A1B2C3D4E5`) i podmień `YOUR_APPLE_TEAM_ID` w `public/.well-known/apple-app-site-association`.
3. Wgraj zbudowany plik `.ipa` przez `eas submit -p ios` lub aplikację Apple **Transporter**.
4. W karcie aplikacji uzupełnij teksty z `public/app-store/karta-app-store.json` oraz wgraj zrzuty ekranu z `public/app-store/iphone-67-*.png` i ikonę `app-store-icon-1024x1024.png`.
5. Jako URL Polityki Prywatności wpisz: `https://fsda.tech/privacy-policy.html`.
6. Pamiętaj o **App Review Notes**: aplikacja loguje użytkownika przez Firebase Auth (Google / E-mail) — w formularzu App Review w App Store Connect podaj testowe dane logowania e-mail, aby recenzent Apple mógł przetestować chronione lekcje bez konta Google.
