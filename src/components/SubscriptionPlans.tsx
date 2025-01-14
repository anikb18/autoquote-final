import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const PRICE_IDS = {
  FORFAIT_NOUVELLE_VOITURE: "price_1Qh3X9G6N4q5lhXvjs5nTxlf",
  FORFAIT_REVENTE: "price_1Qh3Z5G6N4q5lhXvVfvvNFvP",
  FORFAIT_STANDARD: "price_1Qh3bNG6N4q5lhXvNkkmsuQp",
  FORFAIT_COMPLET: "price_1Qh3dWG6N4q5lhXvB0LACdX4"
}

const SubscriptionPlans = () => {
  const { toast } = useToast();

  const { data: userRole } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data?.role;
    },
  });

  const handleSubscribe = async (priceId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to subscribe to a plan",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (userRole === 'dealer') {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8 max-w-6xl mx-auto px-4">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Forfait Standard</CardTitle>
            <CardDescription>Perfect for small dealerships</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Basic quote management</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Limited trade-in visibility</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handleSubscribe(PRICE_IDS.FORFAIT_STANDARD)}
            >
              Subscribe to Standard
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-primary">
          <CardHeader>
            <CardTitle>Forfait Complet</CardTitle>
            <CardDescription>For growing dealerships</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Advanced quote management</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Unlimited trade-in visibility</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handleSubscribe(PRICE_IDS.FORFAIT_COMPLET)}
            >
              Subscribe to Complete
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:gap-8 max-w-6xl mx-auto px-4">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Forfait Nouvelle Voiture</CardTitle>
          <CardDescription>For new car purchases</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>New car quote requests</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Dealer matching</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => handleSubscribe(PRICE_IDS.FORFAIT_NOUVELLE_VOITURE)}
          >
            Subscribe to New Car Plan
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col border-primary">
        <CardHeader>
          <CardTitle>Forfait Revente</CardTitle>
          <CardDescription>For selling your current car</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Trade-in valuation</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Multiple dealer quotes</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Priority matching</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => handleSubscribe(PRICE_IDS.FORFAIT_REVENTE)}
          >
            Subscribe to Trade-in Plan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;