import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import MetricsCard from "./MetricsCard";
import { Database } from "@/integrations/supabase/types";

type DealerStats = {
  active_quotes_count: number;
  quote_change: number;
  recent_quotes: {
    id: string;
    car_details: Database['public']['Tables']['quotes']['Row']['car_details'];
    has_trade_in?: boolean;
    created_at: string;
  }[];
  won_bids_count: number;
  total_revenue: number;
};

export const DealerMetricsSection = () => {
  const { toast } = useToast();

  const { data: dealerMetrics, isLoading, error } = useQuery<DealerStats>({
    queryKey: ['dealer-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('get_dealer_stats', { 
          p_dealer_id: user.id,
          p_subscription_type: 'premium'
        });
      
      if (error) {
        console.error('Error fetching dealer stats:', error);
        throw new Error('Failed to fetch dealer statistics');
      }
      if (!data?.[0]) throw new Error('No dealer statistics found');
      
      return data[0] as DealerStats;
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to load dealer metrics",
          variant: "destructive",
        });
      }
    }
  });

  if (isLoading) return <div>Loading metrics...</div>;
  if (error) return null;

  return (
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
  );
};