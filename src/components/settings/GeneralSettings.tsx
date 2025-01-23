import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Settings } from "lucide-react";

interface GeneralSettingsData {
  site_name: string;
  support_email: string;
  platform_fee: number;
}

export function GeneralSettings() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('category', 'general')
        .single();
      
      if (error) throw error;
      return (data?.value as GeneralSettingsData) || {
        site_name: '',
        support_email: '',
        platform_fee: 0
      };
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        category: 'general',
        key: 'settings',
        value: {
          site_name: String(formData.get('siteName')),
          support_email: String(formData.get('supportEmail')),
          platform_fee: Number(formData.get('platformFee')),
        } satisfies GeneralSettingsData
      };

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates);

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "General settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
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
          <Settings className="h-5 w-5" />
          General Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              name="siteName"
              defaultValue={settings?.site_name}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              name="supportEmail"
              type="email"
              defaultValue={settings?.support_email}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platformFee">Platform Fee (%)</Label>
            <Input
              id="platformFee"
              name="platformFee"
              type="number"
              min="0"
              max="100"
              step="0.01"
              defaultValue={settings?.platform_fee}
              required
            />
          </div>

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}