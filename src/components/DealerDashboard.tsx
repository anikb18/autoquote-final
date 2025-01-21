import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ChatInterface from "./ChatInterface";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DealerDashboard = () => {
  const queryClient = useQueryClient();
  
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

  const { data: dealerMetrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['dealer-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .rpc('get_dealer_stats', { 
          p_dealer_id: user?.id,
          p_subscription_type: 'premium' // You might want to get this from user profile
        });
      
      if (error) throw error;
      return data?.[0];
    },
  });

  const { data: dealerAnalytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['dealer-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dealer_analytics')
        .select('*')
        .eq('dealer_id', (await supabase.auth.getUser()).data.user?.id)
        .order('period_start', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

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
        <Card>
          <CardHeader>
            <CardTitle>Active Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dealerMetrics?.active_quotes_count || 0}</div>
            <div className="text-sm text-muted-foreground">
              {dealerMetrics?.quote_change > 0 ? '+' : ''}{dealerMetrics?.quote_change || 0}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Won Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dealerMetrics?.won_bids_count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${dealerMetrics?.total_revenue?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="conversionRate" name="Conversion Rate (%)" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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