import { useUserRole } from "@/hooks/use-user-role";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarSection,
  SidebarHeading,
  SidebarItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  FileText,
  Mail,
  Settings,
  Building2,
  MessageSquare,
  Car
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const { role } = useUserRole();
  const { t } = useTranslation('admin');
  const location = useLocation();

  const adminItems = [
    {
      title: t('tabs.analytics'),
      icon: LayoutDashboard,
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
      icon: LayoutDashboard,
      href: "/dashboard"
    },
    {
      title: "Active Quotes",
      icon: MessageSquare,
      href: "/dashboard/quotes"
    },
    {
      title: "Dealership",
      icon: Building2,
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
      icon: Building2,
      href: "/dashboard/dealers"
    },
    {
      title: "New Quote",
      icon: Car,
      href: "/new-quote"
    }
  ];

  const items = role === 'admin' ? adminItems : 
                role === 'dealer' ? dealerItems : 
                buyerItems;

  return (
    <SidebarSection>
      <SidebarHeading>Navigation</SidebarHeading>
      {items.map((item) => (
        <SidebarItem key={item.href}>
          <Link
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
              location.pathname === item.href && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        </SidebarItem>
      ))}
      <SidebarItem>
        <Link
          to="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
            location.pathname === "/dashboard/settings" && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </SidebarItem>
    </SidebarSection>
  );
}