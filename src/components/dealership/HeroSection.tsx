import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { InlineWidget } from "react-calendly";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('dealer');

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 to-background">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          {t("hero.title")}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-4">
          {t("hero.subtitle")}
        </p>
        <p className="text-lg text-muted-foreground mb-8 text-red-600 font-semibold">
          {t("hero.urgency")}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">
                <Calendar className="mr-2 h-4 w-4" />
                {t("hero.cta.demo")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <InlineWidget url="https://calendly.com/your-calendly-url" />
            </DialogContent>
          </Dialog>
          <Button size="lg" variant="outline" onClick={() => navigate("/dealer-signup")}>
            {t("hero.cta.signup")}
          </Button>
        </div>
      </div>
    </section>
  );
};