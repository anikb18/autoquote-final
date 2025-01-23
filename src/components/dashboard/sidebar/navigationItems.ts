import {
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
  File
} from "lucide-react";

export const getNavigationItems = (role: string, unreadCount: number) => {
  const adminItems = [
    {
      title: "User Blog",
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
          href: "/dashboard/analytics/dealer"
        },
        {
          title: "Platform Revenue",
          href: "/dashboard/analytics/revenue"
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
      title: "Plans",
      icon: FileText,
      href: "/dashboard/plans"
    },
    {
      title: "Coupons",
      icon: Tag,
      href: "/dashboard/coupons"
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

  return { adminItems, dealerItems, buyerItems };
};