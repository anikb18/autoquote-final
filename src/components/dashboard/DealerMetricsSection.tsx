import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, ShoppingCart, Award, Clock } from "lucide-react";
import { MetricsOverview } from "./shared/MetricsOverview";

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
    return <div className="h-[200px] animate-pulse bg-muted rounded-lg" />;
  }

  const dealerStats = [
    {
      id: 1,
      name: "Active Quotes",
      stat: stats?.active_quotes_count || 0,
      icon: ShoppingCart,
      change: `${stats?.quote_change || 0}%`,
      changeType: (stats?.quote_change || 0) >= 0 ? 'increase' : 'decrease' as const
    },
    {
      id: 2,
      name: "Won Bids",
      stat: stats?.won_bids_count || 0,
      icon: Award,
      change: "+12.3%",
      changeType: 'increase' as const
    },
    {
      id: 3,
      name: "Total Revenue",
      stat: stats?.total_revenue || 0,
      icon: DollarSign,
      change: "+15.1%",
      changeType: 'increase' as const,
      prefix: "$"
    },
    {
      id: 4,
      name: "Response Time",
      stat: "2.4h",
      icon: Clock,
      change: "-10.3%",
      changeType: 'decrease' as const
    }
  ];

  return (
    <MetricsOverview 
      title="Dealership Performance" 
      stats={dealerStats}
    />
  );
};