import { DealershipHeader } from "./dealership/DealershipHeader";
import { HeroSection } from "./dealership/HeroSection";
import { ProcessSection } from "./dealership/ProcessSection";
import { TrustSection } from "./dealership/TrustSection";
import Features from "./Features";
import SubscriptionPlans from "./SubscriptionPlans";

const DealershipLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      <DealershipHeader />
      <main>
        <HeroSection />
        <ProcessSection />
        <Features />
        <TrustSection />
        <SubscriptionPlans />
      </main>
    </div>
  );
};

export default DealershipLanding;