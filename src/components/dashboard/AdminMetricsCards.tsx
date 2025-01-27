import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, DollarSign, Building2, BarChart3 } from "lucide-react";
import { MetricsOverview } from "./shared/MetricsOverview";

interface AdminMetrics {
  total_sales: number;
  active_dealers: number;
  total_users: number;
  conversion_rate: number;
}

export const AdminMetricsCards = () => {
  const { t } = useTranslation("admin");

  const { data: metrics } = useQuery<AdminMetrics>({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_admin_metrics");
      if (error) throw error;
      return data as AdminMetrics;
    },
  });

  const stats = [
    {
      id: 1,
      name: t("metrics.totalSales.title"),
      stat: metrics?.total_sales || 0,
      icon: DollarSign,
      change: "+12.5%",
      changeType: "increase" as const,
      prefix: "$",
    },
    {
      id: 2,
      name: t("metrics.activeDealers.title"),
      stat: metrics?.active_dealers || 0,
      icon: Building2,
      change: "+15.1%",
      changeType: "increase" as const,
    },
    {
      id: 3,
      name: t("metrics.totalUsers.title"),
      stat: metrics?.total_users || 0,
      icon: Users,
      change: "+8.2%",
      changeType: "increase" as const,
    },
    {
      id: 4,
      name: t("metrics.conversionRate.title"),
      stat: metrics?.conversion_rate || 0,
      icon: BarChart3,
      change: "+3.2%",
      changeType: "increase" as const,
      suffix: "%",
    },
  ];

  return <MetricsOverview title={t("dashboard.overview")} stats={stats} />;
};
