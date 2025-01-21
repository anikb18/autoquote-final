import { HeroSection } from "./dealership/HeroSection";
import { BenefitsSection } from "./dealership/BenefitsSection";
import { TrustSection } from "./dealership/TrustSection";
import { ContactForm } from "./dealership/ContactForm";

const DealershipLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <BenefitsSection />
      <TrustSection />
      <ContactForm />
    </div>
  );
};

export default DealershipLanding;