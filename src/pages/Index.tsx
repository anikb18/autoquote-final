import { 
  Calendar, 
  Car, 
  CheckCircle2, 
  Handshake, 
  LineChart, 
  PhoneCall, 
  ShieldCheck,
  DollarSign,
  Users,
  Building,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Index() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Car,
      title: t("home.features.carComparison.title"),
      description: t("home.features.carComparison.description"),
    },
    {
      icon: DollarSign,
      title: t("home.features.pricing.title"),
      description: t("home.features.pricing.description"),
    },
    {
      icon: Handshake,
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
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  {t("home.hero.title")}
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  {t("home.hero.subtitle")}
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/get-started">
                  <Button size="lg">
                    {t("home.hero.cta")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              {features.map((feature, index) => (
                <Card key={index} className="p-6">
                  <feature.icon className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}