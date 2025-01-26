import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Shield, Users, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

export const BenefitsSection = () => {
  const { t } = useTranslation('dealer');

  const benefits = [
    {
      icon: BarChart3,
      title: t("benefits.bidding.title"),
      description: t("benefits.bidding.description")
    },
    {
      icon: Shield,
      title: t("benefits.verification.title"),
      description: t("benefits.verification.description")
    },
    {
      icon: Users,
      title: t("benefits.automation.title"),
      description: t("benefits.automation.description")
    },
    {
      icon: Calendar,
      title: t("benefits.support.title"),
      description: t("benefits.support.description")
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
