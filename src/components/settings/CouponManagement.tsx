import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Coupon {
  id: string;
  code: string;
  name: string;
  percent_off?: number;
  amount_off?: number;
  duration: string;
}

interface PromotionCode {
  id: string;
  code: string;
  coupon: Coupon;
  active: boolean;
}

interface CouponResponse {
  coupons: Coupon[];
  promotionCodes: PromotionCode[];
}

interface CouponFormData {
  code: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  usage_limit: number;
  expires_at: string;
}

export const CouponManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    usage_limit: -1,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  });

  const { data: couponsData, refetch } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<CouponResponse>('list-coupons');
      if (error) throw error;
      return data;
    }
  });

  const handleCreateCoupon = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('create-coupon', {
        body: formData
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Coupon created successfully",
      });
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast({
        title: "Error",
        description: "Failed to create coupon",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CouponFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupon Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create New Coupon</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Coupon</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="SUMMER2024"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Summer Sale"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Summer sale discount"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value) => handleInputChange('discount_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discount_value">Discount Value</Label>
                  <Input
                    id="discount_value"
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => handleInputChange('discount_value', parseFloat(e.target.value))}
                    placeholder="10"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="usage_limit">Usage Limit (-1 for unlimited)</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => handleInputChange('usage_limit', parseInt(e.target.value))}
                    placeholder="-1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expires_at">Expiry Date</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => handleInputChange('expires_at', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCoupon} disabled={loading}>
                  Create Coupon
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="grid gap-4">
            {couponsData?.coupons.map((coupon) => (
              <Card key={coupon.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{coupon.name}</h3>
                      <p className="text-sm text-muted-foreground">Code: {coupon.code}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};