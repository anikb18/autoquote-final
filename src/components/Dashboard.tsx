import { useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const Dashboard = () => {
  const { role, user, isLoading: roleLoading } = useUserRole();
  const [viewMode, setViewMode] = useState<"admin" | "dealer" | "user">("user");
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [profile, setProfile] = useState<any>(null);
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
        
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(profileData);
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

  // Loading state
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

  // No user state
  if (!user) {
    return null;
  }

  const renderContent = () => {
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
    <div>
      {role === 'admin' && (
        <div className="mb-6">
          <Select
            value={viewMode}
            onValueChange={(value: "admin" | "dealer" | "user") => setViewMode(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select view mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin View</SelectItem>
              <SelectItem value="dealer">Dealer View</SelectItem>
              <SelectItem value="user">User View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default Dashboard;