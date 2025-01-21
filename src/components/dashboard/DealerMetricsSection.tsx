import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "../ui/card";
import { MetricsCard } from "./MetricsCard";
import { useToast } from "@/hooks/use-toast";

interface DealerStats {
  active_quotes_count: number;
  quote_change: number;
  won_bids_count: number;
  total_revenue: number;
  recent_quotes: Array<{
    id: string;
    car_details: Record<string, any>;
    has_trade_in: boolean;
    created_at: string;
  }>;
}

export const DealerMetricsSection = () => {
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dealer-stats'],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error("Not authenticated");

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
      
      // Since the function returns a single row array, we take the first element
      return data[0] as DealerStats;
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

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricsCard
        title="Active Quotes"
        value={stats?.active_quotes_count || 0}
        description={`${stats?.quote_change || 0}% from last month`}
      />
      <MetricsCard
        title="Won Bids"
        value={stats?.won_bids_count || 0}
      />
      <MetricsCard
        title="Total Revenue"
        value={stats?.total_revenue || 0}
        prefix="$"
      />
    </div>
  );
};