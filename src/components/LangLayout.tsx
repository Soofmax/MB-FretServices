import type { FC, ReactNode } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import i18n, { SUPPORTED_LANGS, type SupportedLang } from '../i18n';
import SiteSEO from './SiteSEO';
import ScrollToTop from './ScrollToTop';
import Navbar from './Navbar';
import Footer from './Footer';
import { trackPageview } from '../analytics';

type Params = {
  lng?: string;
};

const isSupported = (lng: string | undefined): lng is SupportedLang =>
  !!lng && (SUPPORTED_LANGS as unknown as string[]).includes(lng);

const isRtl = (lng: string) => ['ar', 'he', 'fa', 'ur'].includes(lng);

const LangLayout: FC<{ children?: ReactNode }> = () => {
  const { lng } = useParams<Params>();
  const location = useLocation();

  useEffect(() => {
    const language: SupportedLang = isSupported(lng) ? lng : 'fr';
    void i18n.changeLanguage(language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = isRtl(language) ? 'rtl' : 'ltr';
    }
  }, [lng]);

  // Accessibilité: déplacer le focus sur le contenu principal après navigation
  useEffect(() => {
    const main = document.getElementById('main');
    if (main) main.focus();
    // Analytics page view
    try {
      trackPageview(location.pathname + location.search + location.hash);
    } catch {
      // ignore
    }
  }, [location.pathname, location.search, location.hash]);

  return (
    <>
      <SiteSEO />
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-500 px-4 py-2 rounded">
          Passer au contenu principal
        </a>
        <Navbar />
        <main id="main" tabIndex={-1}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LangLayout;