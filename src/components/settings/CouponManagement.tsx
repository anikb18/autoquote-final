import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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

export const CouponManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { data: couponsData } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('list-coupons');
      if (error) throw error;
      return data as { coupons: Coupon[], promotionCodes: PromotionCode[] };
    }
  });

  const handleCreateCoupon = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('create-coupon', {
        body: {
          // Add coupon creation parameters here
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Coupon created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create coupon",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupon Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleCreateCoupon} disabled={loading}>
            Create New Coupon
          </Button>
          
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