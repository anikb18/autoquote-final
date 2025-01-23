import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DealershipComparison } from "@/components/dashboard/DealershipComparison";
import { SalesTrendChart } from "@/components/dashboard/SalesTrendChart";
import { MetricsOverview } from "@/components/dashboard/shared/MetricsOverview";
import { DollarSign, TrendingUp, Users, Clock } from "lucide-react";

interface DealerMetrics {
  active_quotes_count: number;
  quote_change: number;
  recent_quotes: Array<{
    id: string;
    car_details: {
      make: string;
      model: string;
      year: number;
    };
    created_at: string;
  }>;
  won_bids_count: number;
  total_revenue: number;
}

interface MetricItem {
  id: number;
  name: string;
  stat: number | string;
  icon: typeof DollarSign | typeof TrendingUp | typeof Users | typeof Clock;
  change: string;
  changeType: "increase" | "decrease";
  prefix?: string;
}

export default function DealerAnalytics() {
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery<DealerMetrics, Error>({
    queryKey: ['dealer-stats'],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error('Not authenticated');

      const { data: dealerProfile } = await supabase
        .from('dealer_profiles')
        .select('subscription_type')
        .eq('id', profile.user.id)
        .single();

      if (!dealerProfile) throw new Error("Dealer profile not found");

      const { data, error } = await supabase.rpc(
        'get_dealer_stats',
        {
          p_dealer_id: profile.user.id,
          p_subscription_type: dealerProfile.subscription_type
        }
      );

      if (error) throw error;
      
      // Return first item since RPC returns an array with single item
      return data[0] as DealerMetrics;
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error fetching dealer stats",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const dealerStats: MetricItem[] = [
    {
      id: 1,
      name: "Active Quotes",
      stat: stats?.active_quotes_count || 0,
      icon: TrendingUp,
      change: `${stats?.quote_change || 0}%`,
      changeType: (stats?.quote_change || 0) >= 0 ? "increase" : "decrease"
    },
    {
      id: 2,
      name: "Won Bids",
      stat: stats?.won_bids_count || 0,
      icon: Users,
      change: "+12.3%",
      changeType: "increase"
    },
    {
      id: 3,
      name: "Total Revenue",
      stat: stats?.total_revenue || 0,
      icon: DollarSign,
      change: "+15.1%",
      changeType: "increase",
      prefix: "$"
    },
    {
      id: 4,
      name: "Response Time",
      stat: "2.4h",
      icon: Clock,
      change: "-10.3%",
      changeType: "decrease"
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Dealer Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              <MetricsOverview stats={dealerStats} />
              <SalesTrendChart />
              <DealershipComparison />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}