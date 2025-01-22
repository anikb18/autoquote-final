import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Settings2, Globe, DollarSign, Mail, BellRing, Ticket, Users } from "lucide-react";
import { useState } from "react";
import { CouponManagement } from "./CouponManagement";
import { AffiliateSettings } from "./AffiliateSettings";
import { PricingManagement } from "./PricingManagement";

export const AdminSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save settings logic here
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Business Settings</h2>
          <p className="text-muted-foreground">
            Manage your platform settings and configurations
          </p>
        </div>
        <Settings2 className="h-6 w-6 text-muted-foreground" />
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Fees</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="dealership">Dealership Settings</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="affiliate">Affiliate Program</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="Your business name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input id="supportEmail" type="email" placeholder="support@yourbusiness.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input id="supportPhone" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance" />
                <Label htmlFor="maintenance">Enable Maintenance Mode</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Commission Settings</CardTitle>
              <CardDescription>
                Configure your platform's pricing and commission structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PricingManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure automated notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Notifications</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="newQuoteNotif" />
                  <Label htmlFor="newQuoteNotif">New Quote Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="dealerResponseNotif" />
                  <Label htmlFor="dealerResponseNotif">Dealer Response Notifications</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quoteExpiry">Quote Expiry Time (hours)</Label>
                <Input id="quoteExpiry" type="number" placeholder="48" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminderTemplate">Quote Reminder Template</Label>
                <Textarea 
                  id="reminderTemplate" 
                  placeholder="Dear {dealer_name}, you have a pending quote from {customer_name}..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dealership">
          <Card>
            <CardHeader>
              <CardTitle>Dealership Requirements</CardTitle>
              <CardDescription>
                Set requirements and verification settings for dealerships
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Verification Requirements</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="requireLicense" />
                  <Label htmlFor="requireLicense">Require Business License</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="requireInsurance" />
                  <Label htmlFor="requireInsurance">Require Insurance Proof</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="responseTime">Maximum Response Time (hours)</Label>
                <Input id="responseTime" type="number" placeholder="24" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minQuoteValidity">Minimum Quote Validity (days)</Label>
                <Input id="minQuoteValidity" type="number" placeholder="7" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coupons">
          <CouponManagement />
        </TabsContent>

        <TabsContent value="affiliate">
          <AffiliateSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
