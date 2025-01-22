import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DesiredVehicleSection from './forms/DesiredVehicleSection';
import FinancingSection from './forms/FinancingSection';
import TradeInSection from './forms/TradeInSection';

type FinancingType = 'cash' | 'financing' | 'lease';

interface FormData {
  desiredVehicle: {
    make: string;
    model: string;
    trim: string;
    year: string;
  };
  financing: {
    type: FinancingType;
    term: string;
    annualKilometers: string;
  };
  tradeIn: {
    hasTradeIn: boolean;
    vehicle: {
      vin: string;
      make: string;
      model: string;
      trim: string;
      mileage: string;
      year: string;
      outstandingLoan: string;
      accidentFree: boolean;
    };
    photos: File[];
  }
}

const NewQuoteForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  const [formData, setFormData] = useState<FormData>({
    desiredVehicle: {
      make: '',
      model: '',
      trim: '',
      year: '',
    },
    financing: {
      type: 'cash',
      term: '',
      annualKilometers: '',
    },
    tradeIn: {
      hasTradeIn: false,
      vehicle: {
        vin: '',
        make: '',
        model: '',
        trim: '',
        mileage: '',
        year: '',
        outstandingLoan: '',
        accidentFree: true,
      },
      photos: [],
    }
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    if (currentStep === 3 && !session) {
      toast({
        title: t('form.authRequired'),
        description: t('form.pleaseSignIn'),
      });
      navigate('/auth', { state: { returnTo: '/new-quote' } });
    }
  }, [currentStep, session, navigate, t]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const createCheckoutSession = async () => {
    try {
      const response = await fetch(
        'https://zndolceqzclnprozyudy.functions.supabase.co/create-checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            priceId: 'price_1Qh3X9G6N4q5lhXvjs5nTxlf',
          }),
        }
      );

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: t('form.error.title'),
        description: t('form.error.paymentFailed'),
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: t('form.authRequired'),
        description: t('form.pleaseSignIn'),
      });
      navigate('/auth');
      return;
    }

    if (currentStep === 4) {
      await createCheckoutSession();
    } else {
      handleNext();
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto p-6 space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-center text-foreground">
            {t('form.steps', { step: currentStep, total: 4 })}
          </h1>
          <p className="text-muted-foreground text-center">
            {currentStep === 1 && t('form.desiredVehicle.description')}
            {currentStep === 2 && t('form.financing.description')}
            {currentStep === 3 && t('form.tradeIn.description')}
            {currentStep === 4 && t('form.payment.description')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {currentStep === 1 && (
            <DesiredVehicleSection
              desiredVehicle={formData.desiredVehicle}
              setDesiredVehicle={(data) => setFormData(prev => ({ ...prev, desiredVehicle: data }))}
            />
          )}

          {currentStep === 2 && (
            <FinancingSection
              financingType={formData.financing.type}
              setFinancingType={(type: FinancingType) => setFormData(prev => ({ ...prev, financing: { ...prev.financing, type }}))}
              financingDetails={formData.financing}
              setFinancingDetails={(data) => setFormData(prev => ({ ...prev, financing: { ...prev.financing, ...data }}))}
            />
          )}

          {currentStep === 3 && (
            <TradeInSection
              hasTradeIn={formData.tradeIn.hasTradeIn}
              setHasTradeIn={(value) => setFormData(prev => ({ ...prev, tradeIn: { ...prev.tradeIn, hasTradeIn: value }}))}
              tradeInVehicle={formData.tradeIn.vehicle}
              setTradeInVehicle={(data) => setFormData(prev => ({ ...prev, tradeIn: { ...prev.tradeIn, vehicle: data }}))}
              photos={formData.tradeIn.photos}
              handlePhotoUpload={(e) => {
                const files = Array.from(e.target.files || []);
                setFormData(prev => ({
                  ...prev,
                  tradeIn: {
                    ...prev.tradeIn,
                    photos: [...prev.tradeIn.photos, ...files]
                  }
                }));
              }}
            />
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('form.payment.title')}</h3>
              <p>{t('form.payment.description')}</p>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">$49.95</p>
                <p className="text-sm text-muted-foreground">{t('form.payment.details')}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                {t('form.back')}
              </Button>
            )}
            <Button 
              type="submit"
              className="ml-auto"
              disabled={loading}
            >
              {currentStep === 4 ? t('form.payment.proceed') : t('form.next')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewQuoteForm;