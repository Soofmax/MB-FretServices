import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Languages supported
export const SUPPORTED_LANGS = ['fr', 'en', 'pt', 'ar', 'es', 'tr', 'sw', 'de', 'it'] as const;
export type SupportedLang = typeof SUPPORTED_LANGS[number];

// Compute absolute load path for locales that respects Vite BASE_URL and current origin.
// This avoids 404s on GitHub Pages when the site is served under a subpath (e.g. /repo/).
const BASE = (import.meta.env?.BASE_URL as string) || '/';
const ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';
const ABS_BASE = ORIGIN ? new URL(BASE, ORIGIN).href : BASE;
const ABS_LOAD_PATH =
  (ABS_BASE.endsWith('/') ? ABS_BASE : ABS_BASE + '/') +
  'locales/{{lng}}/{{ns}}.json';

// Path language detection index should account for BASE_URL segments.
// e.g. BASE_URL='/repo/' -> first meaningful segment is at index 1.
const BASE_SEGS = (BASE || '/').split('/').filter(Boolean).length;

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    fallbackLng: 'fr',
    // Load namespaces from /public/locales/{{lng}}/{{ns}}.json
    backend: {
      loadPath: ABS_LOAD_PATH,
    },
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
    ns: ['common', 'navbar', 'hero', 'footer', 'home', 'services', 'destinations', 'contact', 'legal', 'freight', 'notFound'],
    detection: {
      order: ['path', 'navigator', 'htmlTag', 'cookie', 'localStorage'],
      caches: ['localStorage'],
      lookupFromPathIndex: BASE_SEGS, // shift by base segments if any
    },
    returnNull: false,
  });

export default i18n;