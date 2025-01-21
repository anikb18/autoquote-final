import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface CarDetails {
  make?: string;
  model?: string;
  year?: number;
}

interface Quote {
  id: string;
  car_details: CarDetails;
  created_at: string;
  status: string;
  dealer_quotes: Array<{
    id: string;
    dealer_id: string;
    status: string;
    is_accepted: boolean;
  }>;
}

export const BuyerActiveQuotes = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ['buyer-quotes', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('quotes')
        .select('*, dealer_quotes(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Quote[];
    },
    enabled: !!user?.id, // Only run query when we have a user ID
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (!quotes?.length) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have any active quotes. Start by requesting a quote for your vehicle.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <Card key={quote.id}>
          <CardHeader>
            <CardTitle>
              {quote.car_details.year} {quote.car_details.make} {quote.car_details.model}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(quote.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Dealer responses: {quote.dealer_quotes?.length || 0}
                </p>
              </div>
              <Button onClick={() => navigate(`/quotes/${quote.id}`)}>
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};