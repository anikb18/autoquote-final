import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { PlusCircle, User, Settings, LogOut, Home, MessageSquare, Car } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";

const Header = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const isAuthenticated = !!session;
  const [profile, setProfile] = useState<any>(null);
  const { t } = useTranslation();
  const { role } = useUserRole();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  const getAvatarUrl = () => {
    if (session?.user?.user_metadata?.avatar_url) {
      // Use Google profile picture if available
      return session.user.user_metadata.avatar_url;
    } else if (profile?.avatar_url) {
      // Use custom avatar if set
      return profile.avatar_url;
    } else {
      // Fallback to local avatar
      return '/avatar.png';
    }
  };

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

  const handleHome = () => {
    navigate("/");
  };

  const handleRequestQuote = () => {
    navigate("/request-quote");
  };

  const handleMyQuotes = () => {
    navigate("/dashboard");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const renderAuthenticatedNav = () => {
    if (!session) return null;

    // Only show quote-related actions for regular users (buyers)
    if (role === 'user') {
      return (
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRequestQuote}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            {t('common.requestQuote')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMyQuotes}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {t('common.myQuotes')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDashboard}
            className="flex items-center gap-2"
          >
            <Car className="h-4 w-4" />
            {t('common.dashboard')}
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link to="/" aria-label="Home">
              <img
                src="/logo/dark.png"
                alt="Logo"
                className="h-8 w-auto dark:hidden"
              />
              <img
                src="/logo/light.png"
                alt="Logo"
                className="hidden h-8 w-auto dark:block"
              />
            </Link>
            {renderAuthenticatedNav()}
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeSwitcher />
            
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={getAvatarUrl()}
                        alt={profile?.full_name || session.user.email}
                      />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    {profile?.full_name || session.user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDashboard}>
                    <Car className="mr-2 h-4 w-4" />
                    {t('common.dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettings}>
                    <Settings className="mr-2 h-4 w-4" />
                    {t('common.settings')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('common.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleSignIn}>{t('common.signIn')}</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
