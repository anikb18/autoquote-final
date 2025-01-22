import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check as CheckIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { InlineWidget } from "react-calendly";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ProgressBar } from '@/components/ProgressBar';
import { SparklesIcon } from '@heroicons/react/24/solid';

const PRICE_IDS = {
  FORFAIT_NOUVELLE_VOITURE: "price_1Qjb7xG6N4q5lhXvL2EsKg6n",
  FORFAIT_REVENTE: "price_1Qjb7wG6N4q5lhXv4FJrSWLj"
}

const TOTAL_SPOTS = 500;
const REMAINING_SPOTS = 127;
const SPOTS_LAST_HOUR = 23;

const NEW_CAR_FEATURES = 7;
const TRADE_IN_FEATURES = 6;

const endTime = new Date();
endTime.setDate(endTime.getDate() + 7);

const Pricing = () => {
  const { toast } = useToast();
  const { t } = useTranslation('pricing');

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

  if (userRole === 'dealer') {
    return (
      <div className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('dealer.title')}</h2>
          <p className="text-muted-foreground mb-8">
            {t('dealer.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="min-w-[200px]">
                  {t('dealer.scheduleDemo')}
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
              {t('dealer.requestCallback')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      id="pricing"
      aria-label={t('features.title')}
      className="bg-slate-900 py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <Container className="px-4 sm:px-6 lg:px-8">
        <div className="md:text-center max-w-2xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-white">
            {t('features.title')}
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-400 leading-relaxed">
            {t('features.subtitle')}
          </p>
          <div className="mt-6 sm:mt-8">
            <CountdownTimer endTime={endTime} />
          </div>
          <div className="mt-6 sm:mt-8 max-w-md mx-auto">
            <ProgressBar 
              total={TOTAL_SPOTS} 
              remaining={REMAINING_SPOTS}
              className="max-w-md mx-auto"
            />
          </div>
        </div>

        <div className="mt-10 sm:mt-12 md:mt-16 grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {/* New Car Package */}
          <div className="h-full">
            <div className="flex flex-col h-full rounded-3xl bg-white/5 p-6 ring-1 ring-inset ring-white/10 hover:ring-white/20 transition-all duration-500 sm:p-8 md:p-10">
              <h3 className="font-display text-lg text-white sm:text-xl md:text-2xl">
                {t('features.newCar.title')}
              </h3>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
                {t('features.newCar.description')}
              </p>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <p className="flex items-baseline flex-wrap">
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                      {t('features.newCar.price')}
                    </span>
                    <span className="ml-2 text-sm text-slate-400">
                      {t('features.newCar.prelaunchPrice')}
                    </span>
                  </p>
                  <p className="mt-1 sm:mt-2 text-sm text-emerald-400">
                    <span className="font-bold">40% OFF</span> - {t('features.newCar.regularPrice')}
                  </p>
                </div>
                <div className="text-left sm:text-right group mt-3 sm:mt-0">
                  <div className="relative">
                    <p className="text-base sm:text-lg font-bold text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-300">
                      {t('features.newCar.savings')}
                    </p>
                    <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-60 p-3 bg-emerald-400/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 text-sm text-emerald-400 ring-1 ring-inset ring-emerald-400/20 z-10">
                      {t('features.newCar.tooltip')}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {t('features.spotsRemaining', { count: REMAINING_SPOTS })}
                  </p>
                </div>
              </div>
              <div className="my-6 sm:my-8 h-px bg-white/10" />
              <ul role="list" className="space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed text-slate-300 flex-grow">
                {Array.from({ length: NEW_CAR_FEATURES }, (_, i) => (
                  <li key={i} className="flex items-start gap-3 sm:gap-4 group">
                    <CheckIcon className="h-5 w-5 flex-none text-emerald-400 mt-0.5 transition-all duration-300 group-hover:scale-110" />
                    <span className="transition-colors duration-300 group-hover:text-emerald-400">
                      {t(`features.newCar.items.newCar.${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="mt-6 sm:mt-8 w-full py-2.5 sm:py-3 text-sm sm:text-base bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors duration-300"
              >
                {t('features.newCar.cta')}
              </Link>
            </div>
          </div>

          {/* Trade-In Package */}
          <div className="h-full">
            <div className="relative flex flex-col h-full rounded-3xl bg-white/5 p-6 ring-2 ring-emerald-400/60 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] bg-gradient-to-b from-emerald-500/[0.075] to-transparent hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.4)] transition-all duration-500 sm:p-8 md:p-10">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-400 ring-1 ring-inset ring-emerald-400/20">
                  {t('features.mostPopular')}
                  <SparklesIcon className="h-6 w-6 text-yellow-400 sparkle-icon animate-spin" />
                </div>
              </div>
              <h3 className="font-display text-lg text-white sm:text-xl md:text-2xl">
                {t('features.tradeIn.title')}
              </h3>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
                {t('features.tradeIn.description')}
              </p>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <p className="flex items-baseline flex-wrap">
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                      {t('features.tradeIn.price')}
                    </span>
                  </p>
                  <p className="mt-1 sm:mt-2 text-sm text-emerald-400">
                    <span className="font-bold">40% OFF</span> - {t('features.tradeIn.regularPrice')}
                  </p>
                </div>
                <div className="text-left sm:text-right group mt-3 sm:mt-0">
                  <div className="relative">
                    <p className="text-base sm:text-lg font-bold text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-300">
                      {t('features.tradeIn.savings')}
                    </p>
                    <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-60 p-3 bg-emerald-400/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 text-sm text-emerald-400 ring-1 ring-inset ring-emerald-400/20 z-10">
                      {t('features.tradeIn.tooltip')}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {t('features.spotsRemaining', { count: REMAINING_SPOTS })}
                  </p>
                </div>
              </div>
              <div className="my-6 sm:my-8 h-px bg-white/10" />
              <ul role="list" className="space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed text-slate-300 flex-grow">
                {Array.from({ length: TRADE_IN_FEATURES }, (_, i) => (
                  <li key={i} className="flex items-start gap-3 sm:gap-4 group">
                    <CheckIcon className="h-5 w-5 flex-none text-emerald-400 mt-0.5 transition-all duration-300 group-hover:scale-110" />
                    <span className="transition-colors duration-300 group-hover:text-emerald-400">
                      {t(`features.tradeIn.items.tradeIn.${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="mt-6 sm:mt-8 w-full py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 rounded-lg transition-all duration-300"
              >
                {t('features.tradeIn.cta')}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Pricing;