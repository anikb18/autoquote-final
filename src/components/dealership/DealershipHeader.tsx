import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Home, Mail, LogIn } from "lucide-react";

export const DealershipHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('dealer');

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">{t('common.appName')}</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <Home className="mr-2 h-4 w-4" />
              {t('nav.home')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/blog")}>
              {t('nav.blog')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/about")}>
              {t('nav.about')}
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/contact")}>
              <Mail className="mr-2 h-4 w-4" />
              {t('nav.contact')}
            </Button>
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Button onClick={() => navigate("/auth")}>
              <LogIn className="mr-2 h-4 w-4" />
              {t('nav.signIn')}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};