import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calculator, ShieldCheck, BadgeCheck } from "lucide-react";

const FinancialTools = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tools = [
    {
      title: t('financial.paymentCalculator'),
      description: t('financial.paymentCalculatorDesc'),
      icon: <Calculator className="w-6 h-6" />,
      path: '/tools/payment-calculator'
    },
    {
      title: t('financial.loanPreApproval'),
      description: t('financial.loanPreApprovalDesc'),
      icon: <BadgeCheck className="w-6 h-6" />,
      path: '/tools/loan-pre-approval'
    },
    {
      title: t('financial.insuranceQuote'),
      description: t('financial.insuranceQuoteDesc'),
      icon: <ShieldCheck className="w-6 h-6" />,
      path: '/tools/insurance-quote'
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{t('financial.toolsTitle')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.path} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                {tool.icon}
                <CardTitle>{tool.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{tool.description}</p>
              <Button 
                onClick={() => navigate(tool.path)}
                className="w-full"
              >
                {t('financial.tryNow')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancialTools;