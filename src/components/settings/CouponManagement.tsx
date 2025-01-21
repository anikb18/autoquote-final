import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

export const CouponManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoGenerate, setIsAutoGenerate] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: "",
    usageLimit: "-1",
    description: "",
    expiresAt: null as Date | null,
    subscriptionType: "all",
  });

  const { data: coupons, refetch } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('coupons')
        .insert({
          name: formData.name,
          code: isAutoGenerate ? generateCode() : formData.code,
          discount_type: formData.discountType,
          discount_value: parseFloat(formData.discountValue),
          usage_limit: parseInt(formData.usageLimit),
          description: formData.description,
          expires_at: formData.expiresAt,
          conditions: {
            subscription_type: formData.subscriptionType !== 'all' ? formData.subscriptionType : null
          }
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Coupon has been created successfully.",
      });
      
      refetch();
      setFormData({
        name: "",
        code: "",
        discountType: "percentage",
        discountValue: "",
        usageLimit: "-1",
        description: "",
        expiresAt: null,
        subscriptionType: "all",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create coupon",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Coupon</CardTitle>
          <CardDescription>
            Set up new discount coupons for your users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Coupon Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Summer Sale"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codeGeneration">Code Generation</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="codeGeneration"
                  checked={isAutoGenerate}
                  onCheckedChange={setIsAutoGenerate}
                />
                <Label htmlFor="codeGeneration">Auto Generate Code</Label>
              </div>
            </div>

            {!isAutoGenerate && (
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="SUMMER2024"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, discountType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value</Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                  placeholder={formData.discountType === 'percentage' ? "10" : "50"}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                placeholder="Enter -1 for unlimited usage"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Expiration Date</Label>
              <DatePicker
                date={formData.expiresAt}
                setDate={(date) => setFormData(prev => ({ ...prev, expiresAt: date }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscriptionType">Subscription Type Restriction</Label>
              <Select
                value={formData.subscriptionType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subscriptionType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="basic">Basic Subscription</SelectItem>
                  <SelectItem value="premium">Premium Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Coupon"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Coupons</CardTitle>
          <CardDescription>
            Manage your existing coupons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coupons?.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{coupon.name}</h3>
                  <p className="text-sm text-muted-foreground">Code: {coupon.code}</p>
                  <p className="text-sm text-muted-foreground">
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`} off
                  </p>
                </div>
                <Switch
                  checked={coupon.active}
                  onCheckedChange={async (checked) => {
                    const { error } = await supabase
                      .from('coupons')
                      .update({ active: checked })
                      .eq('id', coupon.id);
                    
                    if (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update coupon status",
                        variant: "destructive",
                      });
                    } else {
                      refetch();
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};