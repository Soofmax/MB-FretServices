import fs from 'fs';
import path from 'path';
import url from 'url';

const projectRoot = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(projectRoot, '..');

const SUP_LANGS = ['fr', 'en', 'pt', 'ar', 'es', 'tr', 'sw', 'de', 'it'];

const SLUGS = {
  fr: { home: '', services: 'services', destinations: 'destinations', contact: 'contact', legal: 'mentions-legales', services_freight_maritime: 'services/fret-maritime' },
  en: { home: '', services: 'services', destinations: 'destinations', contact: 'contact', legal: 'legal-notice', services_freight_maritime: 'services/maritime-freight' },
  pt: { home: '', services: 'servicos', destinations: 'destinos', contact: 'contacto', legal: 'aviso-legal', services_freight_maritime: 'servicos/frete-maritimo' },
  ar: { home: '', services: 'services', destinations: 'destinations', contact: 'contact', legal: 'legal', services_freight_maritime: 'services/maritime-freight' },
  es: { home: '', services: 'services', destinations: 'destinations', contact: 'contact', legal: 'legal', services_freight_maritime: 'services/maritime-freight' },
  tr: { home: '', services: 'services', destinations: 'destinations', contact: 'contact', legal: 'legal', services_freight_maritime: 'services/maritime-freight' },
  sw: { home: '', services: 'services', destinations: 'destinations', contact: 'contact', legal: 'legal', services_freight_maritime: 'services/maritime-freight' },
  de: { home: '', services: 'services', destinations: 'destinations', contact: 'contact', legal: 'legal', services_freight_maritime: 'services/maritime-freight' },
  it: { home: '', services: 'services', destinations: 'destinations', contact: 'contact', legal: 'legal', services_freight_maritime: 'services/maritime-freight' },
};

function readEnvSiteUrl() {
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL.trim();
  const envFiles = ['.env.production', '.env'];
  for (const file of envFiles) {
    const p = path.join(root, file);
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf8');
        const match = content.match(/^VITE_SITE_URL\s*=\s*(.+)$/m);
        if (match) {
          return match[1].replace(/^['"]|['"]$/g, '').trim();
        }
      } catch {}
    }
  }
  return 'https://mb-fretservices.com';
}

function buildPages(siteUrl) {
  const pages = [];
  for (const lng of SUP_LANGS) {
    const sl = SLUGS[lng];
    const entries = Object.entries(sl);
    for (const [key, slug] of entries) {
      // Only include primary logical pages
      if (!['home','services','destinations','contact','legal','services_freight_maritime'].includes(key)) continue;
      const path = `/${lng}${slug ? `/${slug}` : ''}`;
      const url = new URL(path, siteUrl).href.replace(/\/$/, '');
      pages.push({ lang: lng, key, url });
    }
  }
  return pages;
}

function aiTxt(siteUrl) {
  const pages = buildPages(siteUrl);
  const updated = new Date().toISOString();

  // Very simple YAML without external deps
  const lines = [];
  lines.push('version: 1');
  lines.push('site:');
  lines.push(`  name: MB Fret Services`);
  lines.push(`  url: ${siteUrl}`);
  lines.push(`  description: >-`);
  lines.push(`    MB Fret Services propose des solutions de transport international (fret maritime FCL/LCL, fret aérien),`);
  lines.push(`    dédouanement et assurance cargo depuis l'Europe vers l'Afrique et l'Asie. Devis sous 24 h.`);
  lines.push(`  languages: [fr, en, pt, es, ar, tr, de, it, sw]`);
  lines.push(`  topics: [logistics, freight, maritime, air, customs, shipping, africa, asia, europe]`);
  lines.push(`  target_audience: B2B & particuliers expédiant des marchandises vers l'Afrique et l'Asie depuis l'Europe`);
  lines.push(`  service_regions:`);
  lines.push(`    - Africa: [Congo, Angola, Côte d'Ivoire, Cameroun]`);
  lines.push(`    - Asia: [China, Turkey]`);
  lines.push(`  contact:`);
  lines.push(`    email: contact@mb-fretservices.com`);
  lines.push(`    phone: "+33 1 23 45 67 89"`);
  lines.push(`    whatsapp: https://wa.me/33123456789`);
  lines.push(`  address:`);
  lines.push(`    city: Paris`);
  lines.push(`    country: FR`);
  lines.push(`  social:`);
  lines.push(`    linkedin: https://www.linkedin.com/company/NOM-DE-L-ENTREPRISE-PLACEHOLDER`);
  lines.push(`    twitter: https://twitter.com/NOM-DE-L-ENTREPRISE-PLACEHOLDER`);
  lines.push(`  pages:`);

  for (const p of pages) {
    lines.push(`    - lang: ${p.lang}`);
    lines.push(`      key: ${p.key}`);
    lines.push(`      url: ${p.url}`);
  }

  lines.push('  examples:');
  lines.push(`    - query: "expédier un conteneur 20' vers Pointe-Noire"`);
  lines.push(`      suggest: "${siteUrl}/fr/services/fret-maritime"`);
  lines.push(`    - query: "prix fret aérien Paris vers Luanda"`);
  lines.push(`      suggest: "${siteUrl}/fr/services"`);
  lines.push(`    - query: "dédouanement import machines en France"`);
  lines.push(`      suggest: "${siteUrl}/fr/services"`);
  lines.push('metadata:');
  lines.push(`  source_of_truth: sitemap.xml, pages content, structured data`);
  lines.push(`  updated_at: ${updated}`);

  return lines.join('\n') + '\n';
}

function main() {
  const siteUrl = readEnvSiteUrl();
  const txt = aiTxt(siteUrl);

  const publicDir = path.join(root, 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  const publicPath = path.join(publicDir, 'ai.txt');
  fs.writeFileSync(publicPath, txt, 'utf8');

  const distDir = path.join(root, 'dist');
  if (fs.existsSync(distDir)) {
    const distPath = path.join(distDir, 'ai.txt');
    fs.writeFileSync(distPath, txt, 'utf8');
    console.log(`Generated ai.txt at ${publicPath} and ${distPath}`);
  } else {
    console.log(`Generated ai.txt at ${publicPath}`);
  }
}

main();