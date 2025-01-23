import { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import AdminDashboard from "./AdminDashboard";
import DealerDashboard from "./DealerDashboard";
import BuyerDashboard from "./BuyerDashboard";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard/DashboardSidebar";
import { UserManagement } from "./dashboard/UserManagement";
import { BlogManagement } from "./dashboard/BlogManagement";
import { NewsletterManagement } from "./dashboard/NewsletterManagement";
import { SettingsForm } from "./settings/SettingsForm";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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
  const location = useLocation();
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getAvatarUrl = () => {
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    } else if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    return null;
  };

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
    if (location.pathname === "/dashboard/users") {
      return <UserManagement />;
    }
    if (location.pathname === "/dashboard/blog") {
      return <BlogManagement />;
    }
    if (location.pathname === "/dashboard/newsletter") {
      return <NewsletterManagement />;
    }
    if (location.pathname === "/dashboard/settings") {
      return <SettingsForm />;
    }

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
          <div className="flex h-16 shrink-0 items-center px-6 flex-col gap-2">
            <img
              className="h-8 w-auto"
              src="/logo/dark.png"
              alt="AutoQuote24"
            />
            <span className="text-lg font-semibold text-primary">AutoQuote24</span>
          </div>
        </SidebarHeader>
        <SidebarBody>
          <DashboardSidebar />
        </SidebarBody>
        <SidebarFooter className="border-t p-4 space-y-4">
          <div className="flex items-center gap-4 px-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
          {role === 'admin' && (
            <div className="px-2 mb-4">
              <Select
                value={viewMode}
                onValueChange={(value: "admin" | "dealer" | "user") => setViewMode(value)}
              >
                <SelectTrigger>
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
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getAvatarUrl() || ''} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;