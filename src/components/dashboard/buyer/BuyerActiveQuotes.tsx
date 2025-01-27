import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Quote, CarDetails, DealerQuote } from "@/types/quotes";
import MyQuotesEmptyState from "@/components/dashboard/MyQuotesEmptyState";

interface QuoteWithDealers extends Quote {
  dealer_quotes: (DealerQuote & { dealer_profiles: { dealer_name: string } })[];
}

const BuyerActiveQuotes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    data: quotes,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["active-buyer-quotes"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error: supabaseError } = await supabase
        .from("quotes")
        .select(
          `
                    id,
                    status,
                    created_at,
                    car_details,
                    dealer_quotes (
                        id,
                        dealer_id,
                        status,
                        is_accepted,
                        created_at,
                        dealer_profiles (
                            dealer_name
                        )
                    )
                `,
        )
        .eq("user_id", user.id);

      if (supabaseError) {
        console.error("Supabase error fetching active quotes:", supabaseError);
        throw supabaseError;
      }

      return data
        ?.map((quote) => {
          // Validate car_details before type assertion
          const carDetails = quote.car_details as Record<string, any>;
          if (
            !carDetails ||
            typeof carDetails.year !== "number" ||
            typeof carDetails.make !== "string" ||
            typeof carDetails.model !== "string"
          ) {
            console.error("Invalid car details format:", carDetails);
            return null;
          }

          return {
            ...quote,
            car_details: carDetails as CarDetails,
            dealer_quotes: quote.dealer_quotes.map((dq) => ({
              ...dq,
              is_accepted: dq.is_accepted || false,
            })),
          };
        })
        .filter(Boolean) as QuoteWithDealers[];
    },
    meta: {
      errorMessage: "Error fetching quotes",
    },
  });

  if (isLoading) {
    return <div>Loading quotes...</div>;
  }

  if (isError) {
    return (
      <div>
        <p>Error loading quotes: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  if (!quotes || quotes.length === 0) {
    return <MyQuotesEmptyState />;
  }

  return (
    <div>
      {quotes.map((quote) => (
        <div key={quote.id}>
          <h3>
            {quote.car_details.year} {quote.car_details.make}{" "}
            {quote.car_details.model}
          </h3>
          <p>Status: {quote.status}</p>
          {quote.dealer_quotes.map((dealerQuote) => (
            <div key={dealerQuote.id}>
              <p>Dealer: {dealerQuote.dealer_profiles.dealer_name}</p>
              <p>Quote Status: {dealerQuote.status}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BuyerActiveQuotes;
