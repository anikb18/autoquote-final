import {
  Home,
  Settings,
  Users,
  Building,
  MessageSquare,
  HandshakeCheck,
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
    icon: HandshakeCheck,
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
