import React, { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import AdminDashboard from "./AdminDashboard";
import DealerDashboard from "./DealerDashboard";
import BuyerDashboard from "./BuyerDashboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Sidebar from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type ViewMode = "admin" | "dealer" | "user";

const Dashboard = () => {
  const { role, user, isLoading: roleLoading } = useUserRole();
  const [viewMode, setViewMode] = useState<ViewMode>("user");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      console.log("Setting viewMode to role:", role);
      setViewMode(role as ViewMode);
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
    console.log("Current viewMode:", viewMode);
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
    <div className="min-h-screen bg-[#F1F0FB] relative flex w-full">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5" 
           style={{ backgroundImage: 'url(/dashboard-bg.webp)' }} />
      
      <div className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out z-40 
        ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="h-full bg-white/80 backdrop-blur-md shadow-lg border-r border-gray-200/50">
          <Sidebar 
            user={user}
            onSelect={() => {}} 
            onChangeRole={(newRole: ViewMode) => setViewMode(newRole)}
            viewMode={viewMode}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>
      </div>

      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} pt-16 p-6`}>
        {renderDashboard()}
      </main>

      {role === "admin" && (
        <div className="fixed top-4 right-4 z-50">
          <Select 
            value={viewMode} 
            onValueChange={(value: ViewMode) => {
              setViewMode(value);
              toast({
                title: "View Changed",
                description: `Switched to ${value} view`,
              });
            }}
          >
            <SelectTrigger className="w-[140px] text-sm h-8 bg-white/80 backdrop-blur-sm border-gray-200/50">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin View</SelectItem>
              <SelectItem value="dealer">Dealer View</SelectItem>
              <SelectItem value="user">Buyer View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default Dashboard;