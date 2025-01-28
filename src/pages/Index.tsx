
import { useTranslation } from "react-i18next";
import Hero from "@/components/Hero";
import { PrimaryFeatures } from "@/components/PrimaryFeatures";
import { SecondaryFeatures } from "@/components/SecondaryFeatures";
import { CallToAction } from "@/components/CallToAction";
import Pricing from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";

export default function Index() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Pricing />
        <Testimonials />
      </main>
    </div>
  );
}
