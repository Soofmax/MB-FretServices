import type { FC } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from 'lucide-react';
import SEO from '../components/SEO';
import { getSiteUrl } from '../utils/siteUrl';
import { useTranslation } from 'react-i18next';

const Contact: FC = () => {
  const SITE_URL = getSiteUrl();
  const { t } = useTranslation('contact');

  return (
    <div className="pt-16">
      <SEO
        title="Contact - Devis Gratuit Transport International | MB Fret Services"
        description="Contactez MB Fret Services pour un devis gratuit. Experts en transport maritime et aérien. WhatsApp, email ou téléphone. Réponse sous 24h garantie."
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Accueil',
                item: SITE_URL + '/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Contact',
                item: SITE_URL + '/contact',
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact - MB Fret Services',
            inLanguage: 'fr-FR',
          },
        ]}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Email */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 animate-slide-up group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Mail size={32} className="text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-4">{t('methods.email')}</h3>
              <a
                href="mailto:contact@mb-fretservices.com"
                className="text-accent-500 hover:text-accent-600 transition-colors duration-200 font-medium"
              >
                contact@mb-fretservices.com
              </a>
              <p className="text-gray-600 mt-2 text-sm">
                {t('methods.email_hint')}
              </p>
            </div>

            {/* Téléphone */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 animate-slide-up group" style={{ animationDelay: '200ms' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Phone size={32} className="text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-4">{t('methods.phone')}</h3>
              <a
                href="tel:+33123456789"
                className="text-accent-500 hover:text-accent-600 transition-colors duration-200 font-medium"
              >
                +33 1 23 45 67 89
              </a>
              <p className="text-gray-600 mt-2 text-sm">
                {t('methods.phone_hours')}
              </p>
            </div>

            {/* WhatsApp */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 animate-slide-up group" style={{ animationDelay: '400ms' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle size={32} className="text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-4">{t('methods.whatsapp')}</h3>
              <a
                href="https://wa.me/33123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-500 hover:text-accent-600 transition-colors duration-200 font-medium"
              >
                {t('methods.chat_direct')}
              </a>
              <p className="text-gray-600 mt-2 text-sm">
                {t('methods.whatsapp_hint')}
              </p>
            </div>

            {/* Bureau */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 animate-slide-up group" style={{ animationDelay: '600ms' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MapPin size={32} className="text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-4">{t('methods.office')}</h3>
              <p className="text-gray-700 font-medium">
                {t('methods.office_city')}
              </p>
              <p className="text-gray-600 mt-2 text-sm">
                {t('methods.office_hint')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guide pour demande de devis */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
              {t('guide.title')}
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('guide.intro')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-primary-900 mb-6 flex items-center">
                <Send size={24} className="text-accent-500 mr-3" aria-hidden="true" />
                {t('guide.info_title')}
              </h3>
              <ul className="space-y-4">
                {(t('guide.items', { returnObjects: true }) as Array<{ title: string; desc: string }>).map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-primary-900">{item.title}</span>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-8">
              <h3 className="text-xl font-bold text-primary-900 mb-6 flex items-center">
                <Clock size={24} className="text-accent-500 mr-3" aria-hidden="true" />
                {t('guide.commitment_title')}
              </h3>
              <ul className="space-y-4">
                {(t('guide.commitment', { returnObjects: true }) as Array<{ title: string; desc: string }>).map((c, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-primary-900">{c.title}</span>
                      <p className="text-gray-700 text-sm">{c.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            {t('cta.text')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="mailto:contact@mb-fretservices.com?subject=Demande de devis transport international"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-accent-500 text-white hover:bg-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Mail size={20} className="mr-2" aria-hidden="true" />
              {t('cta.email')}
            </a>

            <a
              href={`https://wa.me/33123456789?text=${encodeURIComponent('Bonjour, je souhaite obtenir un devis pour un transport international')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <MessageCircle size={20} className="mr-2" aria-hidden="true" />
              {t('cta.whatsapp')}
            </a>

            <a
              href="tel:+33123456789"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-white hover:text-primary-900 transition-all duration-200"
            >
              <Phone size={20} className="mr-2" aria-hidden="true" />
              {t('cta.call')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;