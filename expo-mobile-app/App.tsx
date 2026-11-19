import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
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

const ACADEMY_URL = 'https://fsda.tech';
const MOBILE_BROWSER_UA =
  Platform.OS === 'android'
    ? 'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 FullStackAcademyExpo/3.0.0'
    : 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1 FullStackAcademyExpo/3.0.0';

const ALLOWED_IN_APP_HOSTS = [
  'fsda.tech',
  'www.fsda.tech',
  'accounts.google.com',
  'apis.google.com',
  'fsda-1d673.firebaseapp.com',
];

function shouldKeepInWebView(url: string): boolean {
  if (!url) return true;
  if (url.startsWith('about:') || url.startsWith('blob:') || url.startsWith('data:')) {
    return true;
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false;
    }
    return ALLOWED_IN_APP_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return true;
  }
}

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Obsługa fizycznego przycisku "Wstecz" w systemie Android (na iOS działa gest przesunięcia krawędzi)
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [canGoBack]);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    webViewRef.current?.reload();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {hasError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorBadge}>TRYB OFFLINE</Text>
          <Text style={styles.errorTitle}>Brak połączenia z serwerem Akademii</Text>
          <Text style={styles.errorDesc}>
            Sprawdź połączenie z Internetem na swoim urządzeniu i spróbuj ponownie.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
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
            thirdPartyCookiesEnabled={true}
            sharedCookiesEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            startInLoadingState={true}
            allowsBackForwardNavigationGestures={true}
            contentInsetAdjustmentBehavior="automatic"
            pullToRefreshEnabled={true}
            userAgent={MOBILE_BROWSER_UA}
            applicationNameForUserAgent="FullStackAcademyExpo/3.0.0"
            onShouldStartLoadWithRequest={(request) => {
              if (shouldKeepInWebView(request.url)) {
                return true;
              }
              Linking.openURL(request.url).catch(() => {});
              return false;
            }}
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack);
            }}
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
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  webviewWrapper: {
    flex: 1,
    backgroundColor: '#020617',
  },
  webview: {
    flex: 1,
    backgroundColor: '#020617',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 14,
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  errorBadge: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDesc: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});

registerRootComponent(App);
