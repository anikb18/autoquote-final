import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/use-user-role";
import { Link } from "react-router-dom";
import { 
  Users, 
  Settings, 
  FileText, 
  Mail, 
  Home,
  Car,
  MessageSquare,
  Building2,
  Receipt,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed?: boolean;
}

export function DashboardSidebar({ className, isCollapsed }: SidebarNavProps) {
  const { role } = useUserRole();
  const { t } = useTranslation('admin');

  const adminItems = [
    {
      title: t('tabs.analytics'),
      icon: PieChart,
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
      icon: Home,
      href: "/dashboard"
    },
    {
      title: "Active Quotes",
      icon: Receipt,
      href: "/dashboard/quotes"
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/dashboard/messages"
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
      icon: Receipt,
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
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/dashboard/messages"
    }
  ];

  const items = role === 'admin' ? adminItems : 
                role === 'dealer' ? dealerItems : 
                buyerItems;

  return (
    <nav className={cn("flex space-y-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)}>
      {items.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isCollapsed ? "h-12 w-12 p-0" : "h-10 px-4",
          )}
          asChild
        >
          <Link
            to={item.href}
            className="flex items-center gap-3"
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && (
              <span>{item.title}</span>
            )}
          </Link>
        </Button>
      ))}
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          isCollapsed ? "h-12 w-12 p-0" : "h-10 px-4",
        )}
        asChild
      >
        <Link
          to="/dashboard/settings"
          className="flex items-center gap-3"
        >
          <Settings className="h-5 w-5" />
          {!isCollapsed && (
            <span>Settings</span>
          )}
        </Link>
      </Button>
    </nav>
  );
}