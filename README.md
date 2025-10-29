# MB Fret Services — Site statique (React + Vite + TS)

Projet de site vitrine multilingue (FR/EN/PT) pour services de transport international. Stack moderne : React 18, Vite 5, TypeScript, Tailwind CSS, i18next, react-helmet-async.

Note : ce dépôt est destiné au développement. Les URLs finales (production) ne sont pas fixées ici par choix. Les éléments « URLs/host » se configurent via la variable d’environnement `VITE_SITE_URL` au moment du déploiement.

## Démarrage

- Node.js 20+
- npm 9+

Installer et lancer :
- `npm ci`
- `npm run dev`  → http://localhost:5173

Vérifications :
- `npm run lint`
- `npm run typecheck`

Build :
- `npm run build`
- `npm run preview`  → sert `dist/` en local

## Internationalisation (i18n)

Les traductions sont dans `public/locales/{lng}/{namespace}.json`. Langues activées : fr, en, pt (plus alias de routage pour d’autres langues).

Synchroniser les clés manquantes (FR → EN/PT) :
- `npm run i18n:sync`

Environnement supporté par le script :
- `DEEPL_API_KEY` (optionnel — si présent, le script utilise DeepL)
- `DEEPL_API_URL` (optionnel — défaut `https://api-free.deepl.com/v2/translate` si `DEEPL_API_KEY` est défini)
- `LIBRETRANSLATE_URL` (fallback — défaut `https://libretranslate.com/translate`)
- `I18N_TARGET_LANGS` (ex : `en,pt,es`)
- `I18N_CONCURRENCY` (concurrence des requêtes — défaut `3`)
- `DRY_RUN=1` pour ne pas écrire

Cache : un cache des traductions est stocké dans `.cache/i18n-cache.json` pour accélérer fortement les exécutions suivantes.

Le script n’échoue pas le CI en cas d’erreur réseau (best-effort).

## SEO

- Balises par page via `react-helmet-async` (`src/components/SEO.tsx`).
- Données structurées (Organization/WebSite) globales via `SiteSEO`.
- Sitemap XML généré par `scripts/generate-sitemap.mjs` (postbuild) et copié dans `public/`.
- `robots.txt` dans `public/`.

Astuce : définissez `VITE_SITE_URL` au build (ex : `.env.production`) pour des canoniques/hreflang/sitemap corrects en production. Par défaut, le code tombe sur l’origine du navigateur en dev.

## Accessibilité

- Lien d’évitement « Passer au contenu principal ».
- Focus déplacé automatiquement sur `<main id="main">` à chaque navigation.
- Icônes décoratives regroupées dans des conteneurs `aria-hidden` lorsque pertinent.

À vérifier au besoin avec Lighthouse/Axe (contrastes, ordre de focus).

## Sécurité (front)

Une CSP minimale est injectée dans `index.html` :
- scripts autorisés depuis `self` uniquement
- styles depuis `self` + Google Fonts (`'unsafe-inline'` nécessaire aux styles inline et CSS Fonts)
- fonts depuis Google Fonts
- images depuis `self`, `images.pexels.com`, `data:`
- `frame-ancestors 'none'`, `upgrade-insecure-requests`

À adapter si vous ajoutez des domaines (analytics/CDN).

Tous les liens `target="_blank"` utilisent `rel="noopener noreferrer"`.

## Performance

- Préchargement de l’image « hero » (LCP).
- `preconnect` → Google Fonts/Fonts.gstatic + Images Pexels.
- Largeur/hauteur ajoutées sur plusieurs `<img>` pour limiter le CLS en production.
- Tailwind purge sur `./index.html` et `./src/**/*.{js,ts,jsx,tsx}`.

Mesurer en prod avec Lighthouse et vérifier les Core Web Vitals.

## Routage et langues

- SPA via React Router, préfixe de langue dans l’URL (`/:lng/...`).
- `LocalizedLink` construit les chemins locaux (alias de slugs pour EN/PT en plus des canoniques FR).
- `LangLayout` positionne `lang`/`dir` sur `<html>`.

## Variables d’environnement

Exemple (`.env.example`) :
- `VITE_SITE_URL=https://example.com`

À définir au moment du déploiement réel (non fixé dans ce dépôt de dev).

## Scripts

- `dev` — serveur Vite
- `build` — build de production
- `preview` — prévisualisation du build
- `lint` — ESLint
- `typecheck` — TypeScript
- `prebuild` — i18n sync (best-effort)
- `postbuild` — génération du sitemap

## Déploiement

Ce dépôt n’impose pas de cible (GitHub Pages/Netlify/Vercel/Cloudflare Pages). Lors de la mise en ligne :

1) définir `VITE_SITE_URL` (URL publique finale)
2) exécuter `npm run build` (génération sitemap incluse)
3) servir le dossier `dist/`

Pour les plateformes CDN (Netlify/CF Pages), vous pouvez compléter par des en-têtes de sécurité côté plateforme (HSTS, Permissions-Policy, etc.). Le fichier `netlify.toml` présent sert d’exemple mais n’est pas pris en compte ailleurs.

## Licence

À définir par le propriétaire du projet (MIT/Apache-2.0/propriétaire). Si besoin, ajoutez un fichier `LICENSE` à la racine.
