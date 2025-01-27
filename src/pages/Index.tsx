import { 
  Calendar, 
  Car, 
  CheckCircle2, 
  HeartHandshake, 
  LineChart, 
  PhoneCall, 
  ShieldCheck,
  Wallet 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { PrimaryFeatures } from "@/components/PrimaryFeatures";
import { SecondaryFeatures } from "@/components/SecondaryFeatures";
import { CallToAction } from "@/components/CallToAction";
import Pricing from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";

export default function Index() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Car,
      title: t("home.features.carSearch.title"),
      description: t("home.features.carSearch.description"),
    },
    {
      icon: Wallet,
      title: t("home.features.pricing.title"),
      description: t("home.features.pricing.description"),
    },
    {
      icon: HeartHandshake,
      title: t("home.features.dealerNetwork.title"),
      description: t("home.features.dealerNetwork.description"),
    },
    {
      icon: ShieldCheck,
      title: t("home.features.security.title"),
      description: t("home.features.security.description"),
    },
    {
      icon: Calendar,
      title: t("home.features.scheduling.title"),
      description: t("home.features.scheduling.description"),
    },
    {
      icon: LineChart,
      title: t("home.features.analytics.title"),
      description: t("home.features.analytics.description"),
    },
    {
      icon: CheckCircle2,
      title: t("home.features.quality.title"),
      description: t("home.features.quality.description"),
    },
    {
      icon: PhoneCall,
      title: t("home.features.support.title"),
      description: t("home.features.support.description"),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main>
        <Hero />
        <Features features={features} />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Pricing />
        <Testimonials />
      </main>
    </div>
  );
}