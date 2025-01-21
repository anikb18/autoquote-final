import React from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentCalculator from "./PaymentCalculator";
import LoanPreApproval from "./LoanPreApproval";
import InsuranceQuote from "./InsuranceQuote";

interface FinancialToolsProps {
  quoteId: string;
  vehiclePrice: number;
}

const FinancialTools = ({ quoteId, vehiclePrice }: FinancialToolsProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">
            {t('financial.calculator')}
          </TabsTrigger>
          <TabsTrigger value="preApproval">
            {t('financial.preApproval')}
          </TabsTrigger>
          <TabsTrigger value="insurance">
            {t('financial.insurance')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <PaymentCalculator quoteId={quoteId} vehiclePrice={vehiclePrice} />
        </TabsContent>

        <TabsContent value="preApproval">
          <LoanPreApproval quoteId={quoteId} />
        </TabsContent>

        <TabsContent value="insurance">
          <InsuranceQuote quoteId={quoteId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialTools;