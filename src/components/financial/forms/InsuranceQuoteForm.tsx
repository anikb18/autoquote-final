import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InsuranceQuoteFormData {
  coverageType: string;
  deductible: string;
}

interface InsuranceQuoteFormProps {
  formData: InsuranceQuoteFormData;
  setFormData: (data: InsuranceQuoteFormData) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const InsuranceQuoteForm = ({
  formData,
  setFormData,
  loading,
  onSubmit
}: InsuranceQuoteFormProps) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>{t('insurance.coverageType')}</Label>
        <Select
          value={formData.coverageType}
          onValueChange={(value) => setFormData({ ...formData, coverageType: value })}
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
          onValueChange={(value) => setFormData({ ...formData, deductible: value })}
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
  );
};