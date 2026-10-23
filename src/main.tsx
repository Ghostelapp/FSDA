import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for PWA and Android TWA offline support
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nowa wersja aplikacji jest gotowa.');
  },
  onOfflineReady() {
    console.log('Aplikacja Full Stack Academy jest gotowa do pracy w trybie offline.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
