import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCarDetails } from "@/lib/utils";

export const BuyerActiveQuotes = () => {
  const { t } = useTranslation();
  
  const { data: quotes, isLoading } = useQuery({
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
            dealer_profiles (
              dealer_name
            )
          )
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.activeQuotes')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('quotes.carDetails')}</TableHead>
              <TableHead>{t('quotes.dealerResponses')}</TableHead>
              <TableHead>{t('quotes.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes?.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>{formatCarDetails(quote.car_details)}</TableCell>
                <TableCell>{quote.dealer_quotes?.length || 0}</TableCell>
                <TableCell>{t(`quotes.status.${quote.status}`)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};