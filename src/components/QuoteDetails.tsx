import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Quote, CarDetails } from "@/types/quotes";
import { QuoteHeader } from "./quotes/QuoteHeader";
import { DealerQuoteItem } from "./quotes/DealerQuoteItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentCalculator from "./financial/PaymentCalculator";
import LoanPreApproval from "./financial/LoanPreApproval";
import InsuranceQuote from "./financial/InsuranceQuote";

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
            dealer_profile:dealer_profiles(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      const rawCarDetails = data?.car_details as unknown;
      const carDetails = rawCarDetails as CarDetails;
      
      if (!carDetails?.year || !carDetails?.make || !carDetails?.model) {
        throw new Error('Invalid car details format');
      }

      const transformedData: Quote = {
        id: data.id,
        car_details: carDetails,
        dealer_quotes: data.dealer_quotes.map((dq: any) => ({
          id: dq.id,
          dealer_id: dq.dealer_id,
          is_accepted: dq.is_accepted,
          dealer_profile: dq.dealer_profile
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
        <QuoteHeader carDetails={quote.car_details} />
        <CardContent>
          <Tabs defaultValue="quotes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="calculator">Payment Calculator</TabsTrigger>
              <TabsTrigger value="loan">Loan Pre-Approval</TabsTrigger>
              <TabsTrigger value="insurance">Insurance Quote</TabsTrigger>
            </TabsList>

            <TabsContent value="quotes">
              <div className="space-y-4">
                {quote.dealer_quotes?.map((dealerQuote) => (
                  <DealerQuoteItem 
                    key={dealerQuote.id}
                    dealerQuote={dealerQuote}
                    quoteId={quote.id}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="calculator">
              <PaymentCalculator quoteId={quote.id} vehiclePrice={25000} />
            </TabsContent>

            <TabsContent value="loan">
              <LoanPreApproval quoteId={quote.id} />
            </TabsContent>

            <TabsContent value="insurance">
              <InsuranceQuote quoteId={quote.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteDetails;