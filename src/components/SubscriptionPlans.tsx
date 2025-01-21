import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { InlineWidget } from "react-calendly";
import { useTranslation } from "react-i18next";

const PRICE_IDS = {
  FORFAIT_NOUVELLE_VOITURE: "price_1Qjb7xG6N4q5lhXvL2EsKg6n",
  FORFAIT_REVENTE: "price_1Qjb7wG6N4q5lhXv4FJrSWLj"
}

const SubscriptionPlans = () => {
  const { toast } = useToast();
  const { t } = useTranslation('dealer');

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
      <div className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Contact Our Sales Team</h2>
          <p className="text-muted-foreground mb-8">
            Schedule a demo or request a callback to learn more about our dealer solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="min-w-[200px]">
                  Schedule Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <InlineWidget url="https://calendly.com/your-calendly-url" />
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              size="lg"
              className="min-w-[200px]"
              onClick={() => window.location.href = "/contact"}
            >
              Request Callback
            </Button>
          </div>
        </div>
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