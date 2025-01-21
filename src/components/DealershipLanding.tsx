import { DealershipHeader } from "./dealership/DealershipHeader";
import { HeroSection } from "./dealership/HeroSection";
import { TrustSection } from "./dealership/TrustSection";

const DealershipLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      <DealershipHeader />
      <main>
        <HeroSection />
        <TrustSection />
      </main>
    </div>
  );
};

export default DealershipLanding;