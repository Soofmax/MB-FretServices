export function getSiteUrl(): string {
  const fromEnv = import.meta.env?.VITE_SITE_URL as string | undefined;
  if (fromEnv) {
    return fromEnv.endsWith('/') ? fromEnv : fromEnv + '/';
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin;
    const base = (import.meta.env?.BASE_URL as string) || '/';
    // Ensure trailing slash
    return new URL(base, origin).href;
  }
  // Fallback sensible for non-browser environments
  return 'https://mb-fretservices.com/';
}