import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoanPreApprovalForm } from "./forms/LoanPreApprovalForm";

interface LoanPreApprovalProps {
  quoteId?: string;
}

const LoanPreApproval = ({ quoteId }: LoanPreApprovalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    creditScore: "",
    annualIncome: "",
    monthlyObligations: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const preApprovalData = {
        user_id: user.id,
        ...(quoteId && { quote_id: quoteId }),
        credit_score: parseInt(formData.creditScore),
        annual_income: parseFloat(formData.annualIncome),
        monthly_obligations: parseFloat(formData.monthlyObligations),
      };

      const { error } = await supabase
        .from('loan_pre_approvals')
        .insert(preApprovalData);

      if (error) throw error;

      toast({
        title: t('preApproval.success'),
        description: t('preApproval.submitted'),
      });
    } catch (error) {
      toast({
        title: t('preApproval.error'),
        description: t('preApproval.failed'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('preApproval.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <LoanPreApprovalForm
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default LoanPreApproval;