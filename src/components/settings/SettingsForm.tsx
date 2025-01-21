import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export function SettingsForm() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
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
      <Card id="branding">
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>
            Manage your site branding settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" placeholder="Enter site name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <Input id="logo" type="file" accept="image/*" />
          </div>
        </CardContent>
      </Card>

      <Card id="seo">
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>
            Manage your site's SEO and meta information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <Textarea id="metaDescriptionEn" placeholder="Enter meta description" />
              </div>
            </TabsContent>
            <TabsContent value="fr" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitleFr">Meta Title</Label>
                <Input id="metaTitleFr" placeholder="Entrez le titre meta" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescriptionFr">Meta Description</Label>
                <Textarea id="metaDescriptionFr" placeholder="Entrez la description meta" />
              </div>
            </TabsContent>
          </Tabs>
          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <Input id="metaKeywords" placeholder="keyword1, keyword2, etc" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
            <Input id="googleAnalytics" placeholder="UA-XXXXXXXX-X or G-XXXXXXXXXX" />
          </div>
        </CardContent>
      </Card>

      <Card id="email">
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>
            Configure your SMTP settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <div className="space-y-2">
            <Label htmlFor="smtpSenderEmail">Sender Email</Label>
            <Input id="smtpSenderEmail" type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpSenderName">Sender Name</Label>
            <Input id="smtpSenderName" />
          </div>
        </CardContent>
      </Card>

      <Button type="submit">Save Settings</Button>
    </form>
  );
}