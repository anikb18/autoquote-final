import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatInterface from "@/components/ChatInterface";
import { DealerQuoteItem } from "@/components/quotes/DealerQuoteItem";
import { useTranslation } from "react-i18next";
import { CarDetails, Quote, DealerQuote } from "@/types/quotes";

const BuyerCarListings = () => {
  const { t } = useTranslation();
  const { data: quotes, isLoading } = useQuery({
    queryKey: ['buyer-quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          id,
          car_details,
          dealer_quotes!inner (
            id,
            dealer_id,
            created_at,
            dealer_profiles (
              dealer_name
            )
          )
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;

      return data.map((quote): Quote => ({
        id: quote.id,
        car_details: quote.car_details as CarDetails,
        dealer_quotes: quote.dealer_quotes.map((dq): DealerQuote => ({
          id: dq.id,
          dealer_id: dq.dealer_id,
          dealer_profile: dq.dealer_profiles,
          is_accepted: false,
          created_at: dq.created_at,
          status: 'pending',
        })),
        status: 'active',
        created_at: new Date().toISOString(),
      }));
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {quotes?.map((quote: Quote) => (
        <Card key={quote.id} className="p-4">
          <CardHeader>
            <CardTitle>
              {quote.car_details.year} {quote.car_details.make} {quote.car_details.model}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quote.dealer_quotes.map((dealerQuote) => (
              <DealerQuoteItem
                key={dealerQuote.id}
                dealerQuote={dealerQuote}
                quoteId={quote.id}
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BuyerCarListings;