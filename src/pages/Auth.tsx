import { useEffect, useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const navigate = useNavigate();
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Update user metadata with newsletter preference after sign in
        await supabase.auth.updateUser({
          data: { subscribe_newsletter: subscribeNewsletter }
        });
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, subscribeNewsletter]);

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
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          theme="light"
        />
      </div>
    </div>
  );
};

export default Auth;