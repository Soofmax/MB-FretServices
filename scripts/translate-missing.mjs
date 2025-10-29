import fs from 'fs';
import path from 'path';
import url from 'url';

/**
 * Auto-translate missing keys from base language (fr) to targets (en, pt).
 * Provider order:
 *  - LingoDev if (URL is configured OR API key present → default URL) and key is set
 *  - LibreTranslate public endpoint as fallback (best-effort, with light backoff on 429)
 *
 * Usage:
 *   node scripts/translate-missing.mjs
 *
 * Env:
 *   LINGODEV_API_URL (optional; defaults to https://api.lingo.dev/v1/translate if LINGODEV_API_KEY is set)
 *   LINGODEV_API_KEY (raw token, without the "Bearer " prefix)
 *   LIBRETRANSLATE_URL (optional, default https://libretranslate.com/translate)
 *   DRY_RUN=1 (optional, don't write files)
 *
 * Notes:
 *   - On startup, logs the chosen provider and target languages to aid CI diagnostics.
 *   - When falling back to LibreTranslate, applies a small retry/backoff on HTTP 429 to reduce rate-limit errors.
 */

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const LOCALES_ROOT = path.join(repoRoot, 'public', 'locales');

const BASE_LANG = 'fr';
// Control target languages via env to avoid API rate limits on build.
// Example: I18N_TARGET_LANGS="en,pt,es" (defaults to en,pt)
const TARGET_LANGS = (process.env.I18N_TARGET_LANGS
  ? process.env.I18N_TARGET_LANGS.split(',').map(s => s.trim()).filter(Boolean)
  : ['en', 'pt']);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
function writeJson(p, data) {
  const json = JSON.stringify(data, null, 2) + '\n';
  fs.writeFileSync(p, json, 'utf8');
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
    // ensure files exist
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
    const isIndex = /^\d+$/.test(p);
    if (isLast) {
      cur[p] = value;
      return;
    }
    if (!(p in cur)) {
      cur[p] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    }
    cur = cur[p];
    // Ensure array shape when next is index
    if (Array.isArray(cur) && !isIndex) {
      // no-op
    }
  }
}

// Provider selection (with sensible defaults)
const RAW_LINGO_URL = process.env.LINGODEV_API_URL || '';
const LINGODEV_API_KEY = process.env.LINGODEV_API_KEY || process.env.LINGODOTDEV_API_KEY || '';
const DEFAULT_LINGO_URL = 'https://api.lingo.dev/v1/translate';
// If user set an API key but not the URL, try the default Engine endpoint.
// If it fails, we'll fall back to LibreTranslate gracefully.
const LINGODEV_API_URL = RAW_LINGO_URL || (LINGODEV_API_KEY ? DEFAULT_LINGO_URL : '');
const LIBRE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com/translate';

// Normalize language codes for provider
function mapLangForProvider(lang, provider) {
  if (provider === 'lingodev') {
    // Assume 'fr', 'en', 'pt' supported
    return lang;
  }
  if (provider === 'libre') {
    // 'pt' is okay
    return lang;
  }
  return lang;
}

function debugLogProvider() {
  const targets = TARGET_LANGS.join(', ');
  if (LINGODEV_API_URL) {
    console.log(`[i18n] Provider: LingoDev (${LINGODEV_API_URL}). Targets: ${targets}`);
  } else {
    console.log(`[i18n] Provider: LibreTranslate (${LIBRE_URL}). Targets: ${targets}`);
  }
}

async function translateWithLingoDev(text, source, target) {
  const src = mapLangForProvider(source, 'lingodev');
  const tgt = mapLangForProvider(target, 'lingodev');
  let res;
  try {
    res = await fetch(LINGODEV_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(LINGODEV_API_KEY ? { Authorization: `Bearer ${LINGODEV_API_KEY}` } : {}),
      },
      body: JSON.stringify({ q: text, source: src, target: tgt }),
    });
  } catch (err) {
    const cause = err && err.cause ? err.cause : null;
    const info = cause
      ? ` cause: ${cause.code || ''} ${cause.hostname || ''} ${cause.syscall || ''}`.trim()
      : '';
    throw new Error(`LingoDev fetch failed.${info ? ' ' + info : ''}`);
  }
  if (!res.ok) {
    throw new Error(`LingoDev HTTP ${res.status}`);
  }
  const data = await res.json();
  // Try common shapes
  return data.translatedText || data.translation || data.result || data.text || '';
}

async function translateWithLibre(text, source, target) {
  const res = await fetch(LIBRE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      q: text,
      source: mapLangForProvider(source, 'libre'),
      target: mapLangForProvider(target, 'libre'),
      format: 'text',
    }),
  });
  if (!res.ok) {
    throw new Error(`LibreTranslate HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.translatedText || '';
}

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

async function translate(text, source, target) {
  // Skip empty or identical languages
  if (!text || source === target) return text;

  // Prefer LingoDev if configured (URL present → either explicit or defaulted because key is present)
  if (LINGODEV_API_URL) {
    try {
      return await translateWithLingoDev(text, source, target);
    } catch (e) {
      const msg = e && e.message ? e.message : e;
      console.warn('LingoDev translation failed, falling back to LibreTranslate:', msg, 'url=', LINGODEV_API_URL);
    }
  }
  // Fallback with light backoff on 429
  return await translateWithLibreWithBackoff(text, source, target);
}

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

    let changed = false;
    for (const { key, value: frText } of entries) {
      const existing = getByPath(targetObj, key);
      if (typeof existing === 'string' && existing.trim().length > 0) continue;

      // Translate
      let translated = '';
      try {
        translated = await translate(frText, BASE_LANG, target);
        // Small delay to be friendly with public MT endpoints
        await sleep(120);
      } catch (e) {
        console.warn(`Translation error for key "${key}" (${BASE_LANG}->${target}):`, e.message || e);
        continue;
      }
      if (translated && translated.trim().length > 0) {
        setByPath(targetObj, key, translated);
        changed = true;
      }
    }

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

  console.log('i18n sync complete.');
}

main().catch((e) => {
  console.error('i18n sync failed:', e);
  process.exit(0); // do not fail CI on translation errors
});