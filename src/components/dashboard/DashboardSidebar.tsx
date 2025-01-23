import { useUserRole } from "@/hooks/use-user-role";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                    location.pathname === item.href && "bg-gray-100 text-gray-900"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/dashboard/settings"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                  location.pathname === "/dashboard/settings" && "bg-gray-100 text-gray-900"
                )}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}