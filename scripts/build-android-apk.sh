#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  Full Stack Academy — Przygotowanie APK pod Sklep Play   "
echo "=========================================================="

# 1. Sprawdzenie i budowa frontendu
echo "[1/4] Budowanie aplikacji produkcyjnej (npm run build)..."
npm run build

# 2. Sprawdzenie zasobów Androida
echo "[2/4] Weryfikacja plików PWA i Android TWA..."
test -f public/pwa-192x192.png || { echo "Błąd: Brak public/pwa-192x192.png"; exit 1; }
test -f public/pwa-512x512.png || { echo "Błąd: Brak public/pwa-512x512.png"; exit 1; }
test -f public/pwa-maskable-512x512.png || { echo "Błąd: Brak public/pwa-maskable-512x512.png"; exit 1; }
test -f public/.well-known/assetlinks.json || { echo "Błąd: Brak public/.well-known/assetlinks.json"; exit 1; }
test -f twa-manifest.json || { echo "Błąd: Brak twa-manifest.json"; exit 1; }

echo "Pliki konfiguracyjne TWA i manifest są poprawne."

# 3. Informacja o generowaniu pakietu AAB / APK
echo "[3/4] Aby wygenerować plik .aab / .apk za pomocą oficjalnego narzędzia Google Bubblewrap:"
echo ""
echo "  npx @bubblewrap/cli build"
echo ""
echo "Wymagania systemowe do zbudowania pliku .aab/.apk:"
echo "  - Java JDK 17 lub nowszy (dostępne polecenie: keytool, javac)"
echo "  - Android SDK (lub Android Studio)"
echo ""
echo "[4/4] Alternatywnie w Android Studio:"
echo "  1. Otwórz katalog 'android' w Android Studio."
echo "  2. Wybierz Build -> Generate Signed Bundle / APK."
echo "  3. Wybierz Android App Bundle (.aab)."
echo "  4. Wgraj wygenerowany plik do konsoli Google Play Console!"
echo "=========================================================="
