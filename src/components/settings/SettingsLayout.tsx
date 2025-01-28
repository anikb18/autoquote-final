import { useUserRole } from "@/hooks/use-user-role";
import { useUser } from "@/hooks/use-user";
import {
  Settings,
  UserCircle,
  Bell,
  CreditCard,
  Lock,
  Building2,
  Users,
  Gauge,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const { role } = useUserRole();
  const { user } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getNavigationItems = () => {
    const commonItems = [
      { name: "Profile", href: "/settings/profile", icon: UserCircle },
      { name: "Notifications", href: "/settings/notifications", icon: Bell },
      { name: "Security", href: "/settings/security", icon: Lock },
    ];

    const dealerItems = [
      { name: "Dealership", href: "/settings/dealership", icon: Building2 },
      { name: "Billing", href: "/settings/billing", icon: CreditCard },
      { name: "Performance", href: "/settings/performance", icon: Gauge },
    ];

    const adminItems = [
      { name: "User Management", href: "/settings/users", icon: Users },
      { name: "Billing Plans", href: "/settings/plans", icon: Receipt },
      { name: "System Settings", href: "/settings/system", icon: Settings },
    ];

    switch (role) {
      case "admin":
        return [...commonItems, ...adminItems];
      case "dealer":
        return [...commonItems, ...dealerItems];
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          {t("settings.title")}
        </h2>
        <p className="text-muted-foreground">{t("settings.description")}</p>
      </div>
      <Separator className="my-6" />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "justify-start",
                  window.location.pathname === item.href && "bg-muted"
                )}
                onClick={() => navigate(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <div className="h-full space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}