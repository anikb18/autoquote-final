import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ChatInterface from "./ChatInterface";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import MetricsCard from "./dashboard/MetricsCard";
import PerformanceChart from "./dashboard/PerformanceChart";
import { Database } from "@/integrations/supabase/types";

type DealerStats = {
  active_quotes_count: number;
  quote_change: number;
  recent_quotes: any[];
  won_bids_count: number;
  total_revenue: number;
};

const DealerDashboard = () => {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<DateRange>();
  
  const { data: dealerQuotes, isLoading: isQuotesLoading } = useQuery({
    queryKey: ['dealer-quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dealer_quotes')
        .select(`
          *,
          quotes (
            car_details,
            has_trade_in,
            status,
            user_id
          )
        `)
        .eq('dealer_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: dealerMetrics, isLoading: isMetricsLoading } = useQuery<DealerStats>({
    queryKey: ['dealer-metrics', dateRange],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .rpc('get_dealer_stats', { 
          p_dealer_id: user?.id,
          p_subscription_type: 'premium'
        });
      
      if (error) throw error;
      return data?.[0] as DealerStats;
    },
  });

  const { data: dealerAnalytics, isLoading: isAnalyticsLoading } = useQuery({
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

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('dealer-analytics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dealer_analytics'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          queryClient.invalidateQueries({ queryKey: ['dealer-analytics'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const acceptQuote = useMutation({
    mutationFn: async (quoteId: string) => {
      const { data, error } = await supabase
        .from('dealer_quotes')
        .update({ is_accepted: true })
        .eq('quote_id', quoteId)
        .eq('dealer_id', (await supabase.auth.getUser()).data.user?.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-quotes'] });
    },
  });

  if (isQuotesLoading || isMetricsLoading || isAnalyticsLoading) return <div>Loading...</div>;

  const performanceData = dealerAnalytics?.map(metric => ({
    period: new Date(metric.period_start).toLocaleDateString(),
    conversionRate: metric.conversion_rate || 0,
    responseTime: metric.quote_response_time ? 
      typeof metric.quote_response_time === 'string' ? 
        parseFloat(metric.quote_response_time.split(':')[0]) : 
        metric.quote_response_time : 0,
    revenue: metric.total_revenue || 0
  })) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricsCard
          title="Active Quotes"
          value={dealerMetrics?.active_quotes_count || 0}
          change={dealerMetrics?.quote_change}
        />
        <MetricsCard
          title="Won Bids"
          value={dealerMetrics?.won_bids_count || 0}
        />
        <MetricsCard
          title="Total Revenue"
          value={`$${dealerMetrics?.total_revenue?.toLocaleString() || 0}`}
        />
      </div>

      <PerformanceChart 
        data={performanceData}
        onDateRangeChange={setDateRange}
      />

      <Card>
        <CardHeader>
          <CardTitle>Active Quote Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car Details</TableHead>
                <TableHead>Trade-In</TableHead>
                <TableHead>Quote Status</TableHead>
                <TableHead>Your Response Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dealerQuotes?.map((dealerQuote) => (
                <>
                  <TableRow key={dealerQuote.id}>
                    <TableCell>{JSON.stringify(dealerQuote.quotes?.car_details)}</TableCell>
                    <TableCell>{dealerQuote.quotes?.has_trade_in ? "Yes" : "No"}</TableCell>
                    <TableCell>{dealerQuote.quotes?.status}</TableCell>
                    <TableCell>{dealerQuote.status}</TableCell>
                    <TableCell>
                      {!dealerQuote.is_accepted && (
                        <Button 
                          onClick={() => acceptQuote.mutate(dealerQuote.quote_id!)}
                          size="sm"
                        >
                          Accept Quote
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  {dealerQuote.is_accepted && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-4">
                        <ChatInterface 
                          quoteId={dealerQuote.quote_id!} 
                          dealerId={(dealerQuote.quotes?.user_id as string)}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerDashboard;