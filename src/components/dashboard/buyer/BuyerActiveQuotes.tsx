import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Quote, CarDetails, DealerQuote } from "@/types/quotes";
import MyQuotesEmptyState from "@/components/dashboard/MyQuotesEmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Calendar, DollarSign, MessageSquare } from "lucide-react";

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
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    toast({
      title: "Error loading quotes",
      description: error.message,
      variant: "destructive",
    });
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <p className="text-destructive">Error loading quotes: {error.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!quotes || quotes.length === 0) {
    return <MyQuotesEmptyState />;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {quotes.map((quote) => (
        <Card
          key={quote.id}
          className="w-full transition-all duration-200 hover:shadow-lg"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Car className="h-5 w-5 text-muted-foreground" />
              {quote.car_details.year} {quote.car_details.make}{" "}
              {quote.car_details.model}
            </CardTitle>
            <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created: {new Date(quote.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                Dealer Responses: {quote.dealer_quotes.length}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Best Offer: {quote.dealer_quotes.length > 0 ? "$XX,XXX" : "N/A"}
              </div>
            </div>

            <div className="space-y-3">
              {quote.dealer_quotes.map((dealerQuote) => (
                <div
                  key={dealerQuote.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">
                      {dealerQuote.dealer_profiles.dealer_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Response received:{" "}
                      {new Date(dealerQuote.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/quotes/${quote.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                className="w-full sm:w-auto"
                onClick={() => navigate(`/quotes/${quote.id}`)}
              >
                View Full Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BuyerActiveQuotes;