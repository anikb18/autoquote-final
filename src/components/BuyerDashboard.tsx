import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Quote, CarDetails } from "@/types/quotes";

const BuyerDashboard = () => {
  const navigate = useNavigate();

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
            created_at
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
          created_at: dq.created_at
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
        {/* Active Quote Section */}
        {activeQuote && (
          <Card>
            <CardHeader>
              <CardTitle>Active Quote</CardTitle>
              <CardDescription>
                {activeQuote.car_details.year} {activeQuote.car_details.make} {activeQuote.car_details.model}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Dealer Responses: {activeQuote.dealer_quotes.length}</p>
                  <p className="text-sm text-gray-500">Created: {new Date(activeQuote.created_at).toLocaleDateString()}</p>
                </div>
                <Button onClick={() => navigate(`/quotes/${activeQuote.id}`)}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* New Quote Card */}
          <Card>
            <CardHeader>
              <CardTitle>Start New Quote</CardTitle>
              <CardDescription>Get quotes from dealers for your next vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/quotes/new')}>
                Start Quote
              </Button>
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Contact our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/support')}>
                Contact Support
              </Button>
            </CardContent>
          </Card>

          {/* Chat Card */}
          <Card>
            <CardHeader>
              <CardTitle>Chat with Us</CardTitle>
              <CardDescription>Get instant help from our AI assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/chat')}>
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { BuyerDashboard };
