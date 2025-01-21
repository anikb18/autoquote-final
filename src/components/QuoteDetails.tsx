import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import ChatInterface from "./ChatInterface";

const QuoteDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: quote, isLoading } = useQuery({
    queryKey: ['quote-details', id],
    queryFn: async () => {
      if (!id) throw new Error('Quote ID is required');
      
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          dealer_quotes(
            *,
            dealer:dealer_id(
              dealer_profiles(*)
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!quote) {
    return <div>Quote not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {quote.car_details.year} {quote.car_details.make} {quote.car_details.model}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quote.dealer_quotes?.map((dealerQuote) => (
              <div key={dealerQuote.id} className="border-t pt-4">
                <h3 className="font-semibold">
                  {dealerQuote.dealer?.dealer_profiles?.[0]?.dealer_name}
                </h3>
                {dealerQuote.is_accepted && (
                  <ChatInterface
                    quoteId={quote.id}
                    dealerId={dealerQuote.dealer_id}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteDetails;