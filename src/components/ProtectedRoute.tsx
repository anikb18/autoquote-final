import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import SubscriptionStatus from "./SubscriptionStatus";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
  allowedRoles?: string[];
  redirectPath?: string;
}

const ProtectedRoute = ({
  children,
  requireSubscription = false,
  allowedRoles,
  redirectPath = "/auth",
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return null;

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        return { ...profileData, role: roleData?.role };
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast({
          title: "Error fetching profile",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 1,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (!session) {
          navigate(redirectPath);
          return;
        }

        // Check role-based access
        if (allowedRoles && profile?.role) {
          if (!allowedRoles.includes(profile.role)) {
            // Redirect based on role if access is denied
            if (profile.role === "admin" || profile.role === "super_admin") {
              navigate("/dashboard");
            } else if (profile.role === "dealer") {
              navigate("/dashboard/dealership");
            } else {
              navigate("/dashboard/my-quotes");
            }
            return;
          }
        }

        setIsChecking(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate(redirectPath);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate(redirectPath);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectPath, allowedRoles, profile]);

  if (isChecking || profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-2">
          <p className="text-red-500">Error loading profile</p>
          <button
            onClick={() => navigate("/auth")}
            className="text-blue-500 hover:underline"
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  if (
    requireSubscription &&
    (!profile?.subscription_status || profile.subscription_status !== "active")
  ) {
    return (
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">Premium Feature</h2>
        <p className="mb-4">This feature requires an active subscription.</p>
        <SubscriptionStatus />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
