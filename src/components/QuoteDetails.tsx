import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import ChatInterface from "./ChatInterface";

interface CarDetails {
  year: number;
  make: string;
  model: string;
}

interface DealerProfile {
  dealer_name: string;
}

interface Quote {
  id: string;
  car_details: CarDetails;
  dealer_quotes: Array<{
    id: string;
    dealer_id: string;
    is_accepted: boolean;
    dealer?: {
      dealer_profiles?: DealerProfile[];
    };
  }>;
}

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
      
      // Ensure car_details has the correct shape
      const carDetails = data?.car_details as CarDetails;
      if (!carDetails?.year || !carDetails?.make || !carDetails?.model) {
        throw new Error('Invalid car details format');
      }

      // Transform the data to match the Quote interface
      const transformedData: Quote = {
        id: data.id,
        car_details: carDetails,
        dealer_quotes: data.dealer_quotes.map((dq: any) => ({
          id: dq.id,
          dealer_id: dq.dealer_id,
          is_accepted: dq.is_accepted,
          dealer: dq.dealer ? {
            dealer_profiles: dq.dealer.dealer_profiles
          } : undefined
        }))
      };

      return transformedData;
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