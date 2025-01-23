import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  user: any;
  items: {
    icon: any;
    label: string;
    value: string;
  }[];
  onSelect: (value: string) => void;
  onChangeRole: (role: string) => void;
  viewMode: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({
  user,
  items,
  onSelect,
  viewMode,
  isCollapsed,
  onToggleCollapse
}: SidebarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: t('common:signOut'),
        description: t('common:signOutSuccess'),
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: t('common:error'),
        description: t('common:signOutError'),
        variant: "destructive",
      });
    }
  };

  // Map sidebar values to actual routes
  const getRouteForValue = (value: string) => {
    const routeMap: { [key: string]: string } = {
      overview: '/dashboard',
      users: '/dashboard/users',
      content: '/dashboard/blog',
      marketing: '/dashboard/newsletter',
      settings: '/dashboard/settings'
    };
    return routeMap[value] || '/dashboard';
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <div className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user?.email}
            </span>
            <span className="text-xs text-muted-foreground">
              {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 py-2">
          {items.map((item) => (
            <Link
              key={item.value}
              to={getRouteForValue(item.value)}
              onClick={() => onSelect(item.value)}
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isCollapsed && "justify-center px-2"
          )}
          onClick={handleSignOut}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
          {!isCollapsed && <span>{t('common:signOut')}</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;