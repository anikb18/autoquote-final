import { Shield, Clock, DollarSign, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: t('features.items.trusted.title'),
      description: t('features.items.trusted.description'),
    },
    {
      icon: Clock,
      title: t('features.items.time.title'),
      description: t('features.items.time.description'),
    },
    {
      icon: DollarSign,
      title: t('features.items.prices.title'),
      description: t('features.items.prices.description'),
    },
    {
      icon: MessageSquare,
      title: t('features.items.communication.title'),
      description: t('features.items.communication.description'),
    },
  ];

  return (
    <section className="py-24 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;