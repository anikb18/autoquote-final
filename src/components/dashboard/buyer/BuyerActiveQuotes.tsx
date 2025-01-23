import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MessageSquarePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CountdownTimer } from "@/components/ui/countdown-timer";

export const BuyerActiveQuotes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ['active-quotes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          dealer_quotes (
            id,
            dealer_id,
            status,
            dealer_profiles (
              dealer_name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error fetching quotes",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const handleQuoteResponse = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!quotes?.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No active quotes found</p>
      </Card>
    );
  }

  // Calculate expiration time (24 hours from creation)
  const getExpirationTime = (createdAt: string) => {
    const created = new Date(createdAt);
    return new Date(created.getTime() + (24 * 60 * 60 * 1000));
  };

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <Card key={quote.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">
                {quote.car_details.year} {quote.car_details.make} {quote.car_details.model}
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
      ))}
    </div>
  );
};