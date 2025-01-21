import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCarDetails } from "@/lib/utils";
import CarViewer3D from "@/components/3d-viewer/CarViewer3D";

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
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data;
    },
  });

  const latestQuote = quotes?.[0];
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
                    <TableHead>{t('quotes.carDetails')}</TableHead>
                    <TableHead>{t('quotes.dealerResponses')}</TableHead>
                    <TableHead>{t('quotes.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{formatCarDetails(latestQuote.car_details)}</TableCell>
                    <TableCell>{latestQuote.dealer_quotes?.length || 0}</TableCell>
                    <TableCell>{t(`quotes.status.${latestQuote.status}`)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-1">
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