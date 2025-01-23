import { useUserRole } from "@/hooks/use-user-role";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NavigationItem } from "./sidebar/NavigationItem";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { UserProfile } from "./sidebar/UserProfile";
import { getNavigationItems } from "./sidebar/navigationItems";

export function DashboardSidebar() {
  const { role, user } = useUserRole();
  const { t } = useTranslation('admin');
  const [viewMode, setViewMode] = useState<"admin" | "dealer" | "user">(
    role === "super_admin" ? "admin" : role
  );

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-support-messages'],
    queryFn: async () => {
      if (role === 'admin') {
        const { count } = await supabase
          .from('support_tickets')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open');
        return count || 0;
      } else {
        const { data: responses } = await supabase
          .from('support_responses')
          .select('*')
          .eq('is_admin_response', true);
        return responses?.length || 0;
      }
    },
    refetchInterval: 30000
  });

  const { adminItems, dealerItems, buyerItems } = getNavigationItems(role, unreadCount);
  const items = viewMode === 'admin' ? adminItems : 
                viewMode === 'dealer' ? dealerItems : 
                buyerItems;

  return (
    <div className="flex grow flex-col">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <img
          className="h-8 w-auto"
          src="/logo/dark.svg"
          alt="AutoQuote24"
        />
      </div>
      
      <nav className="flex flex-1 flex-col px-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="space-y-1">
              {items.map((item) => (
                <NavigationItem key={item.href} item={item} />
              ))}
            </ul>
          </li>
        </ul>
      </nav>

      <SidebarFooter 
        viewMode={viewMode}
        role={role}
        onViewModeChange={setViewMode}
      />
      
      <div className="px-6">
        <UserProfile user={user} />
      </div>
    </div>
  );
}