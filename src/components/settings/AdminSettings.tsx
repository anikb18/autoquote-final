import { SettingsShell } from "./SettingsShell";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminSettings() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        full_name: formData.get('fullName')?.toString(),
        email: formData.get('email')?.toString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "Your profile settings have been updated successfully.",
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
    <SettingsShell
      title="Admin Settings"
      description="Manage your admin account settings and preferences."
    >
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-foreground"
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                defaultValue={user?.user_metadata?.full_name}
                className="block w-full rounded-md border border-input bg-background px-3 py-2"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                defaultValue={user?.email}
                className="block w-full rounded-md border border-input bg-background px-3 py-2"
                required
              />
            </div>

            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </SettingsShell>
  );
}