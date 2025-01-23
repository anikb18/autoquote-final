import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Json } from "@/integrations/supabase/types";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  isFeatured: boolean;
}

const defaultPlan: PricingPlan = {
  id: '',
  name: '',
  description: '',
  monthlyPrice: 0,
  annualPrice: 0,
  features: [],
  isFeatured: false
};

const PricingManagement = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

  const { data: plans = [], error } = useQuery({
    queryKey: ['pricing-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*');
      
      if (error) throw error;

      return (data as any[]).map(plan => ({
        id: plan.id,
        name: plan.name || '',
        description: plan.description || '',
        monthlyPrice: plan.monthly_price || 0,
        annualPrice: plan.annual_price || 0,
        features: Array.isArray(plan.features) 
          ? plan.features.map(f => String(f))
          : [],
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
      <div className="flex justify-between items-center mb-6">
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
                  onChange={(e) => setEditingPlan(prev => prev ? { ...prev, name: e.target.value } : defaultPlan)}
                />
              </div>
              <div>
                <Label>{t('pricing.description')}</Label>
                <Textarea
                  value={editingPlan?.description || ''}
                  onChange={(e) => setEditingPlan(prev => prev ? { ...prev, description: e.target.value } : defaultPlan)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('pricing.monthlyPrice')}</Label>
                  <Input
                    type="number"
                    value={editingPlan?.monthlyPrice || 0}
                    onChange={(e) => setEditingPlan(prev => prev ? { ...prev, monthlyPrice: Number(e.target.value) } : defaultPlan)}
                  />
                </div>
                <div>
                  <Label>{t('pricing.annualPrice')}</Label>
                  <Input
                    type="number"
                    value={editingPlan?.annualPrice || 0}
                    onChange={(e) => setEditingPlan(prev => prev ? { ...prev, annualPrice: Number(e.target.value) } : defaultPlan)}
                  />
                </div>
              </div>
              <div>
                <Label>{t('pricing.features')}</Label>
                <Textarea
                  value={editingPlan?.features.join('\n') || ''}
                  onChange={(e) => setEditingPlan(prev => prev ? { ...prev, features: e.target.value.split('\n').filter(Boolean) } : defaultPlan)}
                  placeholder={t('pricing.featuresPlaceholder')}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingPlan?.isFeatured || false}
                  onCheckedChange={(checked) => setEditingPlan(prev => prev ? { ...prev, isFeatured: checked } : defaultPlan)}
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Monthly Price</TableHead>
            <TableHead>Annual Price</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell>{plan.name}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>${plan.monthlyPrice}</TableCell>
              <TableCell>${plan.annualPrice}</TableCell>
              <TableCell>{plan.isFeatured ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => setEditingPlan(plan)}>
                  {t('pricing.edit')}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                  {t('pricing.delete')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PricingManagement;
