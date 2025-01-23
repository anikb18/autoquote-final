import { useUserRole } from "@/hooks/use-user-role";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  UserCircle,
  Bell,
  CreditCard,
  Lock,
  Building2,
  Users,
  Gauge,
  Receipt,
  Settings as SettingsIcon,
} from "lucide-react";

const getNavigationItems = (role: string) => {
  const commonItems = [
    { name: 'Profile', href: '/dashboard/settings/profile', icon: UserCircle },
    { name: 'Notifications', href: '/dashboard/settings/notifications', icon: Bell },
    { name: 'Security', href: '/dashboard/settings/security', icon: Lock },
  ];

  const dealerItems = [
    { name: 'Dealership', href: '/dashboard/settings/dealership', icon: Building2 },
    { name: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
    { name: 'Performance', href: '/dashboard/settings/performance', icon: Gauge },
  ];

  const adminItems = [
    { name: 'User Management', href: '/dashboard/settings/users', icon: Users },
    { name: 'Billing Plans', href: '/dashboard/settings/plans', icon: Receipt },
    { name: 'System Settings', href: '/dashboard/settings/system', icon: SettingsIcon },
  ];

  switch (role) {
    case 'admin':
      return [...commonItems, ...adminItems];
    case 'dealer':
      return [...commonItems, ...dealerItems];
    default:
      return commonItems;
  }
};

interface SettingsShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function SettingsShell({ children, title, description }: SettingsShellProps) {
  const { role } = useUserRole();
  const location = useLocation();
  const navigationItems = getNavigationItems(role);

  return (
    <div className="mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
      <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
        <nav className="flex-none px-4 sm:px-6 lg:px-0">
          <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold",
                      isActive
                        ? "bg-gray-50 text-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-gray-50"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-6 w-6 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
          <div>
            <h2 className="text-2xl font-semibold leading-7 text-foreground">{title}</h2>
            {description && (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            )}
            <div className="mt-6">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}