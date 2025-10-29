export type Lang = 'fr' | 'en' | 'pt' | 'ar' | 'es' | 'tr' | 'sw' | 'de' | 'it';

export type RouteKey =
  | 'home'
  | 'services'
  | 'destinations'
  | 'contact'
  | 'legal'
  | 'services_freight_maritime';

const SLUGS: Record<Lang, Record<RouteKey, string>> = {
  fr: {
    home: '',
    services: 'services',
    destinations: 'destinations',
    contact: 'contact',
    legal: 'mentions-legales',
    services_freight_maritime: 'services/fret-maritime',
  },
  en: {
    home: '',
    services: 'services',
    destinations: 'destinations',
    contact: 'contact',
    legal: 'legal-notice',
    services_freight_maritime: 'services/maritime-freight',
  },
  pt: {
    home: '',
    services: 'servicos',
    destinations: 'destinos',
    contact: 'contacto',
    legal: 'aviso-legal',
    services_freight_maritime: 'servicos/frete-maritimo',
  },
  // New languages use international slugs (English) by default
  ar: {
    home: '',
    services: 'services',
    destinations: 'destinations',
    contact: 'contact',
    legal: 'legal',
    services_freight_maritime: 'services/maritime-freight',
  },
  es: {
    home: '',
    services: 'services',
    destinations: 'destinations',
    contact: 'contact',
    legal: 'legal',
    services_freight_maritime: 'services/maritime-freight',
  },
  tr: {
    home: '',
    services: 'services',
    destinations: 'destinations',
    contact: 'contact',
    legal: 'legal',
    services_freight_maritime: 'services/maritime-freight',
  },
  sw: {
    home: '',
    services: 'services',
    destinations: 'destinations',
    contact: 'contact',
    legal: 'legal',
    services_freight_maritime: 'services/maritime-freight',
  },
  de: {
    home: '',
    services: 'services',
    destinations: 'destinations',
    contact: 'contact',
    legal: 'legal',
    services_freight_maritime: 'services/maritime-freight',
  },
  it: {
    home: '',
    services: 'services',
    destinations: 'destinations',
    contact: 'contact',
    legal: 'legal',
    services_freight_maritime: 'services/maritime-freight',
  },
};

// Alias sets for slug recognition
const SERVICE_ALIASES = new Set([
  'services', 'servicos', 'servicios', 'hizmetler', 'servizi', 'leistungen', 'huduma', 'خدمات'
]);
const DEST_ALIASES = new Set([
  'destinations', 'destinos', 'destinazioni', 'ziele', 'destinasyonlar', 'vituo', 'وجهات'
]);
const CONTACT_ALIASES = new Set([
  'contact', 'contacto', 'kontakt', 'contatti', 'iletisim', 'mawasiliano', 'اتصال'
]);
const LEGAL_ALIASES = new Set([
  'legal', 'mentions-legales', 'legal-notice', 'aviso-legal', 'impressum', 'note-legali', 'yasal-uyari', 'إشعار-قانوني'
]);
const FREIGHT_ALIASES = new Set([
  'services/fret-maritime',
  'servicos/frete-maritimo',
  'services/maritime-freight',
  'servicios/transporte-maritimo',
  'hizmetler/deniz-tasimaciligi',
  'servizi/trasporto-marittimo',
  'leistungen/seefracht',
  'huduma/usafirishaji-wa-baharini',
  'خدمات/الشحن-البحري'
]);

function stripBase(pathname: string): string {
  const base = (import.meta.env?.BASE_URL as string) || '/';
  const normBase = base.endsWith('/') ? base : base + '/';
  if (normBase !== '/' && pathname.startsWith(normBase)) {
    // Keep leading slash for downstream logic
    return pathname.slice(normBase.length - 1);
  }
  return pathname;
}

export function detectLangFromPath(pathname: string): Lang {
  const p = stripBase(pathname);
  const seg = p.split('/').filter(Boolean)[0];
  if (['fr','en','pt','ar','es','tr','sw','de','it'].includes(seg || '')) return seg as Lang;
  return 'fr';
}

export function keyFromPath(pathname: string): RouteKey {
  const p = stripBase(pathname);
  const parts = p.split('/').filter(Boolean);
  // drop language segment if present
  if (['fr','en','pt','ar','es','tr','sw','de','it'].includes(parts[0])) {
    parts.shift();
  }
  const rest = parts.join('/');

  if (rest === '' || rest === '/') return 'home';

  if (SERVICE_ALIASES.has(rest)) return 'services';
  if (DEST_ALIASES.has(rest)) return 'destinations';
  if (CONTACT_ALIASES.has(rest)) return 'contact';
  if (LEGAL_ALIASES.has(rest)) return 'legal';
  if (FREIGHT_ALIASES.has(rest)) return 'services_freight_maritime';

  // default to home
  return 'home';
}

export function pathForLang(key: RouteKey, lang: Lang): string {
  const slug = SLUGS[lang][key];
  return `/${lang}${slug ? `/${slug}` : ''}`;
}

/**
 * Transform a generic "to" value into the localized path.
 * Accepts:
 * - '' | '/' | 'services' | 'destinations' | 'contact' | 'legal'
 * - nested: 'services/fret-maritime'
 */
export function localizeTo(to: string, lang: Lang): string {
  const normalized = to.replace(/^\/*/, ''); // remove leading slash
  const key = keyFromPath(`/${lang}/${normalized}`);
  return pathForLang(key, lang);
}