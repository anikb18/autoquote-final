import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";

type Json = Database['public']['Tables']['site_settings']['Row']['value'];

interface DesignSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkMode: boolean;
  customFont: string;
  logoUrl: string;
  brandName: string;
}

interface DesignSettingsResponse {
  value: DesignSettings;
}

export default function DesignPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<DesignSettings>({
    primaryColor: "#003139",
    secondaryColor: "#d1d2c3",
    accentColor: "#446df6",
    darkMode: false,
    customFont: "",
    logoUrl: "",
    brandName: "AutoQuote24"
  });

  const { data: savedSettings } = useQuery<DesignSettings, Error>({
    queryKey: ['design-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('category', 'design')
        .eq('key', 'theme')
        .single();

      if (error) throw error;
      
      const settingsData = data?.value as unknown as DesignSettings;
      return settingsData || {
        primaryColor: "#003139",
        secondaryColor: "#d1d2c3",
        accentColor: "#446df6",
        darkMode: false,
        customFont: "",
        logoUrl: "",
        brandName: "AutoQuote24"
      };
    }
  });

  const mutation = useMutation({
    mutationFn: async (newSettings: DesignSettings) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          category: 'design',
          key: 'theme',
          value: newSettings as unknown as Json
        });

      if (error) throw error;
      return newSettings;
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your design settings have been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Design Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
              />
            </div>
            <div>
              <Label>Secondary Color</Label>
              <Input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
              />
            </div>
            <div>
              <Label>Accent Color</Label>
              <Input
                type="color"
                value={settings.accentColor}
                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
              />
            </div>
            <div>
              <Label>Dark Mode</Label>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
              />
            </div>
            <div>
              <Label>Custom Font</Label>
              <Input
                type="text"
                value={settings.customFont}
                onChange={(e) => setSettings({ ...settings, customFont: e.target.value })}
              />
            </div>
            <div>
              <Label>Logo URL</Label>
              <Input
                type="text"
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              />
            </div>
            <div>
              <Label>Brand Name</Label>
              <Input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              />
            </div>
            <Button onClick={() => mutation.mutate(settings)}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
