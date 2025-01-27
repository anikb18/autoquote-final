import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SubscriptionStatus = () => {
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-portal-session",
      );
      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open subscription portal",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <span>Current Plan:</span>
          <Badge
            variant={
              profile?.subscription_type === "premium" ? "default" : "secondary"
            }
          >
            {profile?.subscription_type === "premium" ? "Premium" : "Basic"}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <span>Status:</span>
          <Badge
            variant={
              profile?.subscription_status === "active"
                ? "default"
                : "destructive"
            }
          >
            {profile?.subscription_status || "Inactive"}
          </Badge>
        </div>
        <Button onClick={handleManageSubscription}>Manage Subscription</Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
