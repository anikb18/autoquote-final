import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, CreditCard, Settings2, AlertCircle } from "lucide-react";
import { UserTable } from "@/components/dashboard/user/UserTable";
import { useState } from "react";

const SubscriptionManagement = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          *,
          user_roles (
            role
          )
        `,
        )
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    meta: {
      errorMessage: "Failed to fetch subscription data",
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="space-y-4">
          <div className="animate-pulse h-8 bg-muted rounded w-1/4"></div>
          <div className="animate-pulse h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const handleSendEmail = async (
    to: string[],
    subject: string,
    content: string,
    scheduledFor?: string,
  ) => {
    try {
      const response = await fetch("/api/send-email", {
        // Assuming you have an API endpoint for sending emails
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          subject,
          html: content,
          scheduledFor,
        }),
      });

      if (!response.ok) throw new Error("Failed to send email");

      toast({
        title: scheduledFor ? "Email Scheduled" : "Email Sent",
        description: scheduledFor
          ? "Email has been scheduled successfully"
          : "Email has been sent successfully",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "super_admin" | "admin" | "dealer" | "user",
  ) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor user subscriptions
          </p>
        </div>
        <Button>
          <Settings2 className="mr-2 h-4 w-4" />
          Subscription Settings
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subscribers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions?.filter((s) => s.subscription_status === "active")
                .length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trials</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions?.filter(
                (s) => s.subscription_status === "trialing",
              ).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceled</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions?.filter(
                (s) => s.subscription_status === "canceled",
              ).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            profiles={subscriptions}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onRoleChange={handleRoleChange}
            onSendEmail={handleSendEmail}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
