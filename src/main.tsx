import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for PWA and Android TWA offline support
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    void updateSW(true);
  },
  onOfflineReady() {
    console.log('Aplikacja Full Stack Academy jest gotowa do pracy w trybie offline.');
  },
});

const rootEl = document.getElementById('root')!;

const clearBootState = () => {
  const win = window as Window & { __fsdaBootTimer?: number };
  if (win.__fsdaBootTimer !== undefined) {
    window.clearTimeout(win.__fsdaBootTimer);
    win.__fsdaBootTimer = undefined;
  }
  document.documentElement.classList.remove('fsda-js-booting');
};

if (typeof MutationObserver !== 'undefined') {
  const bootObserver = new MutationObserver(() => {
    if (!rootEl.querySelector('.fsda-seo-fallback')) {
      bootObserver.disconnect();
      clearBootState();
    }
  });
  bootObserver.observe(rootEl, { childList: true });
}

createRoot(rootEl).render(<App />);

window.requestAnimationFrame(() => {
  if (!rootEl.querySelector('.fsda-seo-fallback')) {
    clearBootState();
  }
});

