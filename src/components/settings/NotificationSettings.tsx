import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Bell } from "lucide-react";

interface NotificationSettingsData {
  email_notifications: boolean;
  push_notifications: boolean;
  quote_alerts: boolean;
  marketing_emails: boolean;
}

export function NotificationSettings() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('category', 'notifications')
        .single();
      
      if (error) throw error;
      return (data?.value as NotificationSettingsData) || {
        email_notifications: false,
        push_notifications: false,
        quote_alerts: false,
        marketing_emails: false
      };
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        category: 'notifications',
        key: 'settings',
        value: {
          email_notifications: formData.get('emailNotifications') === 'on',
          push_notifications: formData.get('pushNotifications') === 'on',
          quote_alerts: formData.get('quoteAlerts') === 'on',
          marketing_emails: formData.get('marketingEmails') === 'on',
        } satisfies NotificationSettingsData
      };

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates);

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "Notification preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
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
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Switch
              id="emailNotifications"
              name="emailNotifications"
              defaultChecked={settings?.email_notifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pushNotifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive real-time notifications in browser
              </p>
            </div>
            <Switch
              id="pushNotifications"
              name="pushNotifications"
              defaultChecked={settings?.push_notifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="quoteAlerts">Quote Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new quotes and responses
              </p>
            </div>
            <Switch
              id="quoteAlerts"
              name="quoteAlerts"
              defaultChecked={settings?.quote_alerts}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketingEmails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive promotional offers and updates
              </p>
            </div>
            <Switch
              id="marketingEmails"
              name="marketingEmails"
              defaultChecked={settings?.marketing_emails}
            />
          </div>

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Notification Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}