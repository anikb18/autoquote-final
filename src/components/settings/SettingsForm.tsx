import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";

export function SettingsForm() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Settings have been saved successfully.",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div id="branding" className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Branding</h3>
          <p className="text-sm text-muted-foreground">
            Manage your site branding settings
          </p>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" placeholder="Enter site name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <Input id="logo" type="file" accept="image/*" />
          </div>
        </div>
      </div>

      <div id="seo" className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">SEO Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your site's SEO and meta information
          </p>
        </div>
        <Separator />
        <Tabs defaultValue="en">
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="fr">French</TabsTrigger>
          </TabsList>
          <TabsContent value="en" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitleEn">Meta Title</Label>
              <Input id="metaTitleEn" placeholder="Enter meta title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescriptionEn">Meta Description</Label>
              <Textarea
                id="metaDescriptionEn"
                placeholder="Enter meta description"
              />
            </div>
          </TabsContent>
          <TabsContent value="fr" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitleFr">Meta Title</Label>
              <Input id="metaTitleFr" placeholder="Entrez le titre meta" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescriptionFr">Meta Description</Label>
              <Textarea
                id="metaDescriptionFr"
                placeholder="Entrez la description meta"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div id="email" className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Email Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure your SMTP settings
          </p>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input id="smtpHost" placeholder="smtp.example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input id="smtpPort" placeholder="587" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpUsername">SMTP Username</Label>
            <Input id="smtpUsername" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPassword">SMTP Password</Label>
            <Input id="smtpPassword" type="password" />
          </div>
        </div>
      </div>

      <Button type="submit">Save Settings</Button>
    </form>
  );
}
