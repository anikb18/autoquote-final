import { Tab } from '@headlessui/react';
import { FeatureTab } from './FeatureTab';
import { FeatureImage } from './FeatureImage';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface Feature {
  name: string;
  summary: string;
  description: string;
  image: string;
  icon: React.ComponentType;
}

interface FeatureListProps {
  features: Feature[];
  className?: string;
}

export const FeatureList = ({ features, className }: FeatureListProps) => {
  const { t } = useTranslation('features');

  return (
    <Tab.Group as="div" className={className}>
      {({ selectedIndex }) => (
        <div className="grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:pt-0 lg:grid-cols-12 lg:pt-0">
          <div className="lg:col-span-5">
            <Tab.List className="grid auto-rows-min gap-y-6 sm:grid-cols-2 lg:grid-cols-1">
              {features.map((feature, featureIndex) => (
                <FeatureTab
                  key={feature.name}
                  feature={feature}
                  isActive={featureIndex === selectedIndex}
                />
              ))}
            </Tab.List>
          </div>

          <div className="lg:col-span-7">
            <Tab.Panels>
              {features.map((feature, featureIndex) => (
                <Tab.Panel
                  static
                  key={feature.name}
                  className="relative"
                >
                  <FeatureImage
                    image={feature.image}
                    isActive={featureIndex === selectedIndex}
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </div>
        </div>
      )}
    </Tab.Group>
  );
};