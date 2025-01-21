import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Quote } from "@/types/quotes";

interface BuyerQuoteOverviewProps {
  activeQuote: Quote | null;
}

export const BuyerQuoteOverview = ({ activeQuote }: BuyerQuoteOverviewProps) => {
  const navigate = useNavigate();

  if (!activeQuote) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Quote</CardTitle>
        <CardDescription>
          {activeQuote.car_details.year} {activeQuote.car_details.make} {activeQuote.car_details.model}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Dealer Responses: {activeQuote.dealer_quotes.length}</p>
            <p className="text-sm text-gray-500">Created: {new Date(activeQuote.created_at).toLocaleDateString()}</p>
          </div>
          <Button onClick={() => navigate(`/quotes/${activeQuote.id}`)}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};