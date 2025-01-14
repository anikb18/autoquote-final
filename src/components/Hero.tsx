import { useTranslation } from "react-i18next";
import VehiclePreferenceForm from "./VehiclePreferenceForm";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary to-primary/90 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/car-pattern.png')] opacity-10" />
      
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-white space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-xl">
            {t('hero.subtitle')}
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-2xl font-bold">1k+</span>
              </div>
              <p className="text-sm">{t('hero.stats.dealers')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-2xl font-bold">50k+</span>
              </div>
              <p className="text-sm">{t('hero.stats.customers')}</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-md animate-fade-in">
          <VehiclePreferenceForm />
        </div>
      </div>
    </div>
  );
};

export default Hero;