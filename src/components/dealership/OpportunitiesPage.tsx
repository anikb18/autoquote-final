"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Clock, Car, DollarSign, MapPin } from "lucide-react";

interface QuoteOpportunity {
  id: string;
  created_at: string;
  car_details: {
    year: number;
    make: string;
    model: string;
    location?: string;
  };
  status: string;
}

export function OpportunitiesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["quote-opportunities"],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("quotes")
        .select(`
          id,
          created_at,
          car_details,
          status
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: t("errors.loadingFailed"),
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as QuoteOpportunity[];
    },
  });

  const handleViewQuote = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("dealer.opportunities.title")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("dealer.opportunities.subtitle")}
        </p>
      </div>

      <div className="grid gap-6">
        {opportunities?.map((opportunity) => {
          const endTime = new Date(
            new Date(opportunity.created_at).getTime() + 24 * 60 * 60 * 1000
          );

          return (
            <Card
              key={opportunity.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Car className="h-6 w-6 text-primary" />
                      {opportunity.car_details.year} {opportunity.car_details.make}{" "}
                      {opportunity.car_details.model}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <CountdownTimer
                          endTime={endTime}
                          onComplete={() => {
                            toast({
                              title: t("dealer.opportunities.expired"),
                              description: t(
                                "dealer.opportunities.expiredDescription"
                              ),
                              variant: "destructive",
                            });
                          }}
                        />
                      </span>
                      {opportunity.car_details.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {opportunity.car_details.location}
                        </span>
                      )}
                      <Badge variant="secondary">{opportunity.status}</Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewQuote(opportunity.id)}
                    className="flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    {t("dealer.opportunities.submitQuote")}
                  </Button>
                </div>
              </CardHeader>
            </Card>
          );
        })}

        {opportunities?.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              {t("dealer.opportunities.noOpportunities")}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}