import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DealerMetricsSection } from "../dashboard/DealerMetricsSection";
import { DealerQuotesTable } from "../dashboard/DealerQuotesTable";
import { DealershipComparison } from "../dashboard/DealershipComparison";
import { useToast } from "@/hooks/use-toast";

export const DealershipOverview = () => {
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ['dealer-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dealer_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
  });

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dealership Overview</h1>
      <DealerMetricsSection />
      <DealerQuotesTable />
      <DealershipComparison />
    </div>
  );
};