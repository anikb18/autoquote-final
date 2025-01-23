import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceChart, type PerformanceData } from "@/components/dashboard/PerformanceChart";

export default function RevenueAnalytics() {
  const { data: performanceData } = useQuery<PerformanceData[]>({
    queryKey: ['platform-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_transactions')
        .select(`
          transaction_date,
          selling_price,
          dealer_profiles!inner(subscription_type)
        `)
        .order('transaction_date', { ascending: true });

      if (error) throw error;

      // Process data for the chart - group by month
      const monthlyData = data.reduce((acc: Record<string, any>, curr) => {
        const month = new Date(curr.transaction_date).toLocaleString('default', { month: 'short' });
        
        if (!acc[month]) {
          acc[month] = {
            revenue: 0,
            conversionRate: 0,
            responseTime: 0,
            count: 0
          };
        }
        
        acc[month].revenue += curr.selling_price;
        acc[month].count += 1;
        
        return acc;
      }, {});

      // Convert to array format for the chart
      return Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
        period: month,
        revenue: data.revenue,
        conversionRate: ((data.count / 100) * 100).toFixed(1),
        responseTime: Math.random() * 24 // This should be replaced with actual response time data
      }));
    }
  });

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Platform Revenue</h2>
        <p className="text-muted-foreground mt-2">
          Overview of AutoQuote24's platform performance and revenue metrics
        </p>
      </div>

      <div className="grid gap-4">
        <PerformanceChart data={performanceData || []} />
      </div>
    </div>
  );
}