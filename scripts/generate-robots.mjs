import fs from 'fs';
import path from 'path';
import url from 'url';

const projectRoot = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(projectRoot, '..');

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
      } catch {
        // ignore
      }
    }
  }
  // Fallback sensible
  return 'https://mb-fretservices.com';
}

function buildRobots(siteUrl) {
  const sitemap = new URL('/sitemap.xml', siteUrl).href;
  return `# robots.txt generated at build time
# Allow major AI crawlers explicitly. See also /ai.txt for an AI-readable site overview.

# OpenAI
User-agent: GPTBot
Allow: /

# Google AI extension
User-agent: Google-Extended
Allow: /

# Anthropic
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /

# Perplexity
User-agent: PerplexityBot
Allow: /

# Common Crawl
User-agent: CCBot
Allow: /

# Apple
User-agent: Applebot-Extended
Allow: /

# Default rules for all
User-agent: *
Allow: /

Sitemap: ${sitemap}
`;
}

function main() {
  const siteUrl = readEnvSiteUrl();
  const robots = buildRobots(siteUrl);

  const publicDir = path.join(root, 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  const publicPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(publicPath, robots, 'utf8');

  const distDir = path.join(root, 'dist');
  if (fs.existsSync(distDir)) {
    const distPath = path.join(distDir, 'robots.txt');
    fs.writeFileSync(distPath, robots, 'utf8');
    console.log(`Generated robots.txt at ${publicPath} and ${distPath}`);
  } else {
    console.log(`Generated robots.txt at ${publicPath}`);
  }
}

main();