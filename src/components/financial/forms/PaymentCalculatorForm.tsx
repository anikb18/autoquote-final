import React from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PaymentCalculatorFormProps {
  price: number;
  setPrice: (price: number) => void;
  downPayment: number;
  setDownPayment: (downPayment: number) => void;
  interestRate: number;
  setInterestRate: (rate: number) => void;
  term: number;
  setTerm: (term: number) => void;
  onCalculate: () => void;
  isQuoteContext: boolean;
}

export const PaymentCalculatorForm = ({
  price,
  setPrice,
  downPayment,
  setDownPayment,
  interestRate,
  setInterestRate,
  term,
  setTerm,
  onCalculate,
  isQuoteContext
}: PaymentCalculatorFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('calculator.vehiclePrice')}</Label>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className={isQuoteContext ? "bg-gray-100" : ""}
          disabled={isQuoteContext}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('calculator.downPayment')}</Label>
        <Input
          type="number"
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
          min="0"
          max={price}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('calculator.interestRate')}</Label>
        <Input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
          step="0.01"
          min="0"
        />
      </div>

      <div className="space-y-2">
        <Label>{t('calculator.term')}</Label>
        <Input
          type="number"
          value={term}
          onChange={(e) => setTerm(Number(e.target.value))}
          min="12"
          max="96"
          step="12"
        />
      </div>

      <Button onClick={onCalculate} className="w-full">
        {t('calculator.calculate')}
      </Button>
    </div>
  );
};