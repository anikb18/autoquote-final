import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { useEffect, useState } from "react";
import SubscriptionPlans from "@/components/SubscriptionPlans";

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