import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { ChevronLeft, ChevronRight, Home, Settings, BarChart2, Users, FileText, Mail, Car, ShoppingCart, Store } from 'lucide-react';
import { useUserRole } from '@/hooks/use-user-role';

interface SidebarProps {
  user: any;
  onSelect: (section: string) => void;
  onChangeRole: (role: string) => void;
  viewMode: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  onSelect, 
  onChangeRole, 
  viewMode,
  isCollapsed = false,
  onToggleCollapse 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role } = useUserRole();

  const getMenuItems = () => {
    const commonItems = [
      { id: 'overview', icon: Home, label: t('sidebar.overview'), path: '/dashboard' },
    ];

    const adminItems = [
      ...commonItems,
      { id: 'admin-metrics', icon: BarChart2, label: t('sidebar.metrics'), path: '/dashboard/admin-metrics' },
      { id: 'users', icon: Users, label: t('sidebar.users'), path: '/dashboard/users' },
      { id: 'blog', icon: FileText, label: t('sidebar.blog'), path: '/dashboard/blog' },
      { id: 'settings', icon: Settings, label: t('sidebar.settings'), path: '/dashboard/settings' },
    ];

    const dealerItems = [
      ...commonItems,
      { id: 'dealer-metrics', icon: BarChart2, label: t('sidebar.dealerMetrics'), path: '/dashboard/dealer-metrics' },
      { id: 'inventory', icon: Car, label: t('sidebar.inventory'), path: '/dashboard/inventory' },
      { id: 'quotes', icon: ShoppingCart, label: t('sidebar.quotes'), path: '/dashboard/quotes' },
    ];

    const userItems = [
      ...commonItems,
      { id: 'my-quotes', icon: FileText, label: t('sidebar.myQuotes'), path: '/dashboard/my-quotes' },
      { id: 'dealers', icon: Store, label: t('sidebar.dealers'), path: '/dashboard/dealers' },
    ];

    switch (role) {
      case 'admin':
        return adminItems;
      case 'dealer':
        return dealerItems;
      default:
        return userItems;
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const menuItems = getMenuItems();

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 flex justify-between items-center border-b">
        <div className={`transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
          <img 
            src="/logo.svg" 
            alt="Logo" 
            className="h-8"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-2 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-4'}`}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>

      {role === 'admin' && !isCollapsed && (
        <div className="p-4 border-t">
          <Select value={viewMode} onValueChange={onChangeRole}>
            <SelectTrigger>
              <SelectValue placeholder={t('common.selectView')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">{t('common.adminView')}</SelectItem>
              <SelectItem value="dealer">{t('common.dealerView')}</SelectItem>
              <SelectItem value="buyer">{t('common.buyerView')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default Sidebar;