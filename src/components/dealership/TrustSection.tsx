import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export const TrustSection = () => {
  const { t } = useTranslation();

  const metrics = [
    {
      title: t("dealer.trust.metrics.network.title"),
      value: t("dealer.trust.metrics.network.value"),
      label: t("dealer.trust.metrics.network.label")
    },
    {
      title: t("dealer.trust.metrics.success.title"),
      value: t("dealer.trust.metrics.success.value"),
      label: t("dealer.trust.metrics.success.label")
    },
    {
      title: t("dealer.trust.metrics.value.title"),
      value: t("dealer.trust.metrics.value.value"),
      label: t("dealer.trust.metrics.value.label")
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("dealer.trust.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader>
                <CardTitle>{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary mb-2">{metric.value}</p>
                <p className="text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};