import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const BuyerCarListings = () => {
  const { t } = useTranslation();
  
  const { data: auctions, isLoading } = useQuery({
    queryKey: ['buyer-auctions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.myListings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('auctions.vehicle')}</TableHead>
              <TableHead>{t('auctions.currentPrice')}</TableHead>
              <TableHead>{t('auctions.timeLeft')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auctions?.map((auction) => (
              <TableRow key={auction.id}>
                <TableCell>{auction.vehicle_details?.make} {auction.vehicle_details?.model}</TableCell>
                <TableCell>${auction.current_price || auction.start_price}</TableCell>
                <TableCell>
                  {new Date(auction.enddate) > new Date() 
                    ? new Date(auction.enddate).toLocaleString()
                    : t('auctions.ended')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};