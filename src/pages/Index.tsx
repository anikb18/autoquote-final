import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Hero from "@/components/Hero";
import { PrimaryFeatures } from "@/components/PrimaryFeatures";
import { SecondaryFeatures } from "@/components/SecondaryFeatures";
import { Testimonials } from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import { CallToAction } from "@/components/CallToAction";
import { useEffect, useState } from "react";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  Calendar, 
  Car, 
  CheckCircle2, 
  Handshake, 
  LineChart, 
  PhoneCall, 
  ShieldCheck, 
  Users 
} from "lucide-react";

const Index = () => {
  const { t } = useTranslation('common'); // Initialize useTranslation with 'common' namespace
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
    window.open("https://calendly.com/po.tremblay", "_blank");
  };

  const handleCallSupport = () => {
    window.location.href = "tel:+1234567890";
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4">
      </div>
      <Hero />

      {/* Core Benefits */}
      <PrimaryFeatures />
      <SecondaryFeatures />
      <Testimonials />
      <Pricing />
      <CallToAction />
    </main>
  );
};

export default Index;
