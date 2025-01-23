import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminMetrics {
  total_sales: number;
  active_dealers: number;
  total_users: number;
  conversion_rate: number;
}

export const AdminMetricsCards = () => {
  const { t } = useTranslation('admin');

  const { data: metrics } = useQuery<AdminMetrics>({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_metrics');
      if (error) throw error;
      return data as AdminMetrics;
    }
  });

  const metricItems = [
    {
      title: t('metrics.totalSales.title'),
      value: metrics?.total_sales || 0,
      description: t('metrics.totalSales.description'),
      prefix: t('metrics.totalSales.prefix')
    },
    {
      title: t('metrics.activeDealers.title'),
      value: metrics?.active_dealers || 0,
      description: t('metrics.activeDealers.description'),
      prefix: t('metrics.activeDealers.prefix')
    },
    {
      title: t('metrics.totalUsers.title'),
      value: metrics?.total_users || 0,
      description: t('metrics.totalUsers.description'),
      prefix: t('metrics.totalUsers.prefix')
    },
    {
      title: t('metrics.conversionRate.title'),
      value: metrics?.conversion_rate || 0,
      description: t('metrics.conversionRate.description'),
      prefix: t('metrics.conversionRate.prefix'),
      suffix: '%'
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metricItems.map((item) => (
        <div 
          key={item.title}
          className="p-6 bg-background/50 backdrop-blur-xl border rounded-lg shadow-sm hover:bg-background/60 transition-colors"
        >
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {item.title}
            </h3>
            <p className="text-2xl font-bold">
              {item.prefix}{item.value}{item.suffix}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};