import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";

interface FinancingSectionProps {
  financingType: 'cash' | 'financing' | 'lease';
  setFinancingType: (value: 'cash' | 'financing' | 'lease') => void;
  financingDetails: {
    term: string;
    annualKilometers: string;
  };
  setFinancingDetails: (value: any) => void;
}

const FinancingSection = ({ 
  financingType, 
  setFinancingType, 
  financingDetails, 
  setFinancingDetails 
}: FinancingSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium flex items-center gap-2">
        <DollarSign className="w-4 h-4" />
        {t('form.financing.title')}
      </h4>

      <RadioGroup
        value={financingType}
        onValueChange={(value: 'cash' | 'financing' | 'lease') => setFinancingType(value)}
        className="grid grid-cols-3 gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash">{t('form.financing.cash')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="financing" id="financing" />
          <Label htmlFor="financing">{t('form.financing.loan')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="lease" id="lease" />
          <Label htmlFor="lease">{t('form.financing.lease')}</Label>
        </div>
      </RadioGroup>

      {(financingType === 'financing' || financingType === 'lease') && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('form.financing.term')}</Label>
            <Select 
              onValueChange={(value) => setFinancingDetails(prev => ({ ...prev, term: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('form.financing.termPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 {t('form.financing.months')}</SelectItem>
                <SelectItem value="36">36 {t('form.financing.months')}</SelectItem>
                <SelectItem value="48">48 {t('form.financing.months')}</SelectItem>
                <SelectItem value="60">60 {t('form.financing.months')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {financingType === 'lease' && (
            <div className="space-y-2">
              <Label>{t('form.financing.annualKm')}</Label>
              <Select 
                onValueChange={(value) => setFinancingDetails(prev => ({ ...prev, annualKilometers: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('form.financing.kmPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12000">12,000 km</SelectItem>
                  <SelectItem value="16000">16,000 km</SelectItem>
                  <SelectItem value="20000">20,000 km</SelectItem>
                  <SelectItem value="24000">24,000 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancingSection;