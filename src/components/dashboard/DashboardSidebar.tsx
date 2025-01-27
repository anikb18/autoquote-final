import { useUserRole } from "@/hooks/use-user-role";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NavigationItem } from "./sidebar/NavigationItem";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { UserProfile } from "./sidebar/UserProfile";
import { getNavigationItems } from "./sidebar/navigationItems";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

export function DashboardSidebar() {
  const { role } = useUserRole();
  const { t } = useTranslation("admin");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<"admin" | "dealer" | "user">(
    role === "super_admin" ? "admin" : role,
  );

  const handleViewModeChange = (mode: "admin" | "dealer" | "user") => {
    setViewMode(mode);
    // Navigate to the appropriate dashboard based on view mode
    switch (mode) {
      case "admin":
        navigate("/admin");
        break;
      case "dealer":
        navigate("/dealer");
        break;
      case "user":
        navigate("/dashboard");
        break;
    }
  };

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-support-messages"],
    queryFn: async () => {
      if (role === "admin") {
        const { count } = await supabase
          .from("support_tickets")
          .select("*", { count: "exact", head: true })
          .eq("status", "open");
        return count || 0;
      } else {
        const { data: responses } = await supabase
          .from("support_responses")
          .select("*")
          .eq("is_admin_response", true);
        return responses?.length || 0;
      }
    },
    refetchInterval: 30000,
  });

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const { adminItems, dealerItems, buyerItems } = getNavigationItems(
    role,
    unreadCount,
  );
  const items =
    viewMode === "admin"
      ? adminItems
      : viewMode === "dealer"
        ? dealerItems
        : buyerItems;

  return (
    <div className="flex grow flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b px-6">
        <img className="h-8 w-auto" src="/logo/dark.svg" alt="AutoQuote24" />
        {role === "admin" && (
          <div className="flex gap-2">
            <button
              onClick={() => handleViewModeChange("admin")}
              className={`px-3 py-1 rounded-md text-sm ${
                viewMode === "admin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => handleViewModeChange("dealer")}
              className={`px-3 py-1 rounded-md text-sm ${
                viewMode === "dealer"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              Dealer
            </button>
            <button
              onClick={() => handleViewModeChange("user")}
              className={`px-3 py-1 rounded-md text-sm ${
                viewMode === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              User
            </button>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col px-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="space-y-1">
              {items.map((item) => (
                <NavigationItem key={item.href} item={item} />
              ))}
            </ul>
          </li>
        </ul>
      </nav>

      <SidebarFooter
        viewMode={viewMode}
        role={role}
        onViewModeChange={setViewMode}
      />

      <div className="px-6 py-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("common.signOut")}
        </Button>
      </div>

      <div className="px-6">
        <UserProfile user={user} />
      </div>
    </div>
  );
}
