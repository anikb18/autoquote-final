import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types/quotes";

export const useQuotes = (userId: string | undefined) => {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ['quotes', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          dealer_quotes (
            *,
            dealer_profile:dealer_profiles(*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Quote[];
    },
    enabled: !!userId
  });

  return { quotes, isLoading };
};