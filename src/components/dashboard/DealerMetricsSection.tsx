import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MetricsCard } from "./MetricsCard";
import { useToast } from "@/hooks/use-toast";

interface DealerStats {
  active_quotes_count: number;
  quote_change: number;
  won_bids_count: number;
  total_revenue: number;
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
      return data as DealerStats;
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
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