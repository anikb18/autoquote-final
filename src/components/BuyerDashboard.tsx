import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import ChatInterface from "./ChatInterface";
import CarViewer3D from "./3d-viewer/CarViewer3D";
import { Separator } from "./ui/separator";
import { Loader2 } from "lucide-react";

interface CarDetails {
  make?: string;
  model?: string;
  year?: number;
}

const BuyerDashboard = () => {
  const { t } = useTranslation();
  
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
      
      if (error) {
        console.error('Error fetching quotes:', error);
        throw error;
      }
      console.log('Fetched quotes:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const activeQuote = quotes?.find(quote => 
    quote.status === 'active' || 
    quote.dealer_quotes?.some(dq => dq.is_accepted)
  );

  const getCarDetails = (carDetails: any): CarDetails => {
    if (!carDetails) return {};
    
    try {
      const details = typeof carDetails === 'string' ? JSON.parse(carDetails) : carDetails;
      return {
        make: details.make,
        model: details.model,
        year: details.year ? Number(details.year) : undefined
      };
    } catch {
      console.error('Failed to parse car details:', carDetails);
      return {};
    }
  };

  const formatCarDetails = (carDetails: any): string => {
    try {
      const details = typeof carDetails === 'string' ? JSON.parse(carDetails) : carDetails;
      return `${details.year} ${details.make} ${details.model}`;
    } catch {
      return t('common.notAvailable');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">
        {t('dashboard.welcome')}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeQuote && (
          <Card className="col-span-1 lg:col-span-2 bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader>
              <CardTitle>{t('dashboard.vehiclePreview')}</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[400px]">
              <CarViewer3D 
                carDetails={getCarDetails(activeQuote.car_details)}
                showHotspots={activeQuote.status === 'active'}
              />
            </CardContent>
          </Card>
        )}

        <Card className="col-span-1 lg:col-span-2 bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('dashboard.quoteRequests')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('quotes.carDetails')}</TableHead>
                  <TableHead>{t('quotes.tradeIn')}</TableHead>
                  <TableHead>{t('quotes.status')}</TableHead>
                  <TableHead>{t('quotes.dealerResponses')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes?.map((quote) => (
                  <React.Fragment key={quote.id}>
                    <TableRow className="hover:bg-muted/50 transition-colors">
                      <TableCell>{formatCarDetails(quote.car_details)}</TableCell>
                      <TableCell>{quote.has_trade_in ? t('common.yes') : t('common.no')}</TableCell>
                      <TableCell>{t(`quotes.status.${quote.status}`)}</TableCell>
                      <TableCell>
                        {quote.dealer_quotes?.length || 0} {t('quotes.responses')}
                      </TableCell>
                    </TableRow>
                    {quote.dealer_quotes?.some(dq => dq.is_accepted) && (
                      <TableRow>
                        <TableCell colSpan={4} className="p-4 bg-muted/30">
                          <ChatInterface 
                            quoteId={quote.id} 
                            dealerId={quote.dealer_quotes.find(dq => dq.is_accepted)?.dealer_id}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuyerDashboard;