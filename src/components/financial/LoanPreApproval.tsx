import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('preApproval.creditScore')}</Label>
            <Input
              type="number"
              value={formData.creditScore}
              onChange={(e) => setFormData(prev => ({ ...prev, creditScore: e.target.value }))}
              min="300"
              max="900"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t('preApproval.annualIncome')}</Label>
            <Input
              type="number"
              value={formData.annualIncome}
              onChange={(e) => setFormData(prev => ({ ...prev, annualIncome: e.target.value }))}
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t('preApproval.monthlyObligations')}</Label>
            <Input
              type="number"
              value={formData.monthlyObligations}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyObligations: e.target.value }))}
              min="0"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('preApproval.submitting') : t('preApproval.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoanPreApproval;