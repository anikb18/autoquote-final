import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PaymentCalculatorForm } from "./forms/PaymentCalculatorForm";
import { PaymentResults } from "./displays/PaymentResults";

interface PaymentCalculatorProps {
  quoteId?: string;
  vehiclePrice?: number;
}

const PaymentCalculator = ({
  quoteId,
  vehiclePrice = 25000,
}: PaymentCalculatorProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [price, setPrice] = useState<number>(vehiclePrice);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(5.99);
  const [term, setTerm] = useState<number>(60);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalWithTax, setTotalWithTax] = useState<number>(0);

  const QC_TAX_RATE = 0.14975;

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
        const { error } = await supabase.from("financing_calculations").insert({
          quote_id: quoteId,
          loan_amount: loanAmount,
          down_payment: downPayment,
          interest_rate: interestRate,
          term_months: term,
          monthly_payment: monthlyPaymentAmount,
          tax_rate: QC_TAX_RATE,
          total_with_tax: totalWithTaxAmount,
        });

        if (error) throw error;

        toast({
          title: t("calculator.success"),
          description: t("calculator.saved"),
        });
      } catch (error) {
        toast({
          title: t("calculator.error"),
          description: t("calculator.saveFailed"),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("calculator.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <PaymentCalculatorForm
          price={price}
          setPrice={setPrice}
          downPayment={downPayment}
          setDownPayment={setDownPayment}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          term={term}
          setTerm={setTerm}
          onCalculate={calculatePayments}
          isQuoteContext={!!quoteId}
        />
        {monthlyPayment > 0 && (
          <PaymentResults
            monthlyPayment={monthlyPayment}
            totalWithTax={totalWithTax}
            price={price}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentCalculator;
