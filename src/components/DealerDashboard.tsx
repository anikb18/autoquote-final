import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DealerMetricsSection } from "./dashboard/DealerMetricsSection";
import { DealerQuotesTable } from "./dashboard/DealerQuotesTable";
import { PerformanceChart, type PerformanceData } from "./dashboard/PerformanceChart";

const DealerDashboard = () => {
  const { data: performanceData } = useQuery({
    queryKey: ['dealer-performance'],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dealer_analytics')
        .select('*')
        .eq('dealer_id', profile.user.id)
        .order('period_start', { ascending: true });

      if (error) throw error;

      return data.map(record => ({
        period: new Date(record.period_start).toLocaleDateString('en-US', { month: 'short' }),
        conversionRate: record.conversion_rate || 0,
        responseTime: typeof record.quote_response_time === 'number' ? record.quote_response_time : 0,
        revenue: record.total_revenue || 0,
      })) as PerformanceData[];
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dealer Dashboard</h1>
      
      <DealerMetricsSection />
      
      <DealerQuotesTable />
      
      <PerformanceChart data={performanceData || []} />
    </div>
  );
};

export default DealerDashboard;