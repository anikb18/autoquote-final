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
  Handshake,
  AppWindow
} from "lucide-react";

export const getNavigationItems = (role: string, unreadCount: number, hasActiveQuote = false) => {
  const adminItems = [
    {
      title: "Dashboard",
      href: "/dashboard/",
      icon: CreditCard
    },
    {
      title: "Blog",
      icon: BookOpen,
      href: "/dashboard/blog"
    },
    {
      title: "Email",
      icon: Mail,
      href: "/dashboard/newsletter"
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
      children: [
        {
          title: "Dealer Performance",
          href: "/dashboard/analytics/dealer",
          icon: Building
        },
        {
          title: "Platform Revenue",
          href: "/dashboard/analytics/revenue",
          icon: TrendingUp
        },
        {
          title: "User Analytics",
          href: "/dashboard/analytics/users",
          icon: Users
        }
      ]
    },
    {
      title: "Finances",
      icon: DollarSign,
      href: "/dashboard/finances",
      children: [
        {
          title: "Coupons",
          href: "/dashboard/coupons",
          icon: Tag
        },
        {
          title: "Subscriptions",
          href: "/subscription",
          icon: CreditCard
        }
      ]
    },
    {
      title: "Pages",
      icon: AppWindow,
      href: "/dashboard/page-management"
    },
    {
      title: "Documents",
      icon: File,
      href: "/dashboard/documents"
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
      href: "/dashboard/settings"
    }
  ];

  const dealerItems = [
    {
      title: "Overview",
      icon: BarChart3,
      href: "/dashboard"
    },
    {
      title: "Quote Requests",
      icon: DollarSign,
      href: "/dashboard/quotes"
    },
    {
      title: "Active Deals",
      icon: Handshake,
      href: "/dashboard/active-deals"
    },
    {
      title: "Dealership",
      icon: Car,
      href: "/dashboard/dealership"
    },
    {
      title: "Chat Hub",
      icon: MessageSquare,
      href: "/dashboard/dealer-chat"
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
      title: "New Quote",
      icon: DollarSign,
      href: "/dashboard/new-quote"
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
