import { Shield, Clock, DollarSign, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Features = () => {
  const { t } = useTranslation('features');

  const features = [
    {
      icon: Shield,
      title: t('items.trusted.title'),
      description: t('items.trusted.description'),
    },
    {
      icon: Clock,
      title: t('items.time.title'),
      description: t('items.time.description'),
    },
    {
      icon: DollarSign,
      title: t('items.prices.title'),
      description: t('items.prices.description'),
    },
    {
      icon: MessageSquare,
      title: t('items.communication.title'),
      description: t('items.communication.description'),
    },
  ];

  return (
    <div>
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link to={`/${index + 1}`} key={index}>
                <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <feature.icon className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;