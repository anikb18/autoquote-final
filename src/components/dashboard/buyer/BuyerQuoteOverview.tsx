import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Quote } from '@/types/quotes';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ChevronRight, Clock, MessageCircle } from 'lucide-react';

interface BuyerQuoteOverviewProps {
  activeQuote: Quote | null;
}

export const BuyerQuoteOverview = ({ activeQuote }: BuyerQuoteOverviewProps) => {
  const navigate = useNavigate();

  if (!activeQuote) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No active quote</AlertTitle>
        <AlertDescription>
          There is no active quote at the moment. Please submit a new quote request.
        </AlertDescription>
      </Alert>
    );
  }

  const latestDealerQuote = activeQuote.dealer_quotes
    .filter((dq) => dq.status === 'responded')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .at(0);

  const responseTime = latestDealerQuote
    ? formatDistanceToNow(new Date(latestDealerQuote.created_at), {
        addSuffix: true,
      })
    : '';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Active Quote</CardTitle>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {activeQuote.car_details.year} {activeQuote.car_details.make} {activeQuote.car_details.model}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Created {formatDistanceToNow(new Date(activeQuote.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>{activeQuote.dealer_quotes?.length || 0} dealer responses</span>
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
                    activeQuote.status === 'pending'
                      ? 'bg-yellow-500'
                      : activeQuote.status === 'in_progress'
                      ? 'bg-blue-500'
                      : 'bg-green-500'
                  } text-white`}
                >
                  {activeQuote.status === 'pending' ? (
                    <Clock className="h-4 w-4" />
                  ) : activeQuote.status === 'in_progress' ? (
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
                  {activeQuote.status === 'pending' ? 'Pending' : activeQuote.status === 'in_progress' ? 'In Progress' : 'Completed'}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={() => navigate(`/quotes/${activeQuote.id}`)}>View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};
