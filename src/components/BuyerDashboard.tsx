import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import ChatInterface from "./ChatInterface";

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

  return (
    <div className="space-y-6">
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