import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { getSiteUrl } from '../utils/siteUrl';

const SiteSEO: FC = () => {
  const SITE_URL = getSiteUrl();
  const GSC = (import.meta.env?.VITE_GSC_VERIFICATION as string | undefined) || '';
  const BING = (import.meta.env?.VITE_BING_VERIFICATION as string | undefined) || '';

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MB Fret Services',
    url: SITE_URL,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+33 1 23 45 67 89',
        contactType: 'customer service',
        areaServed: ['FR', 'EU', 'AF', 'AS'],
        availableLanguage: ['fr', 'en'],
      },
    ],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MB Fret Services',
    url: SITE_URL,
    inLanguage: 'fr-FR',
  };

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'MB Fret Services',
    url: SITE_URL,
    image: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=1200',
    email: 'contact@mb-fretservices.com',
    telephone: '+33 1 23 45 67 89',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 48.8566,
      longitude: 2.3522,
    },
    areaServed: ['Europe', 'Africa', 'Asia'],
  };

  return (
    <Helmet>
      {/* Domain ownership verifications (optional via env) */}
      {GSC ? <meta name="google-site-verification" content={GSC} /> : null}
      {BING ? <meta name="msvalidate.01" content={BING} /> : null}

      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify(organization)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(website)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusiness)}
      </script>
    </Helmet>
  );
};

export default SiteSEO;