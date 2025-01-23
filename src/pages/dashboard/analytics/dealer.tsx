import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DealershipComparison } from "@/components/dashboard/DealershipComparison";
import { SalesTrendChart } from "@/components/dashboard/SalesTrendChart";
import { MetricsOverview } from "@/components/dashboard/shared/MetricsOverview";
import { DollarSign, TrendingUp, Users, Clock } from "lucide-react";

interface RawDealerMetrics {
  total_bids: number;
  won_bids: number;
  total_revenue: number;
  average_response_time: string;
}

interface DealerMetrics {
  total_revenue: number;
  active_quotes: number;
  conversion_rate: number;
  avg_response_time: number;
  monthly_change: number;
}

export default function DealerAnalytics() {
  const { toast } = useToast();

  const { data: metrics, refetch } = useQuery<DealerMetrics, Error>({
    queryKey: ['dealer-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc<RawDealerMetrics>(
        'calculate_dealer_metrics',
        { 
          dealer_id: user.id,
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      );

      if (error) throw error;

      // Convert average_response_time from interval to hours
      const avgResponseHours = data[0]?.average_response_time 
        ? parseFloat(data[0].average_response_time.split(':')[0]) + 
          parseFloat(data[0].average_response_time.split(':')[1]) / 60
        : 0;

      // Calculate monthly change
      const monthlyChange = ((data[0]?.total_revenue || 0) - (data[1]?.total_revenue || 0)) / 
                           (data[1]?.total_revenue || 1) * 100;

      return {
        total_revenue: data[0]?.total_revenue || 0,
        active_quotes: data[0]?.total_bids || 0,
        conversion_rate: (data[0]?.won_bids / (data[0]?.total_bids || 1)) * 100 || 0,
        avg_response_time: avgResponseHours,
        monthly_change: monthlyChange
      };
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error fetching metrics",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('dealer-analytics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dealer_analytics'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const statsData = [
    {
      id: 1,
      name: "Total Revenue",
      stat: metrics?.total_revenue || 0,
      icon: DollarSign,
      change: `${(metrics?.monthly_change || 0).toFixed(1)}%`,
      changeType: (metrics?.monthly_change || 0) >= 0 ? "increase" as const : "decrease" as const,
      prefix: "$"
    },
    {
      id: 2,
      name: "Active Quotes",
      stat: metrics?.active_quotes || 0,
      icon: Users,
      change: "+12.3%",
      changeType: "increase" as const
    },
    {
      id: 3,
      name: "Conversion Rate",
      stat: `${(metrics?.conversion_rate || 0).toFixed(1)}%`,
      icon: TrendingUp,
      change: "+2.1%",
      changeType: "increase" as const
    },
    {
      id: 4,
      name: "Avg. Response Time",
      stat: `${(metrics?.avg_response_time || 0).toFixed(1)}h`,
      icon: Clock,
      change: "-10.3%",
      changeType: "decrease" as const
    }
  ];

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dealer Analytics</h2>
        <p className="text-muted-foreground mt-2">
          Overview of your dealership performance and metrics
        </p>
      </div>

      <MetricsOverview 
        title="Performance Overview" 
        stats={statsData}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesTrendChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <DealershipComparison />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
