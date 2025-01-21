import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { useEffect, useState } from "react";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { 
  BarChart3, 
  Calendar, 
  Car, 
  CheckCircle2, 
  HandshakeIcon, 
  LineChart, 
  PhoneCall, 
  ShieldCheck, 
  Users 
} from "lucide-react";

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

  const openCalendly = () => {
    // Replace with your Calendly URL
    window.open("https://calendly.com/your-calendly-link", "_blank");
  };

  const handleCallSupport = () => {
    // Replace with your support phone number
    window.location.href = "tel:+1234567890";
  };

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
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Get Pre-Qualified Leads Without The Bidding War
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join AutoQuote24's Exclusive Dealer Network and transform your lead generation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/dealer-signup")} 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <HandshakeIcon className="mr-2 h-5 w-5" />
                Join Our Dealer Network
              </Button>
              <Button 
                onClick={openCalendly}
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule a Demo
              </Button>
            </div>
          </div>

          {/* Core Benefits */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Revenue Potential */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-4">Revenue Potential</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Private bidding system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Pre-qualified leads only</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Exclusive territory rights</span>
                </li>
              </ul>
            </div>

            {/* Operational Advantages */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <LineChart className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-4">Operational Advantages</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Automated quote management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Streamlined lead distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Real-time analytics dashboard</span>
                </li>
              </ul>
            </div>

            {/* Trust & Support */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ShieldCheck className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-4">Trust & Support</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>30-day satisfaction guarantee</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Dedicated dealer support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>No long-term contract</span>
                </li>
              </ul>
            </div>

            {/* Network Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-4">Network Success</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>95% dealer retention rate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>40% average conversion</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Growing dealer network</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Quick Actions */}
          <div className="md:hidden flex flex-col gap-4">
            <Button 
              onClick={handleCallSupport}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <PhoneCall className="mr-2 h-5 w-5" />
              Call Support
            </Button>
            <Button 
              onClick={openCalendly}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Demo
            </Button>
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