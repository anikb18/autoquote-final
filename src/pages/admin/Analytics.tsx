import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DealershipComparison } from "@/components/dashboard/DealershipComparison";
import { SalesTrendChart } from "@/components/dashboard/SalesTrendChart";
import { AdminMetricsCards } from "@/components/dashboard/AdminMetricsCards";
import { useTranslation } from "react-i18next";

export default function AdminAnalytics() {
  const { t } = useTranslation("admin");
  const { toast } = useToast();

  const { data: performanceData } = useQuery({
    queryKey: ["platform-performance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales_transactions")
        .select(`
          transaction_date,
          selling_price,
          dealer_profiles!inner(subscription_type)
        `)
        .order("transaction_date", { ascending: true });

      if (error) {
        toast({
          title: "Error fetching performance data",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t("dashboard.analytics")}
        </h2>
        <p className="text-muted-foreground mt-2">
          {t("dashboard.analyticsDescription")}
        </p>
      </div>

      <AdminMetricsCards />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.salesTrend")}</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesTrendChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.dealershipComparison")}</CardTitle>
          </CardHeader>
          <CardContent>
            <DealershipComparison />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}