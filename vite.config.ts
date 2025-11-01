import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE || '/';

  return {
    base,
    plugins: [
      react(),
      // NOTE: prerender temporarily disabled due to ESM/require incompatibility of vite-plugin-prerender in Node 20.
      // We'll handle SEO via react-helmet-async and sitemap, and can switch to an SSR/SSG solution later (e.g. Vike/vite-plugin-ssr).
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
