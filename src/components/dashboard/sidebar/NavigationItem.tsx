import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

export interface NavigationItemProps {
  item: {
    title: string;
    icon: LucideIcon;
    href: string;
    badge?: number;
    children?: Array<{
      title: string;
      href: string;
    }>;
  };
}

export function NavigationItem({ item }: NavigationItemProps) {
  const location = useLocation();
  const isActive = location.pathname === item.href;

  return (
    <li>
      <Link
        to={item.href}
        className={cn(
          'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
          isActive
            ? 'bg-gray-50 text-primary font-semibold'
            : 'text-gray-700 hover:text-primary hover:bg-gray-50'
        )}
      >
        <item.icon className="h-6 w-6 shrink-0" />
        <span className="flex-grow">{item.title}</span>
        {item.badge && (
          <Badge variant="destructive" className="ml-2">
            {item.badge}
          </Badge>
        )}
      </Link>
      {item.children && (
        <ul className="mt-1 pl-8 space-y-1">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                to={child.href}
                className={cn(
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                  location.pathname === child.href
                    ? 'bg-gray-50 text-primary font-semibold'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                )}
              >
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}