# Przewodnik: Publikacja aplikacji Full Stack Academy w Google Play Store (APK / AAB)

Ten dokument opisuje krok po kroku proces wygenerowania pliku **.aab** (Android App Bundle) lub **.apk** oraz publikacji aplikacji w **Google Play Store**.

---

## 1. Architektura: Trusted Web Activity (TWA)
Aplikacja została przygotowana zgodnie z oficjalnym standardem Google dla aplikacji webowych publikowanych w Google Play — **Trusted Web Activity (TWA)**.

Główne zalety tego rozwiązania:
- **Pełnoekranowy tryb natywny**: brak paska adresu przeglądarki, obsługa gestów systemowych.
- **Automatyczne aktualizacje**: zmiany wdrażane na serwerze są natychmiast widoczne dla użytkowników w aplikacji mobilnej bez konieczności ponownego wydawania aktualizacji w Google Play.
- **Dostęp offline**: skonfigurowany Service Worker (`vite-plugin-pwa`) zapamiętuje zasoby statyczne i lekcje.
- **Minimalny rozmiar pobierania**: paczka APK zajmuje zaledwie kilkaset kilobajtów.

---

## 2. Przygotowane pliki w projekcie

| Plik | Funkcja |
|---|---|
| `twa-manifest.json` | Konfiguracja pakietu dla Google Bubblewrap CLI |
| `public/.well-known/assetlinks.json` | Weryfikacja powiązania domeny z aplikacją Android (usuwa pasek przeglądarki) |
| `public/pwa-192x192.png` | Ikona systemowa 192x192 px |
| `public/pwa-512x512.png` | Ikona wysokiej rozdzielczości 512x512 px pod Sklep Play |
| `public/pwa-maskable-512x512.png` | Ikona adaptacyjna z marginesem bezpieczeństwa (Android squircle/circle) |
| `android/` | Kompletny projekt Android Studio z `build.gradle` i `AndroidManifest.xml` |

---

## 3. Generowanie paczki .aab / .apk krok po kroku

### Metoda A: Narzędzie Google Bubblewrap CLI (Rekomendowane)

1. **Zbuduj aplikację webową**:
   ```bash
   npm run build
   ```

2. **Wygeneruj klucz prywatny (Keystore) do podpisu**:
   ```bash
   keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
   ```

3. **Zbuduj paczkę produkcyjną (.aab)**:
   ```bash
   npx @bubblewrap/cli build
   ```
   Wynikiem polecenia jest plik `app-release-bundle.aab` gotowy do wysłania w Google Play Console.

4. **Pobierz odcisk certyfikatu SHA-256 do pliku AssetLinks**:
   ```bash
   keytool -list -v -keystore android.keystore -alias android
   ```
   Skopiuj `SHA256: ...` i wklej do tablicy `sha256_cert_fingerprints` w pliku `public/.well-known/assetlinks.json`.

---

### Metoda B: Android Studio

1. Otwórz program **Android Studio**.
2. Wybierz **File** -> **Open** i wskaż katalog `android` z tego projektu.
3. Poczekaj na synchronizację projektu Gradle.
4. Przejdź do menu: **Build** -> **Generate Signed Bundle / APK**.
5. Zaznacz **Android App Bundle (.aab)** i kliknij **Next**.
6. Wskaż swój plik `.keystore` i hasło.
7. Wybierz wariant **release** i kliknij **Finish**.

---

## 4. Publikacja w Google Play Console

1. Zaloguj się na [Google Play Console](https://play.google.com/console).
2. Kliknij **Utwórz aplikację** (Create app):
   - **Nazwa aplikacji**: Full Stack Academy
   - **Domyślny język**: Polski (pl-PL)
   - **Typ**: Aplikacja (App)
   - **Darmowa / Płatna**: Bezpłatna
3. W sekcji **Wydanie** -> **Produkcja** wgraj wygenerowany plik `app-release-bundle.aab`.
4. Uzupełnij dane karty katalogowej w Sklepie Play:
   - Krótki opis (do 80 znaków)
   - Pełny opis
   - Zrzuty ekranu z telefonu (min. 2 zrzuty ekranu 16:9 lub 9:16)
   - Ikona 512x512 px (użyj `public/pwa-512x512.png`)
   - Grafika promocyjna 1024x500 px
5. Prześlij aplikację do weryfikacji przez zespół Google Play.

---

## 5. Bezpośrednia instalacja na telefonie (WebAPK)

Użytkownicy z telefonami Android mogą zainstalować aplikację bezpośrednio ze strony:
1. Wejdź na stronę w przeglądarce Chrome na telefonie.
2. Dotknij przycisku **„Pobierz Aplikację / Sklep Play”** w nawigacji lub menu bocznym.
3. Kliknij **„Zainstaluj teraz”**.
4. Chrome i system Android automatycznie tworzą natywną paczkę WebAPK z ikoną na pulpicie.
