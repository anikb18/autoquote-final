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

export default function DealerAnalytics() {
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery<DealerMetrics, Error>({
    queryKey: ['dealer-stats'],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('get_dealer_stats', {
        p_dealer_id: profile.user.id,
        p_subscription_type: 'premium'
      });

      if (error) throw error;
      return data;
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
              <MetricsOverview stats={stats} />
              <SalesTrendChart />
              <DealershipComparison />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
