import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceChart, type PerformanceData } from "@/components/dashboard/PerformanceChart";

export default function RevenueAnalytics() {
  const { data: performanceData } = useQuery<PerformanceData[]>({
    queryKey: ['platform-performance'],
    queryFn: async (): Promise<PerformanceData[]> => {
      // Fetch sales transactions data
      const { data: salesData, error: salesError } = await supabase
        .from('sales_transactions')
        .select(`
          transaction_date,
          selling_price,
          dealer_profiles!inner(subscription_type)
        `)
        .order('transaction_date', { ascending: true });

      if (salesError) throw salesError;

      // Fetch dealer quotes data for conversion tracking
      const { data: quotesData, error: quotesError } = await supabase
        .from('dealer_quotes')
        .select('created_at, is_accepted')
        .order('created_at', { ascending: true });

      if (quotesError) throw quotesError;

      // Process data for the chart - group by month
      const monthlyData = salesData.reduce((acc: Record<string, any>, curr) => {
        const month = new Date(curr.transaction_date).toLocaleString('default', { month: 'short' });
        
        if (!acc[month]) {
          acc[month] = {
            revenue: 0,
            subscriptionRevenue: 0,
            quoteRevenue: 0,
            conversionRate: 0,
            responseTime: 0,
            totalQuotes: 0,
            acceptedQuotes: 0
          };
        }
        
        // Track revenue by type
        if (curr.dealer_profiles.subscription_type === 'premium') {
          acc[month].subscriptionRevenue += 1895; // Premium subscription fee
        } else {
          acc[month].subscriptionRevenue += 1595; // Basic subscription fee
        }
        acc[month].quoteRevenue += curr.selling_price;
        
        return acc;
      }, {});

      // Calculate conversion rates from quotes data
      quotesData.forEach((quote) => {
        const month = new Date(quote.created_at).toLocaleString('default', { month: 'short' });
        if (monthlyData[month]) {
          monthlyData[month].totalQuotes += 1;
          if (quote.is_accepted) {
            monthlyData[month].acceptedQuotes += 1;
          }
        }
      });

      // Convert to array format for the chart
      return Object.entries(monthlyData).map(([month, data]: [string, any]): PerformanceData => ({
        period: month,
        revenue: data.quoteRevenue + data.subscriptionRevenue,
        subscriptionRevenue: data.subscriptionRevenue,
        quoteRevenue: data.quoteRevenue,
        conversionRate: data.totalQuotes > 0 
          ? Number((data.acceptedQuotes / data.totalQuotes) * 100)
          : 0,
        responseTime: 0 // This would need actual response time data
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