import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentCalculatorProps {
  quoteId?: string;
  vehiclePrice?: number;
}

const PaymentCalculator = ({ quoteId, vehiclePrice = 25000 }: PaymentCalculatorProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [price, setPrice] = useState<number>(vehiclePrice);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(5.99);
  const [term, setTerm] = useState<number>(60);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalWithTax, setTotalWithTax] = useState<number>(0);

  const QC_TAX_RATE = 0.14975; // Combined GST (5%) and QST (9.975%)

  const calculatePayments = async () => {
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 12 / 100;
    const totalTax = price * QC_TAX_RATE;
    const totalWithTaxAmount = price + totalTax;
    
    const monthlyPaymentAmount = 
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
      (Math.pow(1 + monthlyRate, term) - 1);

    setMonthlyPayment(monthlyPaymentAmount);
    setTotalWithTax(totalWithTaxAmount);

    if (quoteId) {
      try {
        const { error } = await supabase
          .from('financing_calculations')
          .insert({
            quote_id: quoteId,
            loan_amount: loanAmount,
            down_payment: downPayment,
            interest_rate: interestRate,
            term_months: term,
            monthly_payment: monthlyPaymentAmount,
            tax_rate: QC_TAX_RATE,
            total_with_tax: totalWithTaxAmount
          });

        if (error) throw error;

        toast({
          title: t('calculator.success'),
          description: t('calculator.saved'),
        });
      } catch (error) {
        toast({
          title: t('calculator.error'),
          description: t('calculator.saveFailed'),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('calculator.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('calculator.vehiclePrice')}</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className={quoteId ? "bg-gray-100" : ""}
            disabled={!!quoteId}
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

        <Button onClick={calculatePayments} className="w-full">
          {t('calculator.calculate')}
        </Button>

        {monthlyPayment > 0 && (
          <div className="mt-4 space-y-2 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span>{t('calculator.monthlyPayment')}:</span>
              <span className="font-semibold">
                ${monthlyPayment.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t('calculator.totalWithTax')}:</span>
              <span className="font-semibold">
                ${totalWithTax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t('calculator.taxAmount')}:</span>
              <span className="font-semibold">
                ${(totalWithTax - price).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentCalculator;