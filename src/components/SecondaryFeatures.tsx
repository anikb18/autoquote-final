import { useTranslation } from 'react-i18next';
import { Container } from './ui/container';
import { FeatureList } from './features/FeatureList';

const features = [
  {
    name: 'financing',
    summary: 'items.financing.title',
    description: 'items.financing.description',
    image: '/images/screenshots/leads.webp',
    icon: function InventoryIcon() {
      return (
        <svg aria-hidden="true" className="h-6 w-6 text-white" fill="none">
          <path
            opacity=".5"
            d="M8 17a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
            fill="currentColor"
          />
          <path
            opacity=".3"
            d="M8 24a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
            fill="currentColor"
          />
          <path
            d="M8 10a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
            fill="currentColor"
          />
        </svg>
      );
    },
  },
  {
    name: 'comparison',
    summary: 'items.comparison.title',
    description: 'items.comparison.description',
    image: '/images/screenshots/analytics.webp',
    icon: function ComparisonIcon() {
      return (
        <svg aria-hidden="true" className="h-6 w-6 text-white" fill="none">
          <path
            d="M12 2v20m0-20l-8 8m8-8l8 8m-8-8v20"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    },
  },
  {
    name: 'valuation',
    summary: 'items.valuation.title',
    description: 'items.valuation.description',
    image: '/images/screenshots/inventory.webp',
    icon: function ValuationIcon() {
      return (
        <svg aria-hidden="true" className="h-6 w-6 text-white" fill="none">
          <path
            d="M4 4h16v16H4V4zm0 0l8 8m-8-8l8 8"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    },
  },
];

export function SecondaryFeatures() {
  const { t } = useTranslation('features');

  return (
    <section
      id="secondary-features"
      aria-label="Advanced features for your car buying experience"
      className="pb-14 pt-20 sm:pb-20 sm:pt-32 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            {t('secondary.title')}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            {t('secondary.subtitle')}
          </p>
        </div>
        <FeatureList features={features} className="mt-16 md:mt-20" />
      </Container>
    </section>
  );
}
