import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Quote, CarDetails } from "@/types/quotes";
import { useToast } from "./use-toast";

// Type guard to validate car details
const isValidCarDetails = (details: any): details is CarDetails => {
  return (
    details &&
    typeof details === "object" &&
    "year" in details &&
    typeof details.year === "number" &&
    "make" in details &&
    typeof details.make === "string" &&
    "model" in details &&
    typeof details.model === "string"
  );
};

export const useQuotes = (userId: string | undefined) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["quotes", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("quotes")
        .select(
          `
          *,
          dealer_quotes (
            *,
            dealer_profile:dealer_profiles(*)
          )
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching quotes",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Transform the raw data to match the Quote type
      const transformedQuotes: Quote[] = data
        .map((quote: any) => {
          // Validate car_details
          if (!isValidCarDetails(quote.car_details)) {
            console.error("Invalid car details format:", quote.car_details);
            return null;
          }

          return {
            id: quote.id,
            car_details: quote.car_details as CarDetails,
            dealer_quotes: quote.dealer_quotes.map((dq: any) => ({
              id: dq.id,
              dealer_id: dq.dealer_id,
              status: dq.status,
              response_status: dq.response_status,
              response_date: dq.response_date,
              response_notes: dq.response_notes,
              is_accepted: dq.is_accepted,
              created_at: dq.created_at,
              dealer_profile: dq.dealer_profile,
            })),
            status: quote.status,
            created_at: quote.created_at,
          };
        })
        .filter(Boolean) as Quote[]; // Filter out any null values from invalid car details

      return transformedQuotes;
    },
    enabled: !!userId,
  });
};
