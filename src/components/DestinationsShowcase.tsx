import type { FC } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import LocalizedLink from './LocalizedLink';
import { useTranslation } from 'react-i18next';

type ShowcaseItem = {
  country: string;
  city: string;
  image: string;
  routes: string[];
};

const DestinationsShowcase: FC = () => {
  const { t } = useTranslation('home');

  const destinations = t('showcase', { returnObjects: true }) as ShowcaseItem[];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            {t('destinations_title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('destinations_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <div
              key={`${destination.country}-${index}`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative">
                <img
                  src={destination.image}
                  alt={`${destination.country} - ${destination.city}`}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={533}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center mb-2">
                  <MapPin size={18} className="text-accent-400 mr-2" aria-hidden="true" />
                  <h3 className="text-xl font-bold">{destination.country}</h3>
                </div>
                <p className="text-gray-200 mb-3">{destination.city}</p>

                <div className="space-y-1">
                  {destination.routes.map((route, routeIndex) => (
                    <div key={routeIndex} className="flex items-center text-sm text-gray-300">
                      <ArrowRight size={14} className="mr-2 text-accent-400" aria-hidden="true" />
                      {route}
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute inset-0 bg-accent-500/0 group-hover:bg-accent-500/10 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            {t('destinations_need_specific')}
          </p>
          <LocalizedLink
            to="destinations"
            className="inline-flex items-center text-accent-500 hover:text-accent-600 font-medium transition-colors duration-200"
          >
            {t('destinations_more')}
            <ArrowRight size={18} className="ml-2" aria-hidden="true" />
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
};

export default DestinationsShowcase;