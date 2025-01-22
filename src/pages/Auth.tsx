import { useEffect, useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      if (event === 'SIGNED_IN') {
        setIsLoading(true);
        try {
          // Update user metadata with newsletter preference
          await supabase.auth.updateUser({
            data: { subscribe_newsletter: subscribeNewsletter }
          });
          
          // Create a default role for the user if they don't have one
          const { data: existingRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('id', session?.user.id)
            .single();

          if (!existingRole) {
            await supabase
              .from('user_roles')
              .insert([
                { id: session?.user.id, role: 'user' }
              ]);
          }

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        <div className="mb-6 flex items-center space-x-2">
          <Checkbox 
            id="newsletter" 
            checked={subscribeNewsletter}
            onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
          />
          <Label htmlFor="newsletter" className="text-sm text-gray-600">
            Subscribe to our newsletter for updates and promotions
          </Label>
        </div>
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: { background: '#003139', color: 'white' },
              anchor: { color: '#003139' },
              ...(isLoading && {
                button: { 
                  background: '#003139', 
                  color: 'white',
                  opacity: 0.7,
                  cursor: 'not-allowed'
                }
              })
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