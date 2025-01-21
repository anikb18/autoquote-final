import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartBar, Shield, Users, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

export const BenefitsSection = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: ChartBar,
      title: t("dealer.benefits.bidding.title"),
      description: t("dealer.benefits.bidding.description")
    },
    {
      icon: Shield,
      title: t("dealer.benefits.verification.title"),
      description: t("dealer.benefits.verification.description")
    },
    {
      icon: Users,
      title: t("dealer.benefits.automation.title"),
      description: t("dealer.benefits.automation.description")
    },
    {
      icon: Calendar,
      title: t("dealer.benefits.support.title"),
      description: t("dealer.benefits.support.description")
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <Card key={benefit.title}>
              <CardHeader>
                <benefit.icon className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{benefit.title}</CardTitle>
                <CardDescription>{benefit.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};