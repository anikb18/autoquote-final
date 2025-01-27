import React from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoanPreApprovalFormData {
  creditScore: string;
  annualIncome: string;
  monthlyObligations: string;
}

interface LoanPreApprovalFormProps {
  formData: LoanPreApprovalFormData;
  setFormData: (data: LoanPreApprovalFormData) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoanPreApprovalForm = ({
  formData,
  setFormData,
  loading,
  onSubmit,
}: LoanPreApprovalFormProps) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>{t("preApproval.creditScore")}</Label>
        <Input
          type="number"
          value={formData.creditScore}
          onChange={(e) =>
            setFormData({ ...formData, creditScore: e.target.value })
          }
          min="300"
          max="900"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>{t("preApproval.annualIncome")}</Label>
        <Input
          type="number"
          value={formData.annualIncome}
          onChange={(e) =>
            setFormData({ ...formData, annualIncome: e.target.value })
          }
          min="0"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>{t("preApproval.monthlyObligations")}</Label>
        <Input
          type="number"
          value={formData.monthlyObligations}
          onChange={(e) =>
            setFormData({ ...formData, monthlyObligations: e.target.value })
          }
          min="0"
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t("preApproval.submitting") : t("preApproval.submit")}
      </Button>
    </form>
  );
};
