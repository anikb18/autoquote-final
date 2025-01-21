import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface Quote {
  id: string;
  car_details: {
    make: string;
    model: string;
    year: number;
  };
  status: string;
  created_at: string;
}

export const DealerQuotesTable = () => {
  const { toast } = useToast();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ['dealer-quotes'],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dealer_quotes')
        .select(`
          quote_id,
          quotes:quote_id (
            id,
            car_details,
            status,
            created_at
          )
        `)
        .eq('dealer_id', profile.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data.map(q => q.quotes) as Quote[];
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error fetching quotes",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const handleAcceptQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from('dealer_quotes')
        .update({ status: 'accepted' })
        .eq('quote_id', quoteId);

      if (error) throw error;

      toast({
        title: "Quote accepted",
        description: "You have successfully accepted the quote.",
      });
    } catch (error) {
      toast({
        title: "Error accepting quote",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recent Quotes</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes?.map((quote) => (
            <TableRow key={quote.id}>
              <TableCell>
                {quote.car_details.year} {quote.car_details.make} {quote.car_details.model}
              </TableCell>
              <TableCell>{quote.status}</TableCell>
              <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleAcceptQuote(quote.id)}
                  disabled={quote.status === 'accepted'}
                >
                  Accept
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};