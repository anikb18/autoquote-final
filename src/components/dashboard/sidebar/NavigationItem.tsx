import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";

export interface NavigationItemProps {
  item: {
    title: string;
    icon: LucideIcon;
    href: string;
    badge?: number;
    children?: Array<{
      title: string;
      href: string;
      icon?: LucideIcon;
    }>;
  };
}

export function NavigationItem({ item }: NavigationItemProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = location.pathname === item.href;
  const hasChildren = item.children && item.children.length > 0;

  const toggleOpen = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <li>
      <Link
        to={hasChildren ? "#" : item.href}
        onClick={toggleOpen}
        className={cn(
          "group flex items-center justify-between rounded-md p-2 text-sm leading-6",
          isActive
            ? "bg-gray-50 text-primary font-semibold"
            : "text-gray-700 hover:text-primary hover:bg-gray-50",
        )}
      >
        <div className="flex items-center gap-x-3">
          <item.icon className="h-6 w-6 shrink-0" />
          <span className="flex-grow">{item.title}</span>
        </div>
        {hasChildren && (
          <div className="ml-auto">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
        {item.badge && (
          <Badge variant="destructive" className="ml-2">
            {item.badge}
          </Badge>
        )}
      </Link>
      {hasChildren && isOpen && (
        <ul className="mt-1 pl-8 space-y-1">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                to={child.href}
                className={cn(
                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6",
                  location.pathname === child.href
                    ? "bg-gray-50 text-primary font-semibold"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50",
                )}
              >
                {child.icon && <child.icon className="h-5 w-5" />}
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
