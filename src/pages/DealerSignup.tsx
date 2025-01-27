import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const DealerSignup = () => {
  const { t } = useTranslation("dealer");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const dealershipName = formData.get("dealershipName") as string;
    const location = formData.get("location") as string;

    try {
      const {
        data: { user },
        error: signUpError,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            dealership_name: dealershipName,
            location: location,
            user_type: "dealer", // Add this to help identify user type
          },
        },
      });

      if (signUpError) throw signUpError;

      if (user) {
        // Create dealer profile
        const { error: profileError } = await supabase
          .from("dealer_profiles")
          .insert([
            {
              id: user.id,
              dealer_name: dealershipName,
              active: true,
              subscription_type: "basic",
            },
          ]);

        if (profileError) throw profileError;

        // Set user role as dealer
        const { error: roleError } = await supabase.from("user_roles").insert([
          {
            id: user.id,
            role: "dealer",
          },
        ]);

        if (roleError) throw roleError;

        toast({
          title: t("signup.success.title"),
          description: t("signup.success.description"),
        });

        // Redirect to dealer dashboard
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: t("signup.error.title"),
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t("signup.title")}</CardTitle>
            <CardDescription>{t("signup.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dealershipName">
                  {t("signup.form.dealershipName")}
                </Label>
                <Input
                  id="dealershipName"
                  name="dealershipName"
                  required
                  placeholder={t("signup.form.dealershipNamePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t("signup.form.location")}</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  placeholder={t("signup.form.locationPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("signup.form.email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t("signup.form.emailPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("signup.form.password")}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder={t("signup.form.passwordPlaceholder")}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("signup.form.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DealerSignup;
