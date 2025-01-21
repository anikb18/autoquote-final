import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InsuranceQuoteForm } from "./forms/InsuranceQuoteForm";

interface InsuranceQuoteProps {
  quoteId?: string;
}

const InsuranceQuote = ({ quoteId }: InsuranceQuoteProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    coverageType: "",
    deductible: "1000",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const annualPremium = calculatePremium(formData.coverageType, parseFloat(formData.deductible));

      if (quoteId) {
        const { error } = await supabase
          .from('insurance_quotes')
          .insert({
            quote_id: quoteId,
            coverage_type: formData.coverageType,
            deductible: parseFloat(formData.deductible),
            annual_premium: annualPremium,
            provider: "Sample Insurance Co."
          });

        if (error) throw error;
      }

      toast({
        title: t('insurance.success'),
        description: t('insurance.quoteReady'),
      });
    } catch (error) {
      toast({
        title: t('insurance.error'),
        description: t('insurance.failed'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculatePremium = (coverageType: string, deductible: number): number => {
    const basePremium = 1200;
    const coverageMultiplier = coverageType === 'full' ? 1.5 : 1;
    const deductibleFactor = 1 - (deductible / 10000);
    return basePremium * coverageMultiplier * deductibleFactor;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('insurance.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <InsuranceQuoteForm
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default InsuranceQuote;