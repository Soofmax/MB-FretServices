import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import './i18n';
import { initAnalytics } from './analytics';

// GitHub Pages SPA fallback support:
// If the 404.html redirected to "/?p=/xxx", normalize back to "/xxx" before the app mounts.
try {
  const params = new URLSearchParams(window.location.search);
  const p = params.get('p');
  if (p) {
    const target = p + window.location.hash;
    window.history.replaceState(null, '', target);
  }
} catch {
  // ignore
}

// Initialize analytics (noop if VITE_GA_ID not set or DNT on)
try {
  initAnalytics();
} catch {
  // ignore
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
