import { Button } from "@/components/ui/button";
import { Calendar, Play } from "lucide-react";
import { InlineWidget } from "react-calendly";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const { data: translations } = useQuery({
    queryKey: ['dealer_hero_translations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('category', 'translations')
        .eq('key', 'dealer_hero')
        .single();

      if (error) throw error;
      return data?.value?.[i18n.language] || {
        title: "Get Pre-Qualified Leads Without The Bidding War",
        subtitle: "Join AutoQuote24's Exclusive Dealer Network - Limited Spots Available",
        urgency: "Only 3 dealer spots left in your area",
        cta: {
          demo: "Schedule Your Private Demo",
          video: "Watch 2-Minute Demo Video"
        },
        stats: {
          dealers: "200+ Trusted Partners",
          conversion: "35% Faster Closing",
          sales: "1,000+ Qualified Leads Monthly"
        }
      };
    }
  });

  if (!translations) return null;

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {translations.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            {translations.subtitle}
          </p>
          <p className="text-lg text-red-600 font-semibold mb-8">
            {translations.urgency}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Calendar className="mr-2 h-4 w-4" />
                  {translations.cta.demo}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <InlineWidget url="https://calendly.com/your-calendly-url" />
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline">
                  <Play className="mr-2 h-4 w-4" />
                  {translations.cta.video}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/your-video-id"
                    title="Demo Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary mb-2">{translations.stats.dealers}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-2">{translations.stats.conversion}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-2">{translations.stats.sales}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};