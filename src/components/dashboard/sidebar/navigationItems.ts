import {
  BookOpen,
  Mail,
  MessageSquare,
  BarChart3,
  Search,
  Palette,
  Image,
  FileText,
  Ticket,
  HelpCircle,
  Settings,
  DollarSign,
  Car,
  Home,
  Users,
} from "lucide-react";

export const getNavigationItems = (role: string, unreadCount: number) => {

  const adminItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/admin/dashboard"
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics"
    },
    {
      title: "Users",
      icon: Users,
      href: "/admin/users"
    },
    {
      title: "Blog",
      icon: BookOpen,
      href: "/admin/blog"
    },
    {
      title: "Newsletter",
      icon: Mail,
      href: "/admin/newsletter"
    },
    {
      title: "Coupons",
      icon: Ticket,
      href: "/admin/coupons"
    },
    {
      title: "Page Management",
      icon: FileText,
      href: "/admin/page-management"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings"
    }
  ];

  const dealerItems = [
    {
      title: "Overview",
      icon: BarChart3,
      href: "/dealer/dashboard"
    },
    {
      title: "Active Quotes",
      icon: DollarSign,
      href: "/dealer/quotes"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dealer/settings"
    },
    {
      title: "Chat",
      icon: MessageSquare,
      href: "/dealer/chat"
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
      href: "/dealer/settings"
    }
  ];

  const buyerItems = [
    {
      title: "My Quotes",
      icon: DollarSign,
      href: "/dashboard/my-quotes"
    },
    {
      title: "Communication Hub",
      icon: MessageSquare,
      href: "/dashboard/chat"
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

  if (role === "admin" || role === "super_admin") {
    return {
      adminItems,
      dealerItems,
      buyerItems,
    };
  }

  return { adminItems: [], dealerItems, buyerItems };
};
