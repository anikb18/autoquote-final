import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

const VehiclePreferenceForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [pricingOption, setPricingOption] = useState<string>("");
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    minBudget: "",
    maxBudget: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const carDetails = {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        budget: {
          min: parseInt(formData.minBudget),
          max: parseInt(formData.maxBudget),
        },
      };

      const { error } = await supabase.from('quotes').insert({
        user_id: user.id,
        car_details: carDetails,
        has_trade_in: hasTradeIn,
        pricing_option: hasTradeIn ? pricingOption : 'basic',
        trade_in_visibility_start: hasTradeIn ? new Date().toISOString() : null,
      });

      if (error) throw error;

      toast({
        title: "Quote Request Submitted",
        description: "We'll connect you with dealers shortly.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 text-primary mb-6">
        <Car className="w-6 h-6" />
        <h3 className="text-xl font-semibold">{t('form.title')}</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="make">{t('form.make.label')}</Label>
        <Input 
          id="make"
          placeholder={t('form.make.placeholder')}
          value={formData.make}
          onChange={(e) => handleInputChange('make', e.target.value)}
          className="w-full" 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">{t('form.model.label')}</Label>
        <Input 
          id="model"
          placeholder={t('form.model.placeholder')}
          value={formData.model}
          onChange={(e) => handleInputChange('model', e.target.value)}
          className="w-full" 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">{t('form.year.label')}</Label>
        <Input 
          id="year"
          type="number" 
          min="2000" 
          max="2025" 
          placeholder={t('form.year.placeholder')}
          value={formData.year}
          onChange={(e) => handleInputChange('year', e.target.value)}
          className="w-full" 
        />
      </div>

      <div className="space-y-2">
        <Label>{t('form.budget.label')}</Label>
        <div className="flex gap-4">
          <Input 
            type="number" 
            placeholder={t('form.budget.min')}
            value={formData.minBudget}
            onChange={(e) => handleInputChange('minBudget', e.target.value)}
            className="w-1/2" 
          />
          <Input 
            type="number" 
            placeholder={t('form.budget.max')}
            value={formData.maxBudget}
            onChange={(e) => handleInputChange('maxBudget', e.target.value)}
            className="w-1/2" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tradeIn">{t('form.tradeIn.label')}</Label>
        <Select onValueChange={(value) => setHasTradeIn(value === 'yes')}>
          <SelectTrigger id="tradeIn">
            <SelectValue placeholder={t('form.tradeIn.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">{t('form.tradeIn.no')}</SelectItem>
            <SelectItem value="yes">{t('form.tradeIn.yes')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasTradeIn && (
        <div className="space-y-2">
          <Label htmlFor="pricingOption">{t('form.visibility.label')}</Label>
          <Select onValueChange={setPricingOption} value={pricingOption}>
            <SelectTrigger id="pricingOption">
              <SelectValue placeholder={t('form.visibility.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trade_in_10">{t('form.visibility.tenDays')}</SelectItem>
              <SelectItem value="trade_in_40">{t('form.visibility.unlimited')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-accent hover:bg-accent/90"
        disabled={loading || (hasTradeIn && !pricingOption)}
      >
        {loading ? t('form.submitting') : t('form.submit')}
      </Button>
    </form>
  );
};

export default VehiclePreferenceForm;