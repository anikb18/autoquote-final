import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ChevronRight, Clock, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Quote {
  id: string;
  car_details: {
    make?: string;
    model?: string;
    year?: number;
  };
  created_at: string;
  status: 'pending' | 'in_progress' | 'completed';
  dealer_quotes: Array<{
    id: string;
    dealer_id: string;
    status: 'pending' | 'responded';
    response_notes: string | null;
    is_accepted: boolean;
    created_at: string;
    dealer_profile: {
      dealer_name: string;
    } | null;
  }>;
  amount?: number;
  dealerName?: string;
  responseTime?: string;
}

export const BuyerActiveQuotes = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const { data: quotes, isLoading, error } = useQuery({
    queryKey: ['buyer-quotes', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          dealer_quotes!quotes_dealer_quotes_id_fk (
            *,
            dealer_profile: dealer_profiles (
              dealer_name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type cast to inform TypeScript of the structure
      return data as unknown as Quote[];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error loading quotes</AlertTitle>
        <AlertDescription>
          {error.message || 'An error occurred while fetching your quotes.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!quotes?.length) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No active quotes</AlertTitle>
        <AlertDescription>
          You don't have any active quotes. Start by requesting a quote for your vehicle.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => {
        const latestDealerQuote = quote.dealer_quotes
          .filter((dq) => dq.status === 'responded')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .at(0);

        // Calculate the response time for the latest dealer quote
        const responseTime = latestDealerQuote
          ? formatDistanceToNow(new Date(latestDealerQuote.created_at), {
              addSuffix: true,
            })
          : '';

        return (
          <Card key={quote.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/quotes/${quote.id}`)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">
                {quote.car_details.year} {quote.car_details.make} {quote.car_details.model}
              </CardTitle>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Created {formatDistanceToNow(new Date(quote.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span>{quote.dealer_quotes?.length || 0} dealer responses</span>
                  </div>
                </div>

                {latestDealerQuote && (
                  <Badge variant="outline" className="text-sm">
                    Latest response: {responseTime}
                  </Badge>
                )}
              </div>

              {latestDealerQuote && (
                <div className="mt-4">
                  <h4 className="font-semibold">Latest Dealer Response:</h4>
                  <p className="text-sm">
                    {latestDealerQuote.response_notes || 'No additional notes provided.'}
                  </p>
                  <p className="text-sm mt-2">
                    From: <span className="font-medium">{latestDealerQuote.dealer_profile?.dealer_name || 'Unknown Dealer'}</span>
                  </p>
                </div>
              )}

              {/* Progress Tracker */}
              <div className="mt-4">
                <ul className="flex justify-between text-xs text-gray-500">
                  <li className="flex flex-col items-center">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        quote.status === 'pending' ? 'bg-yellow-500' : quote.status === 'in_progress' ? 'bg-blue-500' : 'bg-green-500'
                      } text-white`}
                    >
                      {quote.status === 'pending' ? (
                        <Clock className="h-4 w-4" />
                      ) : quote.status === 'in_progress' ? (
                        <MessageCircle className="h-4 w-4" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="mt-1">
                      {quote.status === 'pending' ? 'Pending' : quote.status === 'in_progress' ? 'In Progress' : 'Completed'}
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
