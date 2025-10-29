import { getSiteUrl } from './siteUrl';
import { detectLangFromPath, keyFromPath, pathForLang, type Lang } from './paths';

export const DEFAULT_SITE_NAME = 'MB Fret Services';
export const DEFAULT_OG_IMAGE =
  'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=1600';

export const SUP_LANGS: Lang[] = ['fr', 'en', 'pt', 'ar', 'es', 'tr', 'sw', 'de', 'it'];

export const OG_LOCALE_MAP: Record<Lang, string> = {
  fr: 'fr_FR',
  en: 'en_GB',
  pt: 'pt_PT',
  ar: 'ar_AR',
  es: 'es_ES',
  tr: 'tr_TR',
  sw: 'sw_KE',
  de: 'de_DE',
  it: 'it_IT',
};

export function getCurrentLangFromPath(): Lang {
  if (typeof window === 'undefined') return 'fr';
  return detectLangFromPath(window.location.pathname);
}

export function buildAlternateLinks(): { href: string; hrefLang: string }[] {
  if (typeof window === 'undefined') return [];
  const site = getSiteUrl();
  const key = keyFromPath(window.location.pathname);

  const hreflangMap: Record<Lang, string> = {
    fr: 'fr-FR',
    en: 'en-GB',
    pt: 'pt-PT',
    ar: 'ar',
    es: 'es-ES',
    tr: 'tr-TR',
    sw: 'sw-KE',
    de: 'de-DE',
    it: 'it-IT',
  };

  const alternates = SUP_LANGS.map((lng) => {
    const href = new URL(pathForLang(key, lng), site).href.replace(/\/$/, '');
    const hrefLang = hreflangMap[lng];
    return { href, hrefLang };
  });

  const regional: Array<{ href: string; hrefLang: string }> = [];
  for (const lng of SUP_LANGS) {
    const baseHref = new URL(pathForLang(key, lng), site).href.replace(/\/$/, '');
    if (lng === 'fr') {
      ['fr-CI','fr-CM','fr-CD','fr-SN','fr-GA','fr-BJ','fr-TG','fr-FR'].forEach((code) => regional.push({ href: baseHref, hrefLang: code }));
    } else if (lng === 'en') {
      ['en-GB','en-US','en-NG','en-GH','en-KE','en-ZA','en-UG','en-RW','en-TZ'].forEach((code) => regional.push({ href: baseHref, hrefLang: code }));
    } else if (lng === 'pt') {
      ['pt-PT','pt-AO','pt-MZ','pt-BR'].forEach((code) => regional.push({ href: baseHref, hrefLang: code }));
    } else if (lng === 'es') {
      ['es-ES','es-MX','es-CL','es-AR','es-CO','es-PE'].forEach((code) => regional.push({ href: baseHref, hrefLang: code }));
    } else if (lng === 'ar') {
      ['ar','ar-MA','ar-DZ','ar-TN','ar-EG','ar-SA','ar-AE'].forEach((code) => regional.push({ href: baseHref, hrefLang: code }));
    } else if (lng === 'tr') {
      ['tr-TR'].forEach((code) => regional.push({ href: baseHref, hrefLang: code }));
    } else if (lng === 'sw') {
      ['sw-KE','sw-TZ'].forEach((code) => regional.push({ href: baseHref, hrefLang: code }));
    } else if (lng === 'de') {
      ['de-DE','de-AT','de-CH'].forEach((code) => regional.push({ href: baseHref, hrefLang: code }));
    } else if (lng === 'it') {
      ['it-IT','it-CH'].forEach((code) => regional.push({ href: baseHref, hrefLang: code }));
    }
  }

  return [...alternates, ...regional];
}