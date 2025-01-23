import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Shield } from "lucide-react";

interface SecuritySettingsData {
  two_factor_auth: boolean;
  require_email_verification: boolean;
}

export function SecuritySettings() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['security-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('category', 'security')
        .single();
      
      if (error) throw error;
      return (data?.value || {}) as SecuritySettingsData;
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        category: 'security',
        key: 'settings',
        value: {
          two_factor_auth: formData.get('twoFactorAuth') === 'on',
          require_email_verification: formData.get('requireEmailVerification') === 'on',
        }
      };

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates);

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "Security settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Require 2FA for all admin accounts
              </p>
            </div>
            <Switch
              id="twoFactorAuth"
              name="twoFactorAuth"
              defaultChecked={settings?.two_factor_auth}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="requireEmailVerification">Email Verification</Label>
              <p className="text-sm text-muted-foreground">
                Require email verification for new accounts
              </p>
            </div>
            <Switch
              id="requireEmailVerification"
              name="requireEmailVerification"
              defaultChecked={settings?.require_email_verification}
            />
          </div>

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Security Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}