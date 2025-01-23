import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Quote, CarDetails } from "@/types/quotes";
import { QuoteHeader } from "./quotes/QuoteHeader";
import { DealerQuoteItem } from "./quotes/DealerQuoteItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentCalculator from "./financial/PaymentCalculator";
import LoanPreApproval from "./financial/LoanPreApproval";
import InsuranceQuote from "./financial/InsuranceQuote";
import { Badge } from "./ui/badge";
import { Calendar, Car, DollarSign, MessageSquare } from "lucide-react";

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
          dealer_profile: dq.dealer_profile,
          created_at: dq.created_at,
          status: dq.status
        })),
        status: data.status,
        created_at: data.created_at
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
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-white shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Car className="h-6 w-6 text-primary" />
                {quote.car_details.year} {quote.car_details.make} {quote.car_details.model}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(quote.created_at).toLocaleDateString()}
                </span>
                <Badge variant={quote.status === 'pending' ? 'secondary' : 'default'}>
                  {quote.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="quotes" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Quotes
              </TabsTrigger>
              <TabsTrigger value="calculator" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Calculator
              </TabsTrigger>
              <TabsTrigger value="loan">Loan Pre-Approval</TabsTrigger>
              <TabsTrigger value="insurance">Insurance Quote</TabsTrigger>
            </TabsList>

            <TabsContent value="quotes">
              <div className="grid gap-6">
                {quote.dealer_quotes?.map((dealerQuote) => (
                  <Card key={dealerQuote.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <DealerQuoteItem 
                        dealerQuote={dealerQuote}
                        quoteId={quote.id}
                      />
                    </CardContent>
                  </Card>
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