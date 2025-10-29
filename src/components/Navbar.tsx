import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import CtaButton from './CtaButton';
import LocalizedLink from './LocalizedLink';
import { useTranslation } from 'react-i18next';
import { localizeTo } from '../utils/paths';

const LANGS = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
  { code: 'es', label: 'ES' },
  { code: 'ar', label: 'AR' },
  { code: 'tr', label: 'TR' },
  { code: 'de', label: 'DE' },
  { code: 'it', label: 'IT' },
  { code: 'sw', label: 'SW' },
];

const SUP = ['fr','en','pt','es','ar','tr','sw','de','it'] as const;

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const currentLang = params.lng && (SUP as readonly string[]).includes(params.lng) ? params.lng : 'fr';
  const { t } = useTranslation(['navbar', 'common']);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ferme le menu mobile avec la touche Échap
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Ferme le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navigationItems = [
    { name: t('navbar:home', 'Accueil'), href: '' },
    { name: t('navbar:services', 'Nos Services'), href: 'services' },
    { name: t('navbar:destinations', 'Destinations'), href: 'destinations' },
    { name: t('navbar:contact', 'Contact'), href: 'contact' },
  ];

  const isActiveLink = (href: string) => {
    const lang = (currentLang || 'fr') as typeof SUP[number];
    const localized = localizeTo(href, lang as any);
    return location.pathname === localized;
  };

  const onLanguageChange = (lng: string) => {
    const parts = location.pathname.split('/');
    if (parts.length > 1 && (SUP as readonly string[]).includes(parts[1])) {
      parts[1] = lng;
      const target = parts.join('/') || `/${lng}`;
      navigate(target, { replace: true });
    } else {
      navigate(`/${lng}`, { replace: true });
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Navigation principale"
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <LocalizedLink to="" className="flex-shrink-0">
            <span className="text-2xl font-bold text-primary-900">
              MB Fret Services
            </span>
          </LocalizedLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <LocalizedLink
                  key={item.name}
                  to={item.href}
                  aria-current={isActiveLink(item.href) ? 'page' : undefined}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActiveLink(item.href)
                      ? 'text-accent-500 border-b-2 border-accent-500'
                      : 'text-primary-700 hover:text-accent-500 hover:border-b-2 hover:border-accent-500'
                  }`}
                >
                  {item.name}
                </LocalizedLink>
              ))}
            </div>
            <div className="ml-6">
              <CtaButton href="contact" variant="primary">
                {t('common:get_quote', 'Demander un Devis')}
              </CtaButton>
            </div>
            <div className="ml-4">
              <label htmlFor="lang" className="sr-only">Langue</label>
              <select
                id="lang"
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm text-primary-700 hover:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
                aria-label="Changer de langue"
              >
                {LANGS.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <label htmlFor="lang-m" className="sr-only">Langue</label>
            <select
              id="lang-m"
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm text-primary-700"
              aria-label="Changer de langue"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-700 hover:text-accent-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <LocalizedLink
                key={item.name}
                to={item.href}
                aria-current={isActiveLink(item.href) ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActiveLink(item.href)
                    ? 'text-accent-500 bg-gray-50'
                    : 'text-primary-700 hover:text-accent-500 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </LocalizedLink>
            ))}
            <div className="pt-2 px-2">
              <CtaButton href="contact" variant="primary" className="w-full">
                {t('common:get_quote', 'Demander un Devis')}
              </CtaButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;