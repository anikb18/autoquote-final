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
  Globe,
  Ticket,
  Database,
  BarChart,
  Search,
  Image,
  PaintBucket,
  Tag
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
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function DashboardSidebar() {
  const { role, user } = useUserRole();
  const { t, i18n } = useTranslation('admin');
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [viewMode, setViewMode] = useState<"admin" | "dealer" | "user">(
    role === "super_admin" ? "admin" : role
  );

  // Query for unread support messages/responses
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-support-messages'],
    queryFn: async () => {
      if (role === 'admin') {
        const { count } = await supabase
          .from('support_tickets')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open');
        return count || 0;
      } else {
        const { data: responses } = await supabase
          .from('support_responses')
          .select('*')
          .eq('is_admin_response', true);
        return responses?.length || 0;
      }
    },
    refetchInterval: 30000
  });

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
      title: "Content",
      icon: FileText,
      href: "/dashboard/content",
      children: [
        {
          title: "Blog Posts",
          href: "/dashboard/blog"
        },
        {
          title: "Pages",
          href: "/dashboard/pages"
        }
      ]
    },
    {
      title: "Marketing",
      icon: Mail,
      href: "/dashboard/marketing",
      children: [
        {
          title: "Newsletter",
          href: "/dashboard/newsletter"
        },
        {
          title: "Promotions",
          href: "/dashboard/promotions"
        }
      ]
    },
    {
      title: "Analytics",
      icon: BarChart,
      href: "/dashboard/analytics"
    },
    {
      title: "SEO",
      icon: Search,
      href: "/dashboard/seo"
    },
    {
      title: "Design",
      icon: PaintBucket,
      href: "/dashboard/design",
      children: [
        {
          title: "Theme",
          href: "/dashboard/theme"
        },
        {
          title: "Media Library",
          href: "/dashboard/media"
        }
      ]
    },
    {
      title: "E-commerce",
      icon: Tag,
      href: "/dashboard/ecommerce",
      children: [
        {
          title: "Products",
          href: "/dashboard/products"
        },
        {
          title: "Orders",
          href: "/dashboard/orders"
        },
        {
          title: "Coupons",
          href: "/dashboard/coupons"
        }
      ]
    },
    {
      title: "Support Center",
      icon: Ticket,
      href: "/support",
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      title: t('tabs.settings'),
      icon: Settings,
      href: "/dashboard/settings"
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
    },
    {
      title: "Support",
      icon: HelpCircle,
      href: "/support",
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings"
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
    },
    {
      title: "Support",
      icon: HelpCircle,
      href: "/support",
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings"
    }
  ];

  const items = viewMode === 'admin' ? adminItems : 
                viewMode === 'dealer' ? dealerItems : 
                buyerItems;

  return (
    <div className="flex grow flex-col gap-y-5">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <img
          className="h-8 w-auto"
          src="/logo/dark.svg"
          alt="AutoQuote24"
        />
      </div>
      
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
                    <span className="flex-grow">{item.title}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="ml-2">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                  {item.children && (
                    <ul className="mt-1 pl-8 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            to={child.href}
                            className={cn(
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                              location.pathname === child.href
                                ? 'bg-gray-50 text-primary font-semibold'
                                : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                            )}
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>

      <div className="flex flex-col gap-y-2 px-6 pb-4 border-t pt-4">
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
      </div>
    </div>
  );
}