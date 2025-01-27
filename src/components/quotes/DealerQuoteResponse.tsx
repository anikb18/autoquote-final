import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface DealerQuoteResponseProps {
  quoteId: string;
  hasTradeIn: boolean;
}

export const DealerQuoteResponse = ({
  quoteId,
  hasTradeIn,
}: DealerQuoteResponseProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    price: "",
    availability: "",
    estimatedDelivery: "",
    additionalNotes: "",
    features: "",
    colors: "",
    tradeInValue: "",
    condition: "",
    evaluationNotes: "",
    requiresInspection: false,
  });

  const { data: dealerProfile } = useQuery({
    queryKey: ["dealer-profile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("dealer_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const submitQuote = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("dealer_quotes").insert([
        {
          quote_id: quoteId,
          dealer_id: (await supabase.auth.getUser()).data.user?.id,
          response_notes: JSON.stringify({
            price: data.price,
            availability: data.availability,
            estimatedDelivery: data.estimatedDelivery,
            additionalNotes: data.additionalNotes,
            features: data.features,
            colors: data.colors,
            ...(dealerProfile?.subscription_type === "premium" && hasTradeIn
              ? {
                  tradeInValue: data.tradeInValue,
                  condition: data.condition,
                  evaluationNotes: data.evaluationNotes,
                  requiresInspection: data.requiresInspection,
                }
              : {}),
          }),
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: t("dealer.quoteResponse.success"),
      });
    },
    onError: (error) => {
      toast({
        title: t("dealer.quoteResponse.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuote.mutate(formData);
  };

  const isPremium = dealerProfile?.subscription_type === "premium";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("dealer.quoteResponse.newVehicle.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("dealer.quoteResponse.newVehicle.price")}</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t("dealer.quoteResponse.newVehicle.availability")}</Label>
            <Select
              value={formData.availability}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, availability: value }))
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t(
                    "dealer.quoteResponse.newVehicle.availability",
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inStock">
                  {t(
                    "dealer.quoteResponse.newVehicle.availabilityOptions.inStock",
                  )}
                </SelectItem>
                <SelectItem value="ordered">
                  {t(
                    "dealer.quoteResponse.newVehicle.availabilityOptions.ordered",
                  )}
                </SelectItem>
                <SelectItem value="transit">
                  {t(
                    "dealer.quoteResponse.newVehicle.availabilityOptions.transit",
                  )}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              {t("dealer.quoteResponse.newVehicle.estimatedDelivery")}
            </Label>
            <Input
              type="date"
              value={formData.estimatedDelivery}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  estimatedDelivery: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>{t("dealer.quoteResponse.newVehicle.features")}</Label>
            <Textarea
              value={formData.features}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, features: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>{t("dealer.quoteResponse.newVehicle.color")}</Label>
            <Input
              value={formData.colors}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, colors: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>
              {t("dealer.quoteResponse.newVehicle.additionalNotes")}
            </Label>
            <Textarea
              value={formData.additionalNotes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  additionalNotes: e.target.value,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {hasTradeIn && (
        <Card>
          <CardHeader>
            <CardTitle>
              {t("dealer.quoteResponse.tradeIn.title")}
              {!isPremium && (
                <span className="text-sm text-muted-foreground ml-2">
                  ({t("dealer.quoteResponse.premiumRequired")})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPremium ? (
              <>
                <div className="space-y-2">
                  <Label>
                    {t("dealer.quoteResponse.tradeIn.estimatedValue")}
                  </Label>
                  <Input
                    type="number"
                    value={formData.tradeInValue}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tradeInValue: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("dealer.quoteResponse.tradeIn.condition")}</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, condition: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "dealer.quoteResponse.tradeIn.condition",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">
                        {t(
                          "dealer.quoteResponse.tradeIn.conditionOptions.excellent",
                        )}
                      </SelectItem>
                      <SelectItem value="good">
                        {t(
                          "dealer.quoteResponse.tradeIn.conditionOptions.good",
                        )}
                      </SelectItem>
                      <SelectItem value="fair">
                        {t(
                          "dealer.quoteResponse.tradeIn.conditionOptions.fair",
                        )}
                      </SelectItem>
                      <SelectItem value="poor">
                        {t(
                          "dealer.quoteResponse.tradeIn.conditionOptions.poor",
                        )}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    {t("dealer.quoteResponse.tradeIn.additionalNotes")}
                  </Label>
                  <Textarea
                    value={formData.evaluationNotes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        evaluationNotes: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.requiresInspection}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        requiresInspection: checked,
                      }))
                    }
                  />
                  <Label>
                    {t("dealer.quoteResponse.tradeIn.requireInspection")}
                  </Label>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">
                {t("dealer.quoteResponse.premiumRequired")}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Button type="submit" className="w-full" disabled={submitQuote.isPending}>
        {submitQuote.isPending
          ? t("dealer.quoteResponse.saving")
          : t("dealer.quoteResponse.submit")}
      </Button>
    </form>
  );
};
