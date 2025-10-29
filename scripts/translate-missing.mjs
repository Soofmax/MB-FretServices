import fs from 'fs';
import path from 'path';
import url from 'url';

/**
 * Auto-traduit les clés manquantes depuis la langue source (fr) vers les langues cibles (en, pt).
 * Fournisseurs:
 *  - DeepL si DEEPL_API_KEY est défini (qualité élevée)
 *  - Sinon LibreTranslate (gratuit/public), avec backoff léger sur 429
 *
 * Améliorations vs version précédente:
 *  - Suppression complète de LingoDev
 *  - Cache local pour réutiliser les traductions (accélère fortement les runs suivants)
 *  - Concurrence contrôlée (I18N_CONCURRENCY) pour accélérer tout en restant raisonnable
 *
 * Usage:
 *   node scripts/translate-missing.mjs
 *
 * Env:
 *   DEEPL_API_KEY           (optionnel)
 *   DEEPL_API_URL           (optionnel, défaut https://api-free.deepl.com/v2/translate si DEEPL_API_KEY fourni)
 *   LIBRETRANSLATE_URL      (optionnel, défaut https://libretranslate.com/translate)
 *   I18N_TARGET_LANGS       (ex: "en,pt,es" — défaut "en,pt")
 *   I18N_CONCURRENCY        (ex: 3 — défaut 3)
 *   DRY_RUN=1               (ne pas écrire sur disque)
 */

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const LOCALES_ROOT = path.join(repoRoot, 'public', 'locales');
const CACHE_DIR = path.join(repoRoot, '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'i18n-cache.json');

const BASE_LANG = 'fr';
const TARGET_LANGS = (process.env.I18N_TARGET_LANGS
  ? process.env.I18N_TARGET_LANGS.split(',').map(s => s.trim()).filter(Boolean)
  : ['en', 'pt']);
const CONCURRENCY = Math.max(1, Number(process.env.I18N_CONCURRENCY || 3));

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
function writeJson(p, data) {
  const json = JSON.stringify(data, null, 2) + '\n';
  fs.writeFileSync(p, json, 'utf8');
}
function safeMkdir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function listNamespaces(lang) {
  const dir = path.join(LOCALES_ROOT, lang);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
}

function ensureDirsForTargets(namespaces) {
  for (const t of TARGET_LANGS) {
    const dir = path.join(LOCALES_ROOT, t);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    for (const ns of namespaces) {
      const p = path.join(dir, ns);
      if (!fs.existsSync(p)) fs.writeFileSync(p, '{}\n', 'utf8');
    }
  }
}

function isObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function* walkEntries(node, prefix = []) {
  if (typeof node === 'string') {
    yield { key: prefix.join('.'), value: node };
    return;
  }
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const v = node[i];
      if (typeof v === 'string') {
        yield { key: [...prefix, i].join('.'), value: v };
      } else if (isObject(v) || Array.isArray(v)) {
        yield* walkEntries(v, [...prefix, i]);
      }
    }
    return;
  }
  if (isObject(node)) {
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === 'string') {
        yield { key: [...prefix, k].join('.'), value: v };
      } else if (isObject(v) || Array.isArray(v)) {
        yield* walkEntries(v, [...prefix, k]);
      }
    }
  }
}

function getByPath(obj, pathStr) {
  const parts = pathStr.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function setByPath(obj, pathStr, value) {
  const parts = pathStr.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const isLast = i === parts.length - 1;
    if (isLast) {
      cur[p] = value;
      return;
    }
    if (!(p in cur)) {
      cur[p] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    }
    cur = cur[p];
  }
}

/* ---------- Provider selection ---------- */
const DEEPL_API_KEY = process.env.DEEPL_API_KEY || '';
const DEEPL_API_URL = process.env.DEEPL_API_URL || (DEEPL_API_KEY ? 'https://api-free.deepl.com/v2/translate' : '');
const LIBRE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com/translate';

function debugLogProvider() {
  const targets = TARGET_LANGS.join(', ');
  if (DEEPL_API_KEY) {
    console.log(`[i18n] Provider: DeepL (${DEEPL_API_URL}). Targets: ${targets}. Concurrency=${CONCURRENCY}`);
  } else {
    console.log(`[i18n] Provider: LibreTranslate (${LIBRE_URL}). Targets: ${targets}. Concurrency=${CONCURRENCY}`);
  }
}

// DeepL mapping (minimal)
function mapTargetForDeepL(lang) {
  switch (lang) {
    case 'en': return 'EN-GB';
    case 'pt': return 'PT-PT';
    case 'fr': return 'FR';
    case 'es': return 'ES';
    case 'de': return 'DE';
    case 'it': return 'IT';
    case 'tr': return 'TR';
    default: return (lang || '').toUpperCase();
  }
}

// LibreTranslate mapping (accepts 'en','pt','fr',...)
function mapForLibre(lang) {
  return lang;
}

/* ---------- Caching ---------- */
function loadCache() {
  try {
    return readJson(CACHE_FILE);
  } catch {
    return {};
  }
}
function saveCache(cache) {
  safeMkdir(CACHE_DIR);
  writeJson(CACHE_FILE, cache);
}
function cacheKey(text, source, target) {
  return `${source}::${target}::${text}`;
}

/* ---------- Providers ---------- */
async function translateWithDeepL(text, source, target) {
  // DeepL n'exige pas toujours source_lang. On privilégie target_lang.
  const params = new URLSearchParams();
  params.set('text', text);
  params.set('target_lang', mapTargetForDeepL(target));
  if (source) params.set('source_lang', mapTargetForDeepL(source).replace(/-.+$/, '')); // FR/EN/PT…
  const res = await fetch(DEEPL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  if (!res.ok) {
    throw new Error(`DeepL HTTP ${res.status}`);
  }
  const data = await res.json();
  const tr = data && data.translations && data.translations[0] && data.translations[0].text;
  return tr || '';
}

async function translateWithLibre(text, source, target) {
  const res = await fetch(LIBRE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      q: text,
      source: mapForLibre(source),
      target: mapForLibre(target),
      format: 'text',
    }),
  });
  if (!res.ok) {
    throw new Error(`LibreTranslate HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.translatedText || '';
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function translateWithLibreWithBackoff(text, source, target, retries = 2) {
  let attempt = 0;
  while (true) {
    try {
      return await translateWithLibre(text, source, target);
    } catch (e) {
      const msg = String(e && e.message ? e.message : e);
      const is429 = msg.includes('HTTP 429');
      if (is429 && attempt < retries) {
        const wait = 800 * (attempt + 1);
        console.warn(`LibreTranslate rate-limited (429). Retrying in ${wait}ms...`);
        await sleep(wait);
        attempt++;
        continue;
      }
      throw e;
    }
  }
}

/* ---------- High-level translate (with cache) ---------- */
const cache = loadCache();

async function translate(text, source, target) {
  if (!text || source === target) return text;
  const key = cacheKey(text, source, target);
  if (cache[key]) return cache[key];

  let out = '';
  if (DEEPL_API_KEY) {
    out = await translateWithDeepL(text, source, target);
  } else {
    out = await translateWithLibreWithBackoff(text, source, target);
  }
  if (out && out.trim()) {
    cache[key] = out;
  }
  return out;
}

/* ---------- Concurrency helper ---------- */
async function runWithConcurrency(items, worker, limit) {
  const results = [];
  let index = 0;
  async function runner() {
    while (index < items.length) {
      const i = index++;
      results[i] = await worker(items[i], i);
    }
  }
  const runners = Array.from({ length: Math.min(limit, items.length) }, runner);
  await Promise.all(runners);
  return results;
}

/* ---------- Main per-namespace processing ---------- */
async function processNamespace(ns) {
  const basePath = path.join(LOCALES_ROOT, BASE_LANG, ns);
  if (!fs.existsSync(basePath)) return;
  const baseObj = readJson(basePath);

  const entries = Array.from(walkEntries(baseObj));

  for (const target of TARGET_LANGS) {
    const targetPath = path.join(LOCALES_ROOT, target, ns);
    let targetObj = {};
    try {
      if (fs.existsSync(targetPath)) targetObj = readJson(targetPath);
    } catch {
      // keep empty
    }

    const missing = entries.filter(({ key }) => {
      const existing = getByPath(targetObj, key);
      return !(typeof existing === 'string' && existing.trim().length > 0);
    });

    if (missing.length === 0) {
      console.log(`No changes for ${target}/${ns}`);
      continue;
    }

    let changed = false;
    await runWithConcurrency(missing, async ({ key, value: frText }) => {
      try {
        const translated = await translate(frText, BASE_LANG, target);
        if (translated && translated.trim().length > 0) {
          setByPath(targetObj, key, translated);
          changed = true;
        }
      } catch (e) {
        console.warn(`Translation error for key "${key}" (${BASE_LANG}->${target}):`, e.message || e);
      }
    }, CONCURRENCY);

    if (changed) {
      if (process.env.DRY_RUN) {
        console.log(`[DRY RUN] Would write ${targetPath}`);
      } else {
        writeJson(targetPath, targetObj);
        console.log(`Updated ${target}/${ns}`);
      }
    } else {
      console.log(`No changes for ${target}/${ns}`);
    }
  }
}

async function main() {
  if (!fs.existsSync(path.join(LOCALES_ROOT, BASE_LANG))) {
    console.error(`Base locale folder not found: ${path.join(LOCALES_ROOT, BASE_LANG)}`);
    process.exit(0);
  }
  debugLogProvider();
  const namespaces = listNamespaces(BASE_LANG);
  if (namespaces.length === 0) {
    console.log('No namespaces found in base language, nothing to translate.');
    return;
  }
  ensureDirsForTargets(namespaces);

  for (const ns of namespaces) {
    await processNamespace(ns);
  }

  // Persist cache on disk
  try {
    if (!process.env.DRY_RUN) saveCache(cache);
  } catch (e) {
    console.warn('Failed to save translation cache:', e.message || e);
  }

  console.log('i18n sync complete.');
}

main().catch((e) => {
  console.error('i18n sync failed:', e);
  process.exit(0); // do not fail CI on translation errors
});