import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/design/ColorPicker";
import { Separator } from "@/components/ui/separator";
import { Palette, Type, Layout, Image } from "lucide-react";

interface DesignSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkMode: boolean;
  customFont: string;
  logoUrl: string;
  brandName: string;
}

type DesignSettingsResponse = {
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

  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['design-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('category', 'design')
        .single();

      if (error) throw error;
      
      // Type assertion to ensure the value is of type DesignSettings
      const settings = data?.value as DesignSettings;
      return settings || {
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

  const updateSettings = useMutation({
    mutationFn: async (newSettings: DesignSettings) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          category: 'design',
          key: 'theme',
          value: newSettings as unknown as Json
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your design changes have been applied successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save design settings.",
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    updateSettings.mutate(settings);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Design Settings</h2>
          <p className="text-muted-foreground">
            Customize the look and feel of your application
          </p>
        </div>
        <Button onClick={handleSave} disabled={updateSettings.isPending}>
          {updateSettings.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="colors">
        <TabsList>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Branding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <ColorPicker
                    color={settings.primaryColor}
                    onChange={(color) => setSettings(prev => ({ ...prev, primaryColor: color }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <ColorPicker
                    color={settings.secondaryColor}
                    onChange={(color) => setSettings(prev => ({ ...prev, secondaryColor: color }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <ColorPicker
                    color={settings.accentColor}
                    onChange={(color) => setSettings(prev => ({ ...prev, accentColor: color }))}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, darkMode: checked }))}
                />
                <Label>Enable Dark Mode</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Custom Font URL</Label>
                <Input
                  placeholder="https://fonts.googleapis.com/css2?family=..."
                  value={settings.customFont}
                  onChange={(e) => setSettings(prev => ({ ...prev, customFont: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  Enter a Google Fonts URL to use a custom font
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <Input
                  value={settings.brandName}
                  onChange={(e) => setSettings(prev => ({ ...prev, brandName: e.target.value }))}
                />
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                />
              </div>
              {settings.logoUrl && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div className="mt-2 p-4 border rounded-lg flex items-center justify-center">
                    <img
                      src={settings.logoUrl}
                      alt="Logo preview"
                      className="max-h-20 object-contain"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}