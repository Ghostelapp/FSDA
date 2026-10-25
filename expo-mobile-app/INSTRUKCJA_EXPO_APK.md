# Generowanie pliku .APK oraz .AAB przez Expo (EAS Build w chmurze)

Dzięki skonfigurowanemu projektowi **Expo (React Native + EAS Build)** nie musisz instalować na komputerze programu Android Studio, Java JDK 17 ani Android SDK. Cała kompilacja pliku **`.apk`** (do bezpośredniej instalacji na telefonie) oraz **`.aab`** (do sklepu Google Play) odbywa się na serwerach chmurowych Expo!

---

## Krok po kroku (3 polecenia w terminalu):

### 1. Rozpakuj pobrane archiwum `fullstack-academy-expo-apk.zip` i wejdź do folderu:
```bash
cd expo-mobile-app
npm install
```

### 2. Zaloguj się na darmowe konto Expo (jeśli jeszcze nie masz, założysz je na https://expo.dev):
```bash
npx eas-cli login
```

### 3. Wygeneruj plik `.APK` (do bezpośredniej instalacji na telefonie Android):
```bash
npx eas-cli build -p android --profile preview
```
- Podczas pierwszego uruchomienia `eas-cli` zapyta:
  - `Would you like to automatically create an EAS project?` -> wybierz **Y (Tak)**
  - `Generate a new Android Keystore?` -> wybierz **Y (Tak)** (lub zaimportuj dołączony klucz `android.keystore`)
- Po około 3–5 minutach w terminalu pojawi się **bezpośredni link do pobrania pliku `.apk`** oraz **kod QR**, który możesz zeskanować aparatem w telefonie i od razu zainstalować aplikację!

---

## Jak wygenerować plik `.AAB` do sklepu Google Play Console?

Gdy będziesz chciał wgrać paczkę do **Google Play Console** (sekcja *Produkcja*), uruchom profil produkcyjny:
```bash
npx eas-cli build -p android --profile production
```
To polecenie wygeneruje podpisany plik **`.aab` (Android App Bundle)** zgodny z wymogami Google Play Store.
