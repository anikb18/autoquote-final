import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PerformanceChart from "./dashboard/PerformanceChart";
import { DealerMetricsSection } from "./dashboard/DealerMetricsSection";
import { DealerQuotesTable } from "./dashboard/DealerQuotesTable";

const DealerDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>();

  const { data: dealerAnalytics, isLoading: isAnalyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['dealer-analytics', dateRange],
    queryFn: async () => {
      const query = supabase
        .from('dealer_analytics')
        .select('*')
        .eq('dealer_id', (await supabase.auth.getUser()).data.user?.id)
        .order('period_start', { ascending: false })
        .limit(6);

      if (dateRange?.from) {
        query.gte('period_start', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query.lte('period_end', dateRange.to.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  if (isAnalyticsLoading) {
    return <div>Loading...</div>;
  }

  if (analyticsError) {
    return (
      <div className="p-4 text-red-500">
        Error loading dashboard data. Please try again later.
      </div>
    );
  }

  const performanceData = dealerAnalytics?.map(metric => ({
    period: new Date(metric.period_start).toLocaleDateString(),
    conversionRate: metric.conversion_rate || 0,
    responseTime: metric.quote_response_time ? 
      typeof metric.quote_response_time === 'string' ? 
        parseFloat(metric.quote_response_time.split(':')[0]) : 
        Number(metric.quote_response_time) : 0,
    revenue: metric.total_revenue || 0
  })) || [];

  return (
    <div className="space-y-6">
      <DealerMetricsSection />
      <PerformanceChart 
        data={performanceData}
        onDateRangeChange={setDateRange}
      />
      <DealerQuotesTable />
    </div>
  );
};

export default DealerDashboard;