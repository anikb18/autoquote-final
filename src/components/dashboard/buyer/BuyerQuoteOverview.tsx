import { Quote } from "@/types/quotes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BuyerQuoteOverviewProps {
  activeQuote: Quote;
}

export const BuyerQuoteOverview = ({
  activeQuote,
}: BuyerQuoteOverviewProps) => {
  const totalDealerQuotes = activeQuote.dealer_quotes.length;
  const acceptedQuotes = activeQuote.dealer_quotes.filter(
    (q) => q.is_accepted,
  ).length;
  const pendingQuotes = activeQuote.dealer_quotes.filter(
    (q) => !q.is_accepted,
  ).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalDealerQuotes}</div>
              <div className="text-sm text-muted-foreground">Total Quotes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{acceptedQuotes}</div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{pendingQuotes}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Dealer Responses</h3>
        {activeQuote.dealer_quotes.map((quote) => (
          <div
            key={quote.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <p className="font-medium">
                {quote.dealer_profiles?.dealer_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(quote.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={quote.is_accepted ? "success" : "secondary"}>
              {quote.is_accepted ? "Accepted" : "Pending"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
