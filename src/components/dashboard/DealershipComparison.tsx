import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";

interface DealerPerformance {
  dealer_name: string;
  conversion_rate: number;
  total_revenue: number;
  response_time: number;
  period: string;
}

export const DealershipComparison = () => {
  const { t } = useTranslation('admin');

  const { data: dealerPerformance } = useQuery({
    queryKey: ['dealer-performance-comparison'],
    queryFn: async () => {
      const { data: dealerProfiles } = await supabase
        .from('dealer_profiles')
        .select('id, dealer_name')
        .eq('active', true);

      if (!dealerProfiles) return [];

      const performanceData: DealerPerformance[] = [];
      
      for (const dealer of dealerProfiles) {
        const { data: analytics } = await supabase
          .from('dealer_analytics')
          .select('*')
          .eq('dealer_id', dealer.id)
          .order('period_start', { ascending: true })
          .limit(6);

        if (analytics) {
          analytics.forEach(record => {
            performanceData.push({
              dealer_name: dealer.dealer_name,
              conversion_rate: record.conversion_rate || 0,
              total_revenue: record.total_revenue || 0,
              response_time: record.quote_response_time ? 
                typeof record.quote_response_time === 'string' ? 
                  parseInt(record.quote_response_time.split(':')[1]) : 0 
                : 0,
              period: new Date(record.period_start).toLocaleDateString('en-US', { 
                month: 'short',
                year: 'numeric'
              })
            });
          });
        }
      }

      return performanceData;
    }
  });

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Dealership Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dealerPerformance}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="period" className="text-muted-foreground" />
              <YAxis yAxisId="left" className="text-muted-foreground" />
              <YAxis yAxisId="right" orientation="right" className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="conversion_rate"
                name="Conversion Rate (%)"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="total_revenue"
                name="Revenue ($)"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="response_time"
                name="Response Time (min)"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};