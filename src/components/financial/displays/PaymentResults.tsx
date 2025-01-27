import React from "react";
import { useTranslation } from "react-i18next";

interface PaymentResultsProps {
  monthlyPayment: number;
  totalWithTax: number;
  price: number;
}

export const PaymentResults = ({
  monthlyPayment,
  totalWithTax,
  price,
}: PaymentResultsProps) => {
  const { t } = useTranslation();

  return (
    <div className="mt-4 space-y-2 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between">
        <span>{t("calculator.monthlyPayment")}:</span>
        <span className="font-semibold">${monthlyPayment.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>{t("calculator.totalWithTax")}:</span>
        <span className="font-semibold">${totalWithTax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>{t("calculator.taxAmount")}:</span>
        <span className="font-semibold">
          ${(totalWithTax - price).toFixed(2)}
        </span>
      </div>
    </div>
  );
};
