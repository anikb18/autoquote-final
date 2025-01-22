import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, "Session:", session);
      
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        try {
          // Update user metadata
          await supabase.auth.updateUser({
            data: { subscribe_newsletter: subscribeNewsletter }
          });

          // Ensure user has a profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!profile && !profileError) {
            await supabase
              .from('profiles')
              .insert([{ id: session.user.id }]);
          }

          // Ensure user has a role
          const { data: existingRole, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (!existingRole && !roleError) {
            await supabase
              .from('user_roles')
              .insert([{ id: session.user.id, role: 'user' }]);
          }

          toast({
            title: "Success",
            description: "Successfully signed in!",
          });

          navigate("/dashboard");
        } catch (error) {
          console.error("Error during sign in:", error);
          toast({
            title: "Error",
            description: "There was a problem signing you in. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, subscribeNewsletter, toast]);

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
            onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
          />
          <Label htmlFor="newsletter">Subscribe to our newsletter</Label>
        </div>

        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: { 
                background: '#003139', 
                color: 'white',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              },
              anchor: { color: '#003139' },
            }
          }}
          providers={["google"]}
          theme="light"
        />
      </div>
    </div>
  );
};

export default Auth;