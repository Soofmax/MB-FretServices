import type { FC } from 'react';
import SEO from '../components/SEO';
import LocalizedLink from '../components/LocalizedLink';
import { Ship, Plane } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFound: FC = () => {
  const { t } = useTranslation(['notFound', 'navbar', 'common']);

  return (
    <div className="pt-16">
      <SEO
        title={t('notFound:seo.title')}
        description={t('notFound:seo.description')}
        noindex
      />
      <section className="relative overflow-hidden py-24 bg-gray-50">
        {/* Decorative animated icons */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <Ship
            size={56}
            className="text-accent-500/20 absolute -left-6 top-10 animate-drift-slow"
          />
          <Plane
            size={48}
            className="text-accent-500/20 absolute right-6 top-20 animate-float-slow"
          />
          <Ship
            size={40}
            className="text-accent-500/10 absolute right-10 bottom-10 animate-drift-slow"
          />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="text-7xl md:text-8xl font-extrabold mb-6 bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              {t('notFound:ui.code')}
            </h1>
            <p className="text-2xl md:text-3xl text-primary-900 font-semibold mb-4">
              {t('notFound:ui.heading')}
            </p>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('notFound:ui.message')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <LocalizedLink
                to=""
                className="inline-flex items-center px-6 py-3 rounded-lg bg-accent-500 text-white hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500 transition-colors"
              >
                {t('notFound:ui.cta')}
              </LocalizedLink>
              <LocalizedLink
                to="contact"
                className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-accent-500 text-accent-600 hover:bg-accent-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500 transition-colors"
              >
                {t('common:get_quote', 'Demander un Devis')}
              </LocalizedLink>
            </div>

            {/* Quick links to key pages */}
            <div className="mt-4">
              <h2 className="text-primary-900 font-semibold text-lg mb-4">{t('notFound:quick.title')}</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                <LocalizedLink
                  to="services"
                  className="inline-flex items-center px-4 py-2 rounded-md border border-primary-200 text-primary-800 hover:border-accent-500 hover:text-accent-600 transition-colors bg-white"
                >
                  {t('navbar:services', 'Services')}
                </LocalizedLink>
                <LocalizedLink
                  to="destinations"
                  className="inline-flex items-center px-4 py-2 rounded-md border border-primary-200 text-primary-800 hover:border-accent-500 hover:text-accent-600 transition-colors bg-white"
                >
                  {t('navbar:destinations', 'Destinations')}
                </LocalizedLink>
                <LocalizedLink
                  to="contact"
                  className="inline-flex items-center px-4 py-2 rounded-md border border-primary-200 text-primary-800 hover:border-accent-500 hover:text-accent-600 transition-colors bg-white"
                >
                  {t('navbar:contact', 'Contact')}
                </LocalizedLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;