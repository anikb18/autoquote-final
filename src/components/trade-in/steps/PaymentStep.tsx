import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentStepProps {
  onSuccess: () => void;
}

const PaymentStep = ({ onSuccess }: PaymentStepProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Call the create-checkout edge function
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          priceId: 'price_1Qh3Z5G6N4q5lhXvVfvvNFvP' // Trade-in valuation price ID
        })
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Trade-In Valuation Service</h3>
            <p className="text-gray-500">
              Get your vehicle professionally valued by our network of certified dealers
            </p>
            <div className="text-2xl font-bold">$16.95</div>
            <ul className="text-left space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Professional valuation within 24 hours
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Multiple dealer assessments
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Detailed condition report
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Market value comparison
              </li>
            </ul>
            <Button
              onClick={handlePayment}
              className="w-full"
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStep;