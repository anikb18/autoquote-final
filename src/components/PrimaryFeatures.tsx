import { useTranslation } from 'react-i18next';
import { Container } from './ui/container';
import { FeatureList } from './features/FeatureList';
import screenshotExpenses from '/images/expenses.png';
import screenshotPayroll from '/images/payroll.png';
import screenshotReporting from '/images/reporting.png';
import screenshotVatReturns from '/images/vat-returns.png';

const features = [
  {
    name: 'valuation',
    summary: 'items.valuation.title',
    description: 'items.valuation.description',
    image: screenshotPayroll,
    icon: function ReportingIcon() {
      return (
        <svg aria-hidden="true" className="h-6 w-6 text-white" fill="none">
          <path
            d="m30 15-4 5-4-11-4 18-4-11-4 7-4-5"
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
    name: 'time',
    summary: 'items.time.title',
    description: 'items.time.description',
    image: screenshotExpenses,
    icon: function TimeIcon() {
      return (
        <svg aria-hidden="true" className="h-6 w-6 text-white" fill="none">
          <path
            d="M12 2v10h10"
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
    name: 'prices',
    summary: 'items.prices.title',
    description: 'items.prices.description',
    image: screenshotVatReturns,
    icon: function PriceIcon() {
      return (
        <svg aria-hidden="true" className="h-6 w-6 text-white" fill="none">
          <path
            d="M2 12h20M2 6h20M2 18h20"
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
    name: 'communication',
    summary: 'items.communication.title',
    description: 'items.communication.description',
    image: screenshotReporting,
    icon: function CommunicationIcon() {
      return (
        <svg aria-hidden="true" className="h-6 w-6 text-white" fill="none">
          <path
            d="M12 2v10h10"
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

export function PrimaryFeatures() {
  const { t } = useTranslation('features');

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-blue-600 pb-28 pt-20 sm:py-32"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:translate-x-[-20%]">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 to-accent/90 opacity-90 mix-blend-multiply" />
      </div>
      
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">
            {t('subtitle')}
          </p>
        </div>
        <FeatureList features={features} className="mt-16 md:mt-20" />
      </Container>
    </section>
  );
}
