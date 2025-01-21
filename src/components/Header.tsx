import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Header = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = () => {
    navigate("/auth");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{t('common.appName')}</h1>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
          {session ? (
            <>
              <Button onClick={handleDashboard}>{t('common.dashboard')}</Button>
              <Button variant="outline" onClick={handleSignOut}>{t('common.signOut')}</Button>
            </>
          ) : (
            <Button onClick={handleSignIn}>{t('common.signIn')}</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;