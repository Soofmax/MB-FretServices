import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { buildCanonical } from '../utils/seo';
import {
  DEFAULT_SITE_NAME,
  DEFAULT_OG_IMAGE,
  OG_LOCALE_MAP,
  getCurrentLangFromPath,
  buildAlternateLinks,
} from '../utils/seoHelpers';

type SEOProps = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const SEO: FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  jsonLd,
}) => {
  const url = buildCanonical(canonical);
  const currentLang = getCurrentLangFromPath();
  const ogLocale = OG_LOCALE_MAP[currentLang] ?? 'fr_FR';
  const alternates = buildAlternateLinks();

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {!noindex && <meta name="robots" content="index,follow" />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:locale" content={ogLocale} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Canonical */}
      {url && <link rel="canonical" href={url} />}

      {/* Hreflang alternates */}
      {alternates.map((alt) => (
        <link key={`${alt.hrefLang}-${alt.href}`} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
      ))}
      {/* x-default to EN by convention */}
      {alternates.find((a) => a.hrefLang === 'en-GB') && (
        <link rel="alternate" hrefLang="x-default" href={alternates.find((a) => a.hrefLang === 'en-GB')!.href} />
      )}

      {/* Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;