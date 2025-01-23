import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { 
  PlusCircle, 
  User, 
  Settings, 
  LogOut, 
  Home, 
  MessageSquare, 
  Car,
  Bell
} from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const isAuthenticated = !!session;
  const [profile, setProfile] = useState<any>(null);
  const { t } = useTranslation();
  const { role } = useUserRole();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  const isDashboard = location.pathname.startsWith('/dashboard');

  const { data: unreadNotifications } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: async () => {
      if (role !== 'dealer') return 0;
      const { count } = await supabase
        .from('dealer_notifications')
        .select('*', { count: 'exact' })
        .eq('dealer_id', session?.user?.id)
        .eq('read', false);
      return count || 0;
    },
    enabled: !!session && role === 'dealer' && !isDashboard
  });

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
      return session.user.user_metadata.avatar_url;
    } else if (profile?.avatar_url) {
      return profile.avatar_url;
    } else {
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

  const handleNewQuote = () => {
    navigate("/new-quote");
  };

  const handleQuoteRequests = () => {
    navigate("/quote-requests");
  };

  const handleMyQuotes = () => {
    navigate("/dashboard/my-quotes");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  if (isDashboard) {
    return null;
  }

  const renderAuthenticatedNav = () => {
    if (!session) return null;

    if (role === 'dealer') {
      return (
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleQuoteRequests}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {t('dealer.quoteRequests')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            onClick={() => navigate('/dashboard/notifications')}
          >
            <Bell className="h-4 w-4" />
            {unreadNotifications > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full bg-red-500"
              >
                {unreadNotifications}
              </Badge>
            )}
          </Button>
        </div>
      );
    }

    if (role === 'user') {
      return (
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewQuote}
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

    return (
      <div className="hidden md:flex items-center gap-4">
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
  };

  const getLogo = () => {
    if (isMobile) {
      return theme === 'dark' ? '/brandmark/light-01.svg' : '/brandmark/dark-01.svg';
    }
    return theme === 'dark' ? '/logo/light.png' : '/logo/dark.png';
  };

  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link to="/" aria-label="Home">
              <img
                src={getLogo()}
                alt="Logo"
                className="h-8 w-auto"
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