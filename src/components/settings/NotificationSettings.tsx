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

const defaultSettings: NotificationSettingsData = {
  email_notifications: false,
  push_notifications: false,
  quote_alerts: false,
  marketing_emails: false,
};

export function NotificationSettings() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .eq("category", "notifications")
          .maybeSingle();

        if (error) {
          console.error("Error fetching notification settings:", error);
          throw error;
        }

        return (data?.value || defaultSettings) as NotificationSettingsData;
      } catch (error) {
        console.error("Error in notification settings query:", error);
        toast({
          title: "Error fetching settings",
          description: "Using default notification settings",
          variant: "destructive",
        });
        return defaultSettings;
      }
    },
    meta: {
      onError: (error: Error) => {
        console.error("Settings query error:", error);
        toast({
          title: "Error",
          description: "Failed to load notification settings",
          variant: "destructive",
        });
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        category: "notifications",
        key: "settings",
        value: {
          email_notifications: formData.get("emailNotifications") === "on",
          push_notifications: formData.get("pushNotifications") === "on",
          quote_alerts: formData.get("quoteAlerts") === "on",
          marketing_emails: formData.get("marketingEmails") === "on",
        } satisfies NotificationSettingsData,
      };

      const { error } = await supabase.from("site_settings").upsert(updates);

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Error loading settings. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

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
