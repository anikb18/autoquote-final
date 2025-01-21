import React from "react";
import { useTranslation } from "react-i18next";
import { BuyerActiveQuotes } from "./dashboard/buyer/BuyerActiveQuotes";
import { BuyerCarListings } from "./dashboard/buyer/BuyerCarListings";
import { BuyerActiveChats } from "./dashboard/buyer/BuyerActiveChats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { PlusCircle, Car, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BuyerDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {t('dashboard.welcome')}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Quote</CardTitle>
            <CardDescription>Get quotes from dealers ($40)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate('/request-quote')}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Quote Request
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sell Your Car</CardTitle>
            <CardDescription>List your car for dealers</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate('/sell-car')}
            >
              <Car className="mr-2 h-4 w-4" />
              Create Listing
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trade-in Valuation</CardTitle>
            <CardDescription>Get your car valued ($10)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate('/trade-in')}
            >
              <Calculator className="mr-2 h-4 w-4" />
              Value My Car
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <BuyerActiveQuotes />
        <BuyerCarListings />
        <BuyerActiveChats />
      </div>
    </div>
  );
};

export default BuyerDashboard;