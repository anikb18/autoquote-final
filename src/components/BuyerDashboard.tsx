import React from "react";
import { useTranslation } from "react-i18next";
import { BuyerActiveQuotes } from "./dashboard/buyer/BuyerActiveQuotes";
import { BuyerCarListings } from "./dashboard/buyer/BuyerCarListings";
import { BuyerActiveChats } from "./dashboard/buyer/BuyerActiveChats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { PlusCircle, Car, Calculator, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const BuyerDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: incompleteQuotes } = useQuery({
    queryKey: ['incomplete-quotes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .is('price_paid', null);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {t('dashboard.welcome')}
      </h1>
      
      {incompleteQuotes?.length ? (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Incomplete Quotes</AlertTitle>
          <AlertDescription>
            You have {incompleteQuotes.length} incomplete quote{incompleteQuotes.length > 1 ? 's' : ''}. 
            Complete them to start receiving dealer responses.
          </AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => navigate('/quotes/' + incompleteQuotes[0].id)}
          >
            Complete Quote
          </Button>
        </Alert>
      ) : null}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Request Quote</CardTitle>
            <CardDescription>Get quotes from dealers ($40)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full group" 
              onClick={() => navigate('/request-quote')}
            >
              <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              New Quote Request
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Sell Your Car</CardTitle>
            <CardDescription>List your car for dealers</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full group" 
              onClick={() => navigate('/sell-car')}
            >
              <Car className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Create Listing
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Trade-in Valuation</CardTitle>
            <CardDescription>Get your car valued ($10)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full group" 
              onClick={() => navigate('/trade-in')}
            >
              <Calculator className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Value My Car
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <BuyerActiveQuotes />
        <BuyerCarListings />
        <BuyerActiveChats />
      </div>
    </div>
  );
};

export default BuyerDashboard;