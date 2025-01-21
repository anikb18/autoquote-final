import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatInterface from "../ChatInterface";

export const DealerQuotesTable = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: dealerQuotes, isLoading, error } = useQuery({
    queryKey: ['dealer-quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dealer_quotes')
        .select(`
          *,
          quotes (
            car_details,
            has_trade_in,
            status,
            user_id
          )
        `)
        .eq('dealer_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      return data;
    },
  });

  const acceptQuote = useMutation({
    mutationFn: async (quoteId: string) => {
      const { data, error } = await supabase
        .from('dealer_quotes')
        .update({ is_accepted: true })
        .eq('quote_id', quoteId)
        .eq('dealer_id', (await supabase.auth.getUser()).data.user?.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-quotes'] });
      toast({
        title: "Success",
        description: "Quote accepted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to accept quote",
        variant: "destructive",
      });
    },
  });

  if (isLoading) return <div>Loading quotes...</div>;
  if (error) return <div className="text-red-500">Error loading quotes</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Quote Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car Details</TableHead>
              <TableHead>Trade-In</TableHead>
              <TableHead>Quote Status</TableHead>
              <TableHead>Your Response Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dealerQuotes?.map((dealerQuote) => (
              <>
                <TableRow key={dealerQuote.id}>
                  <TableCell>{JSON.stringify(dealerQuote.quotes?.car_details)}</TableCell>
                  <TableCell>{dealerQuote.quotes?.has_trade_in ? "Yes" : "No"}</TableCell>
                  <TableCell>{dealerQuote.quotes?.status}</TableCell>
                  <TableCell>{dealerQuote.status}</TableCell>
                  <TableCell>
                    {!dealerQuote.is_accepted && (
                      <Button 
                        onClick={() => acceptQuote.mutate(dealerQuote.quote_id!)}
                        size="sm"
                      >
                        Accept Quote
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
                {dealerQuote.is_accepted && (
                  <TableRow>
                    <TableCell colSpan={5} className="p-4">
                      <ChatInterface 
                        quoteId={dealerQuote.quote_id!} 
                        dealerId={(dealerQuote.quotes?.user_id as string)}
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
  );
};