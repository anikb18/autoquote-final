import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Quote, CarDetails } from "@/types/quotes";
import { BuyerQuoteOverview } from "./dashboard/buyer/BuyerQuoteOverview";
import { BuyerActionCards } from "./dashboard/buyer/BuyerActionCards";

const BuyerDashboard = () => {
  const { data: activeQuote, error: quoteError } = useQuery({
    queryKey: ['activeQuote'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          dealer_quotes (
            id,
            dealer_id,
            status,
            response_status,
            response_date,
            response_notes,
            is_accepted,
            created_at,
            dealer_profiles (
              dealer_name
            )
          )
        `)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Type guard function to validate car_details
      const isValidCarDetails = (details: any): details is CarDetails => {
        return (
          details &&
          typeof details === 'object' &&
          'year' in details &&
          typeof details.year === 'number' &&
          'make' in details &&
          typeof details.make === 'string' &&
          'model' in details &&
          typeof details.model === 'string'
        );
      };

      // Validate car_details
      if (!isValidCarDetails(data.car_details)) {
        console.error('Invalid car details format:', data.car_details);
        return null;
      }

      // Transform the data to match the Quote type
      const quote: Quote = {
        id: data.id,
        car_details: data.car_details,
        dealer_quotes: data.dealer_quotes.map((dq: any) => ({
          id: dq.id,
          dealer_id: dq.dealer_id,
          status: dq.status,
          response_status: dq.response_status,
          response_date: dq.response_date,
          response_notes: dq.response_notes,
          is_accepted: dq.is_accepted,
          created_at: dq.created_at,
          dealer_profile: dq.dealer_profiles
        })),
        status: data.status,
        created_at: data.created_at
      };

      return quote;
    }
  });

  if (quoteError) {
    console.error('Error fetching active quote:', quoteError);
    return <div>Error loading dashboard</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6">
        <BuyerQuoteOverview activeQuote={activeQuote} />
        <BuyerActionCards />
      </div>
    </div>
  );
};

export { BuyerDashboard };