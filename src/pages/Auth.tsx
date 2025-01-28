import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    });

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
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We sent you a confirmation link.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to AutoQuote24</CardTitle>
          <CardDescription>Sign in or create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignUp}
            disabled={loading}
          >
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}