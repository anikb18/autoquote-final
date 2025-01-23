import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, DollarSign, Building2, TrendingUp } from "lucide-react";

export const AdminMetricsCards = () => {
  const { t } = useTranslation('admin');

  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch metrics from your database
      const { data, error } = await supabase.rpc('get_admin_metrics');
      if (error) throw error;
      return data;
    }
  });

  const cards = [
    {
      title: t('metrics.totalSales.title'),
      value: metrics?.total_sales || 0,
      description: t('metrics.totalSales.description'),
      icon: DollarSign,
      prefix: t('metrics.totalSales.prefix')
    },
    {
      title: t('metrics.activeDealers.title'),
      value: metrics?.active_dealers || 0,
      description: t('metrics.activeDealers.description'),
      icon: Building2,
      prefix: t('metrics.activeDealers.prefix')
    },
    {
      title: t('metrics.totalUsers.title'),
      value: metrics?.total_users || 0,
      description: t('metrics.totalUsers.description'),
      icon: Users,
      prefix: t('metrics.totalUsers.prefix')
    },
    {
      title: t('metrics.conversionRate.title'),
      value: metrics?.conversion_rate || 0,
      description: t('metrics.conversionRate.description'),
      icon: TrendingUp,
      prefix: t('metrics.conversionRate.prefix'),
      suffix: '%'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.prefix}{card.value}{card.suffix}
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {card.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};