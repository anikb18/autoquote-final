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
}

const ProtectedRoute = ({ children, requireSubscription = false, allowedRoles }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Profile fetch error:', error);
        toast({
          title: "Error fetching profile",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error('Profile query error:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
      },
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
          navigate("/auth");
          return;
        }
        
        setIsChecking(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
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
  }, [navigate]);

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

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    navigate("/dashboard");
    return null;
  }

  if (requireSubscription && (!profile?.subscription_status || profile.subscription_status !== 'active')) {
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
