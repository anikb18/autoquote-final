import React, { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import AdminDashboard from "./AdminDashboard";
import DealerDashboard from "./DealerDashboard";
import BuyerDashboard from "./BuyerDashboard";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard/DashboardSidebar";

const Dashboard = () => {
  const { role, user, isLoading: roleLoading } = useUserRole();
  const [viewMode, setViewMode] = useState<"admin" | "dealer" | "user">("user");
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access the dashboard",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        
        setIsAuthChecking(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Error",
          description: "Authentication error. Please try signing in again.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  useEffect(() => {
    if (role) {
      setViewMode(role as "admin" | "dealer" | "user");
    }
  }, [role]);

  if (isAuthChecking || roleLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (viewMode) {
      case "admin":
        return <AdminDashboard />;
      case "dealer":
        return <DealerDashboard />;
      default:
        return <BuyerDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar>
        <SidebarHeader className="border-b p-4">
          <h2 className="text-lg font-semibold">AutoQuote24</h2>
        </SidebarHeader>
        <SidebarBody>
          <DashboardSidebar />
        </SidebarBody>
        <SidebarFooter className="border-t p-4">
          <div className="text-sm text-muted-foreground">
            {user?.email}
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;