import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MessageSquarePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { CarDetails, Quote, DealerQuote, DealerProfile } from "@/types/quotes"; // Import all types
import MyQuotesEmptyState from "@/components/dashboard/MyQuotesEmptyState"; // Import Empty State Component (if you created one)

interface QuoteWithDealers extends Quote {
  dealer_quotes: Array<DealerQuote & { dealer_profiles: DealerProfile }>;
}

export const BuyerActiveQuotes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: quotes, isLoading, isError, error, refetch } = useQuery<QuoteWithDealers[]>({
    queryKey: ['active-buyer-quotes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error: supabaseError } = await supabase
        .from('quotes')
        .select(`
          id,
          status,
          created_at,
          car_details,
          dealer_quotes (
            id,
            dealer_id,
            status,
            created_at,
            dealer_profiles (
              dealer_name
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active') // Optimized: Fetch only "active" quotes (adjust status value if needed)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error("Supabase error fetching active quotes:", supabaseError);
        throw supabaseError;
      }
      return (data as any as QuoteWithDealers[]) || [];
    },
    onError: (err) => {
      let message = "Error fetching quotes";
      if (err instanceof Error) {
        message = `${message}: ${err.message}`;
      }
      toast({
        title: "Error fetching quotes",
        description: message,
        variant: "destructive",
      });
    },
    // refetchInterval: 30000, // Optional: If you want to refetch periodically in the background
    // refetchOnWindowFocus: false, // Optional: Control refetching behavior on window focus
  });

  const handleQuoteResponse = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`); // Navigate to detailed quote page
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="p-6 text-center">
        <p className="text-destructive">Error loading quotes.</p>
        <Button onClick={() => refetch()} className="mt-4">Retry</Button>
      </Card>
    );
  }

  if (!quotes?.length) {
    return <MyQuotesEmptyState />; // Use the enhanced Empty State Component
  }

  const getExpirationTime = (createdAt: string) => {
    const created = new Date(createdAt);
    return new Date(created.getTime() + (24 * 60 * 60 * 1000));
  };

  return (
    <div className="space-y-4">
      {quotes.map((quote) => {
        const carDetails = quote.car_details as CarDetails;
        if (!carDetails) return null;

        return (
          <Card key={quote.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {carDetails.year} {carDetails.make} {carDetails.model}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Status: {quote.status}
                </p>
                <CountdownTimer
                  endDate={getExpirationTime(quote.created_at)}
                  onExpire={() => {
                    toast({
                      title: t("quotes.expiration.title"),
                      description: t("quotes.expiration.description"),
                      variant: "destructive",
                    });
                    refetch(); // Refetch quotes on expiration
                  }}
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleQuoteResponse(quote.id)}
              >
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                {quote.status === 'pending'
                  ? t("dealer.quotes.actions.respond")
                  : t("dealer.quotes.actions.view")
                }
              </Button>
            </div>
            {quote.dealer_quotes && quote.dealer_quotes.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-medium mb-2">Dealer Responses:</p>
                <div className="space-y-2">
                  {quote.dealer_quotes.map((dealerQuote) => (
                    <div key={dealerQuote.id} className="flex justify-between items-center">
                      <span className="text-sm">
                        {dealerQuote.dealer_profiles?.dealer_name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {dealerQuote.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default BuyerActiveQuotes;