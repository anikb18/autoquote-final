import {
  LayoutDashboard,
  BookOpen,
  Mail,
  BarChart3,
  Search,
  Palette,
  FileText,
  Ticket,
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
  MessageSquare
} from "lucide-react";

export const getNavigationItems = (role: string, unreadCount: number) => {
  const adminItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard"
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
          title: "Plans",
          href: "/dashboard/plans",
          icon: CreditCard
        }
      ]
    },
    {
      title: "SEO",
      icon: Search,
      href: "/dashboard/seo"
    },
    {
      title: "Design",
      icon: Palette,
      href: "/dashboard/design"
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
      title: "Active Quotes",
      icon: DollarSign,
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
      icon: DollarSign,
      href: "/dashboard/my-quotes"
    },
    {
      title: "Communication Hub",
      icon: MessageSquare,
      href: "/dashboard/communications"
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