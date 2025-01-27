import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const subscribeNewsletterRef = useRef(subscribeNewsletter);

  useEffect(() => {
    subscribeNewsletterRef.current = subscribeNewsletter;
  }, [subscribeNewsletter]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          // Get user role
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          // Redirect based on role
          if (roleData?.role === "admin" || roleData?.role === "super_admin") {
            navigate("/dashboard");
          } else if (roleData?.role === "dealer") {
            navigate("/dashboard/dealership");
          } else {
            navigate("/dashboard/my-quotes");
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setIsLoading(true);
        try {
          await supabase.auth.updateUser({
            data: { subscribe_newsletter: subscribeNewsletterRef.current },
          });

          // Upsert profile and role in parallel
          await Promise.all([
            supabase.from("profiles").upsert({ id: session.user.id }),
            supabase
              .from("user_roles")
              .upsert(
                { id: session.user.id, role: "user" },
                { onConflict: "id", ignoreDuplicates: true },
              ),
          ]);

          // Get fresh role data
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          // Redirect based on role
          if (roleData?.role === "admin" || roleData?.role === "super_admin") {
            navigate("/dashboard");
          } else if (roleData?.role === "dealer") {
            navigate("/dashboard/dealership");
          } else {
            navigate("/dashboard/my-quotes");
          }
        } catch (error) {
          console.error("Sign in error:", error);
          toast({
            title: "Error",
            description:
              error instanceof Error ? error.message : "Sign in failed",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome to AutoQuote24</h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="newsletter"
            checked={subscribeNewsletter}
            onCheckedChange={(checked) =>
              setSubscribeNewsletter(checked as boolean)
            }
          />
          <Label htmlFor="newsletter">Subscribe to our newsletter</Label>
        </div>

        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: {
                background: "#003139",
                color: "white",
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              },
              anchor: { color: "#003139" },
            },
          }}
          providers={["google"]}
          theme="light"
        />
      </div>
    </div>
  );
};

export default Auth;
