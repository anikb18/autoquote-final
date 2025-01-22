import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  isFeatured: boolean;
}

const PricingManagement = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

  const { data: plans, error } = useQuery<PricingPlan[]>({
    queryKey: ['pricing-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*');
      
      if (error) throw error;
      return data.map(plan => ({
        id: plan.id,
        name: plan.name || '',
        description: plan.description || '',
        monthlyPrice: plan.monthly_price || 0,
        annualPrice: plan.annual_price || 0,
        features: plan.features as string[] || [],
        isFeatured: plan.is_featured || false
      }));
    }
  });

  const handleSavePlan = async (plan: PricingPlan) => {
    try {
      const { error } = await supabase
        .from('pricing_plans')
        .upsert({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          monthly_price: plan.monthlyPrice,
          annual_price: plan.annualPrice,
          features: plan.features,
          is_featured: plan.isFeatured
        });

      if (error) throw error;

      toast({
        title: t('pricing.success'),
        description: t('pricing.planSaved'),
      });
      setEditingPlan(null);
    } catch (error) {
      toast({
        title: t('pricing.error'),
        description: t('pricing.saveFailed'),
        variant: "destructive",
      });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('pricing_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: t('pricing.success'),
        description: t('pricing.planDeleted'),
      });
    } catch (error) {
      toast({
        title: t('pricing.error'),
        description: t('pricing.deleteFailed'),
        variant: "destructive",
      });
    }
  };

  if (error) {
    return <div>Error loading pricing plans</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('pricing.title')}</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>{t('pricing.createNew')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('pricing.newPlan')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t('pricing.planName')}</Label>
                <Input
                  value={editingPlan?.name || ''}
                  onChange={(e) => setEditingPlan(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>{t('pricing.description')}</Label>
                <Textarea
                  value={editingPlan?.description || ''}
                  onChange={(e) => setEditingPlan(prev => prev ? { ...prev, description: e.target.value } : null)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('pricing.monthlyPrice')}</Label>
                  <Input
                    type="number"
                    value={editingPlan?.monthlyPrice || 0}
                    onChange={(e) => setEditingPlan(prev => prev ? { ...prev, monthlyPrice: Number(e.target.value) } : null)}
                  />
                </div>
                <div>
                  <Label>{t('pricing.annualPrice')}</Label>
                  <Input
                    type="number"
                    value={editingPlan?.annualPrice || 0}
                    onChange={(e) => setEditingPlan(prev => prev ? { ...prev, annualPrice: Number(e.target.value) } : null)}
                  />
                </div>
              </div>
              <div>
                <Label>{t('pricing.features')}</Label>
                <Textarea
                  value={editingPlan?.features.join('\n') || ''}
                  onChange={(e) => setEditingPlan(prev => prev ? { ...prev, features: e.target.value.split('\n') } : null)}
                  placeholder={t('pricing.featuresPlaceholder')}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingPlan?.isFeatured || false}
                  onCheckedChange={(checked) => setEditingPlan(prev => prev ? { ...prev, isFeatured: checked } : null)}
                />
                <Label>{t('pricing.featured')}</Label>
              </div>
              <Button onClick={() => editingPlan && handleSavePlan(editingPlan)}>
                {t('pricing.save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <div className="space-y-2">
                <p>Monthly: ${plan.monthlyPrice}</p>
                <p>Annual: ${plan.annualPrice}</p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">{t('pricing.features')}:</h4>
                  <ul className="list-disc list-inside">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setEditingPlan(plan)}>
                    {t('pricing.edit')}
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeletePlan(plan.id)}>
                    {t('pricing.delete')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingManagement;