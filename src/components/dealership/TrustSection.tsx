import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export const TrustSection = () => {
  const { t } = useTranslation('dealer');

  const metrics = [
    {
      title: t("trust.metrics.network.title"),
      value: t("trust.metrics.network.value"),
      label: t("trust.metrics.network.label")
    },
    {
      title: t("trust.metrics.success.title"),
      value: t("trust.metrics.success.value"),
      label: t("trust.metrics.success.label")
    },
    {
      title: t("trust.metrics.value.title"),
      value: t("trust.metrics.value.value"),
      label: t("trust.metrics.value.label")
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("trust.title")}
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