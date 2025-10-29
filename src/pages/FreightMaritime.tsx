import type { FC, ComponentType } from 'react';
import { Ship, Clock, Shield, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import CtaButton from '../components/CtaButton';
import SEO from '../components/SEO';
import { getSiteUrl } from '../utils/siteUrl';
import { useTranslation } from 'react-i18next';

type Advantage = { icon: ComponentType<{ size?: number | string; className?: string; 'aria-hidden'?: boolean }>; title: string; description: string };
type Destination = { country: string; port: string; duration: string; frequency: string; departure: string };

const FreightMaritime: FC = () => {
  const SITE_URL = getSiteUrl();
  const { t } = useTranslation('freight');

  const advData = (t('advantages', { returnObjects: true }) as Array<{ title: string; description: string }>);

  const advantages: Advantage[] = [
    { icon: Ship, title: advData[0]?.title || '', description: advData[0]?.description || '' },
    { icon: Clock, title: advData[1]?.title || '', description: advData[1]?.description || '' },
    { icon: Shield, title: advData[2]?.title || '', description: advData[2]?.description || '' },
  ];

  const destinations = t('destinations_list', { returnObjects: true }) as Destination[];

  const services = t('services.list', { returnObjects: true }) as string[];

  return (
    <div className="pt-16">
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL + '/' },
              { '@type': 'ListItem', position: 2, name: 'Services', item: SITE_URL + '/services' },
              { '@type': 'ListItem', position: 3, name: 'Fret maritime', item: SITE_URL + '/services/fret-maritime' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: "Fret maritime vers l'Afrique (FCL & LCL)",
            serviceType: 'Fret maritime',
            provider: {
              '@type': 'Organization',
              name: 'MB Fret Services',
              url: SITE_URL,
            },
            areaServed: [
              { '@type': 'Country', name: 'Congo' },
              { '@type': 'Country', name: 'Angola' },
              { '@type': 'Country', name: "Côte d'Ivoire" },
              { '@type': 'Country', name: 'Cameroun' },
            ],
            availableChannel: {
              '@type': 'ServiceChannel',
              serviceLocation: { '@type': 'Place', name: 'France et Europe' },
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Quelle est la différence entre FCL et LCL ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text:
                    "FCL (Full Container Load) : vous louez un conteneur complet (20' ou 40') pour vos marchandises exclusivement. " +
                    "LCL (Less than Container Load) : vos marchandises partagent un conteneur avec d'autres expéditeurs, idéal pour les petits volumes.",
                },
              },
              {
                '@type': 'Question',
                name: 'Quels documents sont nécessaires pour le fret maritime ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text:
                    "Facture commerciale, liste de colisage, connaissement maritime (Bill of Lading), certificat d'origine si requis, " +
                    'et documents spécifiques selon la nature des marchandises (certificats sanitaires, etc.).',
                },
              },
              {
                '@type': 'Question',
                name: 'Comment suivre mon conteneur en transit ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text:
                    'Nous fournissons un numéro de suivi et un accès à notre plateforme web pour un suivi en temps réel, ' +
                    "de l'embarquement au port de départ jusqu'à l'arrivée au port de destination.",
                },
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: "Fret Maritime vers l'Afrique",
            inLanguage: 'fr-FR',
          },
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=1600")'
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <div className="flex items-center mb-6">
              <Ship size={48} className="text-accent-400 mr-4" aria-hidden="true" />
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {t('hero.title')}
                </h1>
                <p className="text-xl md:text-2xl text-accent-400 font-medium">
                  {t('hero.subtitle')}
                </p>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl leading-relaxed">
              {t('hero.intro')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <CtaButton href="contact" variant="primary" className="text-lg px-8 py-4">
                {t('hero.cta_quote')}
              </CtaButton>
              <a
                href={`https://wa.me/33123456789?text=${encodeURIComponent("Bonjour, je souhaite un devis pour du fret maritime vers l'Afrique")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition-all duration-200"
              >
                {t('hero.cta_whatsapp')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              {t('why.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('why.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <advantage.icon size={32} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-4">{advantage.title}</h3>
                <p className="text-gray-600 leading-relaxed">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services détaillés */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                {t('services.title')}
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t('services.subtitle')}
              </p>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle size={20} className="text-accent-500 mr-3 mt-1 flex-shrink-0" aria-hidden="true" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <CtaButton href="contact" variant="primary">
                  {t('services.cta')}
                </CtaButton>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Conteneurs de fret maritime"
                loading="lazy"
                decoding="async"
                width={800}
                height={533}
                className="w-full h-96 object-cover rounded-xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations principales */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              {t('destinations.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('destinations.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {destinations.map((destination, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center mb-6">
                  <MapPin size={24} className="text-accent-500 mr-3" aria-hidden="true" />
                  <div>
                    <h3 className="text-2xl font-bold text-primary-900">{destination.country}</h3>
                    <p className="text-gray-600">Port : {destination.port}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-sm text-gray-500">{t('destinations.label_duration')}</span>
                    <p className="font-semibold text-primary-900">{destination.duration}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{t('destinations.label_frequency')}</span>
                    <p className="font-semibold text-primary-900">{destination.frequency}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-sm text-gray-500">{t('destinations.label_departure')}</span>
                  <p className="font-semibold text-primary-900">{destination.departure}</p>
                </div>

                <CtaButton href="contact" variant="outline" className="w-full">
                  {t('destinations.cta_prefix')}{destination.country}
                </CtaButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              {t('faq.title')}
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-primary-900 mb-4">
                {t('faq.q1')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('faq.a1')}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-primary-900 mb-4">
                {t('faq.q2')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('faq.a2')}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-primary-900 mb-4">
                {t('faq.q3')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('faq.a3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-900 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('final.title')}
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            {t('final.text')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CtaButton href="contact" variant="primary" className="text-lg px-8 py-4">
              {t('final.cta')}
            </CtaButton>
            <a
              href={`https://wa.me/33123456789?text=${encodeURIComponent('Bonjour, je souhaite un devis pour du fret maritime')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition-all duration-200"
            >
              <ArrowRight size={20} className="mr-2" aria-hidden="true" />
              {t('final.whatsapp')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FreightMaritime;