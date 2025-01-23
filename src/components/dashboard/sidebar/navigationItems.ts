import {
  Home,
  Users,
  FileText,
  Mail,
  Settings,
  Car,
  MessageSquare,
  BarChart,
  Search,
  Image,
  PaintBucket,
  Tag,
  Ticket,
} from "lucide-react";

export const getNavigationItems = (role: string, unreadCount: number) => {
  const adminItems = [
    {
      title: "Overview",
      icon: Home,
      href: "/dashboard"
    },
    {
      title: "Users",
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
      title: "Settings",
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
      icon: Ticket,
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
      icon: Ticket,
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