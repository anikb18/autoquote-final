import { Container } from '@/components/ui/container';
import { PricingHeader } from './pricing/PricingHeader';
import { PricingCard } from './pricing/PricingCard';

const Pricing = () => {
  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="bg-slate-900 py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <Container className="px-4 sm:px-6 lg:px-8">
        <PricingHeader />
        <div className="mt-10 sm:mt-12 md:mt-16 grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          <PricingCard type="newCar" />
          <PricingCard type="tradeIn" isFeatured />
        </div>
      </Container>
    </section>
  );
};

export default Pricing;