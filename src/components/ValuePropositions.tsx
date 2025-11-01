import type { FC, ComponentType } from 'react';
import { Ship, Plane, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PropItem = {
  title: string;
  description: string;
  features: string[];
  icon: ComponentType<{ size?: number | string; className?: string; 'aria-hidden'?: boolean }>;
};

const ValuePropositions: FC = () => {
  const { t } = useTranslation('home');

  const items = (t('valueProps.items', { returnObjects: true }) as Array<{
    title: string;
    description: string;
    features: string[];
  }>).map((it, idx) => {
    const iconMap: Record<number, ComponentType<{ size?: number | string; className?: string; 'aria-hidden'?: boolean }>> = {
      0: Ship,
      1: Plane,
      2: Shield,
    };
    return { ...it, icon: iconMap[idx] || Ship } as PropItem;
  });

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            {t('valueProps.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('valueProps.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <div
                key={prop.title}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 group hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={32} className="text-white" aria-hidden="true" />
                </div>

                <h3 className="text-2xl font-bold text-primary-900 mb-4 group-hover:text-accent-500 transition-colors duration-300">
                  {prop.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {prop.description}
                </p>

                <ul className="space-y-2">
                  {prop.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-accent-500 rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValuePropositions;