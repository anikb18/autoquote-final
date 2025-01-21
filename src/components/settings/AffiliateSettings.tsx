import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const AffiliateSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const { data: affiliateSettings, refetch } = useQuery({
    queryKey: ['affiliate-settings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('affiliate_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const { data: referrals } = useQuery({
    queryKey: ['affiliate-referrals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('affiliate_referrals')
        .select('*')
        .eq('referrer_id', user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setReferralCode(code);
  };

  useEffect(() => {
    if (!affiliateSettings?.referral_code) {
      generateReferralCode();
    } else {
      setReferralCode(affiliateSettings.referral_code);
    }
  }, [affiliateSettings]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('affiliate_settings')
        .upsert({
          user_id: user.id,
          referral_code: referralCode,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Affiliate settings have been saved.",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save affiliate settings",
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
          <CardTitle>Affiliate Settings</CardTitle>
          <CardDescription>
            Manage your affiliate program settings and view your earnings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referralCode">Your Referral Code</Label>
            <div className="flex space-x-2">
              <Input
                id="referralCode"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="SUMMER2024"
                className="flex-1"
              />
              <Button onClick={generateReferralCode} variant="outline">
                Generate New
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium">Total Earnings</h4>
              <p className="text-2xl font-bold">${affiliateSettings?.total_earnings || "0.00"}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium">Pending Earnings</h4>
              <p className="text-2xl font-bold">${affiliateSettings?.pending_earnings || "0.00"}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium">Paid Earnings</h4>
              <p className="text-2xl font-bold">${affiliateSettings?.paid_earnings || "0.00"}</p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>
            View your referral history and earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {referrals?.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Status: {referral.status}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Commission: ${referral.commission_earned}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(referral.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
            {(!referrals || referrals.length === 0) && (
              <p className="text-center text-muted-foreground">No referrals yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};