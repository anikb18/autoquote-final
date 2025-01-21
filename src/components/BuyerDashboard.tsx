import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import ChatInterface from "./ChatInterface";
import CarViewer3D from "./CarViewer3D";

interface CarDetails {
  make?: string;
  model?: string;
  year?: number;
}

const BuyerDashboard = () => {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ['buyer-quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          dealer_quotes (
            id,
            status,
            dealer_id,
            is_accepted,
            dealer_profiles (
              dealer_name
            )
          )
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const activeQuote = quotes?.find(quote => 
    quote.status === 'active' || 
    quote.dealer_quotes?.some(dq => dq.is_accepted)
  );

  const getCarDetails = (carDetails: any): CarDetails => {
    if (!carDetails) return {};
    
    // If it's a string, try to parse it
    if (typeof carDetails === 'string') {
      try {
        const parsed = JSON.parse(carDetails);
        return {
          make: parsed.make,
          model: parsed.model,
          year: parsed.year ? Number(parsed.year) : undefined
        };
      } catch {
        return {};
      }
    }
    
    // If it's already an object
    return {
      make: carDetails.make,
      model: carDetails.model,
      year: carDetails.year ? Number(carDetails.year) : undefined
    };
  };

  return (
    <div className="space-y-6">
      {activeQuote && (
        <Card>
          <CardHeader>
            <CardTitle>Your Vehicle Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <CarViewer3D 
              carDetails={getCarDetails(activeQuote.car_details)}
              showHotspots={activeQuote.status === 'active'}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>My Quote Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car Details</TableHead>
                <TableHead>Trade-In</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dealer Responses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes?.map((quote) => (
                <>
                  <TableRow key={quote.id}>
                    <TableCell>{JSON.stringify(quote.car_details)}</TableCell>
                    <TableCell>{quote.has_trade_in ? "Yes" : "No"}</TableCell>
                    <TableCell>{quote.status}</TableCell>
                    <TableCell>
                      {quote.dealer_quotes?.length || 0} responses
                    </TableCell>
                  </TableRow>
                  {quote.dealer_quotes?.some(dq => dq.is_accepted) && (
                    <TableRow>
                      <TableCell colSpan={4} className="p-4">
                        <ChatInterface 
                          quoteId={quote.id} 
                          dealerId={quote.dealer_quotes.find(dq => dq.is_accepted)?.dealer_id}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerDashboard;