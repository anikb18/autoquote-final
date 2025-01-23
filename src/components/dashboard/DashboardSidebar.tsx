import { useUserRole } from "@/hooks/use-user-role";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  FileText,
  Mail,
  Settings,
  Car,
  MessageSquare,
  HelpCircle,
  History,
  Sun,
  Moon,
  Globe
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";

export function DashboardSidebar() {
  const { role, user } = useUserRole();
  const { t, i18n } = useTranslation('admin');
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [viewMode, setViewMode] = useState<"admin" | "dealer" | "user">(
    role === "super_admin" ? "admin" : role
  );

  const adminItems = [
    {
      title: t('tabs.overview'),
      icon: Home,
      href: "/dashboard"
    },
    {
      title: t('tabs.users'),
      icon: Users,
      href: "/dashboard/users"
    },
    {
      title: t('tabs.blog'),
      icon: FileText,
      href: "/dashboard/blog"
    },
    {
      title: t('tabs.newsletter'),
      icon: Mail,
      href: "/dashboard/newsletter"
    }
  ];

  const dealerItems = [
    {
      title: "Overview",
      icon: Home,
      href: "/dashboard"
    },
    {
      title: "Active Quotes",
      icon: MessageSquare,
      href: "/dashboard/quotes"
    },
    {
      title: "Dealership",
      icon: Car,
      href: "/dashboard/dealership"
    }
  ];

  const buyerItems = [
    {
      title: "My Quotes",
      icon: MessageSquare,
      href: "/dashboard/my-quotes"
    },
    {
      title: "Find Dealers",
      icon: Car,
      href: "/dashboard/dealers"
    }
  ];

  const items = viewMode === 'admin' ? adminItems : 
                viewMode === 'dealer' ? dealerItems : 
                buyerItems;

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex grow flex-col gap-y-5">
      {/* Header with Logo */}
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <img
          className="h-8 w-auto"
          src="/logo/dark.svg"
          alt="AutoQuote24"
        />
      </div>
      
      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col px-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="space-y-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                      location.pathname === item.href
                        ? 'bg-gray-50 text-primary font-semibold'
                        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Support Section */}
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Support
            </div>
            <ul role="list" className="mt-2 space-y-1">
              <li>
                <Link
                  to="/support"
                  className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  <HelpCircle className="h-6 w-6 shrink-0" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/changelog"
                  className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  <History className="h-6 w-6 shrink-0" />
                  Changelog
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Footer with Settings */}
      <div className="flex flex-col gap-y-2 px-6 pb-4 border-t pt-4">
        {/* Theme Switcher */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="w-full justify-start gap-x-3 rounded-md p-2"
        >
          {theme === "light" ? (
            <Moon className="h-6 w-6 shrink-0" />
          ) : (
            <Sun className="h-6 w-6 shrink-0" />
          )}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </Button>

        {/* Language Switcher */}
        <Select
          value={i18n.language}
          onValueChange={(value) => i18n.changeLanguage(value)}
        >
          <SelectTrigger className="w-full">
            <Globe className="h-5 w-5 mr-2" />
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English</SelectItem>
            <SelectItem value="fr-CA">Français</SelectItem>
          </SelectContent>
        </Select>

        {/* View Mode Switcher (for admin only) */}
        {(role === 'admin' || role === 'super_admin') && (
          <Select
            value={viewMode}
            onValueChange={(value: "admin" | "dealer" | "user") => setViewMode(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select view mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin View</SelectItem>
              <SelectItem value="dealer">Dealer View</SelectItem>
              <SelectItem value="user">User View</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {/* User Profile */}
        <div className="flex items-center gap-x-3 py-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-900 truncate">
              {user?.email?.split('@')[0]}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {user?.email}
            </span>
          </div>
        </div>
        
        <Link
          to="/dashboard/settings"
          className={cn(
            'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
            location.pathname === '/dashboard/settings'
              ? 'bg-gray-50 text-primary font-semibold'
              : 'text-gray-700 hover:text-primary hover:bg-gray-50'
          )}
        >
          <Settings className="h-6 w-6 shrink-0" />
          Settings
        </Link>
      </div>
    </div>
  );
}
