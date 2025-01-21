import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InsuranceQuoteProps {
  quoteId: string;
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
      // Simulate insurance quote calculation
      const annualPremium = calculatePremium(formData.coverageType, parseFloat(formData.deductible));

      const { error } = await supabase
        .from('insurance_quotes')
        .insert({
          quote_id: quoteId,
          coverage_type: formData.coverageType,
          deductible: parseFloat(formData.deductible),
          annual_premium: annualPremium,
          provider: "Sample Insurance Co." // This would come from actual provider in production
        });

      if (error) throw error;

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

  // Simplified premium calculation for demonstration
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('insurance.coverageType')}</Label>
            <Select
              value={formData.coverageType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, coverageType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('insurance.selectCoverage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">{t('insurance.basic')}</SelectItem>
                <SelectItem value="full">{t('insurance.full')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('insurance.deductible')}</Label>
            <Select
              value={formData.deductible}
              onValueChange={(value) => setFormData(prev => ({ ...prev, deductible: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('insurance.selectDeductible')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="500">$500</SelectItem>
                <SelectItem value="1000">$1,000</SelectItem>
                <SelectItem value="2000">$2,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('insurance.calculating') : t('insurance.getQuote')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InsuranceQuote;