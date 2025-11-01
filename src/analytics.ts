// Lightweight Google Analytics (GA4) integration with DNT and anonymization.
// Configure via VITE_GA_ID=G-XXXXXXXXXX
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function shouldTrack(): boolean {
  try {
    // Respect Do Not Track
    // Possible values: '1' | 'yes'
    const dnt = (navigator as any).doNotTrack || (window as any).doNotTrack || (navigator as any).msDoNotTrack;
    if (dnt === '1' || dnt === 'yes') return false;
  } catch {
    // ignore
  }
  return true;
}

export function initAnalytics() {
  const id = import.meta.env?.VITE_GA_ID as string | undefined;
  if (!id) return; // not configured
  if (!shouldTrack()) return;

  // Inject gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', id, {
    anonymize_ip: true,
    page_path: location.pathname + location.search + location.hash,
  });
}

export function trackPageview(path: string, title?: string) {
  const id = import.meta.env?.VITE_GA_ID as string | undefined;
  if (!id || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}