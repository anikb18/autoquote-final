import React from "react";
import { useTranslation } from "react-i18next";
import { BuyerActiveQuotes } from "./dashboard/buyer/BuyerActiveQuotes";
import { BuyerCarListings } from "./dashboard/buyer/BuyerCarListings";
import { BuyerActiveChats } from "./dashboard/buyer/BuyerActiveChats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { PlusCircle, Car, Calculator, AlertCircle, MessageSquareText, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import CarViewer3D from "./CarViewer3D";
import { Quote, CarDetails } from "@/types/quotes";
import { ChatbotPopup } from "./chat/ChatbotPopup";

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

  const { data: activeQuote } = useQuery<Quote | null>({
    queryKey: ['active-quote'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          dealer_quotes (
            id,
            dealer_id,
            is_accepted,
            dealer_profile:dealer_profiles (*)
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;

      // Transform the data to match the Quote type
      const quote: Quote = {
        id: data.id,
        car_details: {
          year: data.car_details?.year as number,
          make: data.car_details?.make as string,
          model: data.car_details?.model as string
        },
        dealer_quotes: data.dealer_quotes.map((dq: any) => ({
          id: dq.id,
          dealer_id: dq.dealer_id,
          is_accepted: dq.is_accepted,
          dealer_profile: dq.dealer_profile
        }))
      };

      return quote;
    },
  });

  // Parse car_details to ensure it matches CarDetails type
  const carDetails: CarDetails | undefined = activeQuote?.car_details;

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

      {activeQuote && carDetails && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Your Active Quote</CardTitle>
            <CardDescription>
              {carDetails.year} {carDetails.make} {carDetails.model}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CarViewer3D carDetails={carDetails} showHotspots={true} />
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>Get help or report issues</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full group" 
              onClick={() => navigate('/support')}
            >
              <MessageSquareText className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <BuyerActiveQuotes />
        <BuyerCarListings />
        <BuyerActiveChats />
      </div>

      <ChatbotPopup />
    </div>
  );
};

export default BuyerDashboard;