import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatInterface from "@/components/ChatInterface";
import { DealerQuoteItem } from "@/components/quotes/DealerQuoteItem";
import { useTranslation } from "react-i18next";

interface CarDetails {
  year: string;
  make: string;
  model: string;
  [key: string]: any;
}

interface Quote {
  id: string;
  car_details: CarDetails;
  dealer_quotes: Array<{
    dealer_id: string;
    dealer_profile: {
      dealer_name: string;
    };
    is_accepted: boolean;
  }>;
}

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
            dealer_id,
            dealer_profiles (
              dealer_name
            )
          )
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      return data;
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
                key={dealerQuote.dealer_id}
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
