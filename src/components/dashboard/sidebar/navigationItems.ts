import {
  LayoutDashboard,
  BookOpen,
  Mail,
  BarChart3,
  Search,
  Palette,
  FileText,
  HelpCircle,
  Settings,
  DollarSign,
  Car,
  Tag,
  File,
  CreditCard,
  TrendingUp,
  Users,
  Building,
  MessageSquare,
  HandshakeIcon,
  AppWindow
} from "lucide-react";

export const getNavigationItems = (role: string, unreadCount: number, hasActiveQuote = false) => {
  const adminItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: CreditCard
    },
    {
      title: "Blog",
      icon: BookOpen,
      href: "/admin/blog"
    },
    {
      title: "Email",
      icon: Mail,
      href: "/admin/newsletter"
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      children: [
        {
          title: "Dealer Performance",
          href: "/admin/analytics/dealer",
          icon: Building
        },
        {
          title: "Platform Revenue",
          href: "/admin/analytics/revenue",
          icon: TrendingUp
        },
        {
          title: "User Analytics",
          href: "/admin/analytics/users",
          icon: Users
        }
      ]
    },
    {
      title: "Finances",
      icon: DollarSign,
      href: "/admin/finances",
      children: [
        {
          title: "Coupons",
          href: "/admin/coupons",
          icon: Tag
        },
        {
          title: "Subscriptions",
          href: "/admin/subscription",
          icon: CreditCard
        }
      ]
    },
    {
      title: "Pages",
      icon: AppWindow,
      href: "/admin/page-management"
    },
    {
      title: "Documents",
      icon: File,
      href: "/admin/documents"
    },
    {
      title: "Support Center",
      icon: HelpCircle,
      href: "/support",
      badge: unreadCount > 0 ? unreadCount : undefined
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
      href: "/dealer"
    },
    {
      title: "Quote Requests",
      icon: DollarSign,
      href: "/dealer/quotes"
    },
    {
      title: "Active Deals",
      icon: HandshakeIcon,
      href: "/dealer/active-deals"
    },
    {
      title: "Dealership",
      icon: Car,
      href: "/dealer/dealership"
    },
    {
      title: "Chat Hub",
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
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard"
    },
    {
      title: "My Quotes",
      icon: FileText,
      href: "/dashboard/my-quotes"
    },
    {
      title: "Communications",
      icon: MessageSquare,
      href: "/dashboard/communications",
      disabled: !hasActiveQuote
    },
    {
      title: "My Chats",
      icon: MessageSquare,
      href: "/dashboard/my-chats",
      disabled: !hasActiveQuote
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

  return { adminItems, dealerItems, buyerItems };
};
