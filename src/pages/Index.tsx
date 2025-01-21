import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { useEffect, useState } from "react";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { Car, CarFront } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-end py-4">
          {isAuthenticated && (
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-primary hover:bg-primary/90"
            >
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
      <Hero />
      <Features />
      
      {/* Dealership Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Are you a Dealership?</h2>
            <p className="text-lg text-gray-600 mb-8">Join our network and connect with potential buyers</p>
            <Button 
              onClick={() => navigate("/dealer-signup")} 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Car className="mr-2 h-5 w-5" />
              Join as a Dealership
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {/* New Car Dealership Promo */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <CarFront className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">New Car Dealerships</h3>
              <div className="space-y-2 mb-6">
                <p className="text-gray-600">Regular Price: $49.95</p>
                <p className="text-2xl font-bold text-primary">
                  Pre-launch Price: $29.97
                  <span className="ml-2 inline-block bg-accent text-white text-sm px-2 py-1 rounded">
                    -40%
                  </span>
                </p>
              </div>
              <Button 
                onClick={() => navigate("/dealer-signup?type=new")}
                variant="outline"
                className="w-full"
              >
                Get Started
              </Button>
            </div>

            {/* Used Car Dealership Promo */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Car className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Used Car Dealerships</h3>
              <div className="space-y-2 mb-6">
                <p className="text-gray-600">Regular Price: $16.95</p>
                <p className="text-2xl font-bold text-primary">
                  Pre-launch Price: $10.17
                  <span className="ml-2 inline-block bg-accent text-white text-sm px-2 py-1 rounded">
                    -40%
                  </span>
                </p>
              </div>
              <Button 
                onClick={() => navigate("/dealer-signup?type=used")}
                variant="outline"
                className="w-full"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
          <SubscriptionPlans />
        </div>
      </section>
    </main>
  );
};

export default Index;