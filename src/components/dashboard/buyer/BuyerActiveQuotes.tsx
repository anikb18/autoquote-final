import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCarDetails } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Check, Clock, X } from "lucide-react";
import CarViewer3D from "@/components/3d-viewer/CarViewer3D";

export const BuyerActiveQuotes = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const { data: quotes, isLoading, refetch } = useQuery({
    queryKey: ['buyer-active-quotes'],
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
            response_status,
            response_date,
            response_notes,
            dealer_profiles (
              dealer_name
            )
          )
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handleQuoteResponse = async (dealerQuoteId: string, response: 'accept' | 'reject') => {
    try {
      const { error: updateError } = await supabase
        .from('dealer_quotes')
        .update({
          response_status: response,
          response_date: new Date().toISOString(),
          is_accepted: response === 'accept'
        })
        .eq('id', dealerQuoteId);

      if (updateError) throw updateError;

      const { error: responseError } = await supabase
        .from('quote_responses')
        .insert({
          dealer_quote_id: dealerQuoteId,
          quote_id: quotes?.id,
          response_type: response,
        });

      if (responseError) throw responseError;

      toast({
        title: response === 'accept' ? "Quote Accepted" : "Quote Rejected",
        description: response === 'accept' 
          ? "You've accepted the quote. The dealer will be notified."
          : "You've rejected the quote. The dealer will be notified.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accept':
        return <Check className="text-green-500" />;
      case 'reject':
        return <X className="text-red-500" />;
      default:
        return <Clock className="text-yellow-500" />;
    }
  };

  const latestQuote = quotes;
  const carDetails = latestQuote?.car_details;

  return (
    <div className="space-y-6">
      {latestQuote && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{t('dashboard.activeQuotes')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dealer</TableHead>
                    <TableHead>Car Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestQuote.dealer_quotes?.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>{quote.dealer_profiles?.dealer_name}</TableCell>
                      <TableCell>{formatCarDetails(latestQuote.car_details)}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {getStatusIcon(quote.response_status)}
                        {quote.response_status}
                      </TableCell>
                      <TableCell>
                        {quote.response_status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleQuoteResponse(quote.id, 'accept')}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleQuoteResponse(quote.id, 'reject')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-1 h-[400px]">
            <CarViewer3D 
              carDetails={carDetails} 
              showHotspots={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};