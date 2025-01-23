import { useUserRole } from "@/hooks/use-user-role";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  FileText,
  Mail,
  Settings,
  Car,
  MessageSquare,
  HelpCircle,
  History
} from "lucide-react";

export function DashboardSidebar() {
  const { role } = useUserRole();
  const { t } = useTranslation('admin');
  const location = useLocation();

  const adminItems = [
    {
      title: t('tabs.overview'),
      icon: Home,
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
      icon: MessageSquare,
      href: "/dashboard/quotes"
    },
    {
      title: "Dealership",
      icon: Car,
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
      icon: Car,
      href: "/dashboard/dealers"
    }
  ];

  const items = role === 'admin' ? adminItems : 
                role === 'dealer' ? dealerItems : 
                buyerItems;

  return (
    <div className="flex grow flex-col gap-y-8">
      <div className="flex h-16 shrink-0 items-center px-6 flex-col gap-2">
        <img
          className="h-8 w-auto"
          src="/logo/dark.png"
          alt="AutoQuote24"
        />
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="space-y-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                      location.pathname === item.href
                        ? 'bg-gray-50 text-primary font-semibold'
                        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className="mt-auto">
            <Link
              to="/dashboard/settings"
              className={cn(
                'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                location.pathname === '/dashboard/settings'
                  ? 'bg-gray-50 text-primary font-semibold'
                  : 'text-gray-700 hover:text-primary hover:bg-gray-50'
              )}
            >
              <Settings className="h-6 w-6 shrink-0" />
              Settings
            </Link>
          </li>
          
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Support
            </div>
            <ul role="list" className="mt-2 space-y-1">
              <li>
                <Link
                  to="/support"
                  className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  <HelpCircle className="h-6 w-6 shrink-0" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/changelog"
                  className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  <History className="h-6 w-6 shrink-0" />
                  Changelog
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
