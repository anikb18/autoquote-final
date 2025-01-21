import React from "react";
import { useTranslation } from "react-i18next";
import { BuyerActiveQuotes } from "./dashboard/buyer/BuyerActiveQuotes";
import { BuyerCarListings } from "./dashboard/buyer/BuyerCarListings";
import { BuyerActiveChats } from "./dashboard/buyer/BuyerActiveChats";

const BuyerDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {t('dashboard.welcome')}
      </h1>
      
      <div className="grid grid-cols-1 gap-6">
        <BuyerActiveQuotes />
        <BuyerCarListings />
        <BuyerActiveChats />
      </div>
    </div>
  );
};

export default BuyerDashboard;