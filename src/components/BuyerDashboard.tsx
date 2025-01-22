import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Quote, CarDetails } from "@/types/quotes";
import { BuyerQuoteOverview } from "./dashboard/buyer/BuyerQuoteOverview";
import { BuyerActionCards } from "./dashboard/buyer/BuyerActionCards";
import CarViewer3D from "@/components/3d-viewer/CarViewer3D";
import { Skeleton } from "./ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const BuyerDashboard = () => {
  const {
    data: activeQuote,
    error: quoteError,
    isLoading,
  } = useQuery({
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

      // Validate car_details
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
          dealer_profile: dq.dealer_profiles,
        })),
        status: data.status,
        created_at: data.created_at,
      };

      return quote;
    },
  });

  if (quoteError) {
    console.error('Error fetching active quote:', quoteError);
    return <div className="text-red-500 p-6">Error loading dashboard. Please try again later.</div>;
  }


  return (
    <div className="p-6 space-y-8 macOS-style">
      {/* Your Selected Vehicle Section */}
      <Card className="mb-8 shadow-neu-sm">
        <CardHeader>
          <CardTitle>Your Selected Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Car Image */}
          <div className="md:order-2 flex justify-center">
            {isLoading ? (
              <Skeleton className="w-full h-64 rounded-lg" />
            ) : (activeQuote?.car_details && (
              <CarViewer3D carDetails={activeQuote.car_details} />
            ))}
          </div>

          {/* Vehicle Details */}
          <div className="md:order-1 space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </>
            ) : (activeQuote && activeQuote.car_details && (
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{`${activeQuote.car_details.year} ${activeQuote.car_details.make} ${activeQuote.car_details.model}`}</h3>
                <p className="text-gray-500">
                  Trim: {activeQuote.car_details.trim || 'N/A'}
                </p>
                 <p className="text-gray-500">
                  Engine: {activeQuote.car_details.engine || 'N/A'}
                </p>
                 <p className="text-gray-500">
                  Options: {activeQuote.car_details.options || 'N/A'}
                </p>
                {/* Add more vehicle details here if available */}
              </div>
            ))}
          </div>
        </div>
        </CardContent>
      </Card>

      {/* Active Quote Overview */}
      <Card className="mb-8 shadow-neu-sm">
        <CardHeader>
          <CardTitle>Active Quote Overview</CardTitle>
        </CardHeader>
        <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          activeQuote && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <BuyerQuoteOverview activeQuote={activeQuote} />
              </div>
              <div>
                {/* Placeholder for charts or additional info */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Quote Analytics</h3>
                  <p className="text-sm text-gray-500">
                    Charts or key metrics related to the quote will be displayed here.
                  </p>
                  {/* Add charts or graphs here */}
                </div>
              </div>
            </div>
          )
        )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <BuyerActionCards />
      </section>
    </div>
  );
};

export default BuyerDashboard;
