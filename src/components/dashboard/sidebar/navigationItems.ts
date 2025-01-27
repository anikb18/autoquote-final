import {
  Home,
  Settings,
  Users,
  Building,
  MessageSquare,
  HandshakeIcon,
  AppWindow
} from "lucide-react";

export const dealerNavigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dealer"
  },
  {
    title: "Active Quotes",
    icon: MessageSquare,
    href: "/dealer/quotes"
  },
  {
    title: "Active Deals",
    icon: HandshakeIcon,
    href: "/dealer/active-deals"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dealer/settings"
  }
];

export const adminNavigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/admin"
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings"
  }
];

export const userNavigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard"
  },
  {
    title: "My Quotes",
    icon: MessageSquare,
    href: "/dashboard/my-quotes"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings"
  }
];

export const getNavigationItems = (role: string, unreadCount: number) => {
  return {
    adminItems: adminNavigationItems,
    dealerItems: dealerNavigationItems,
    buyerItems: userNavigationItems
  };
};