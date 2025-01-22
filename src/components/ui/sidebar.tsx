import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { ChevronLeft, ChevronRight, Home, Settings, BarChart2, Users, FileText, Mail } from 'lucide-react';

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

  const menuItems = [
    { id: 'overview', icon: Home, label: t('sidebar.overview') },
    { id: 'admin-metrics', icon: BarChart2, label: t('sidebar.metrics') },
    { id: 'dealer-metrics', icon: BarChart2, label: t('sidebar.dealerMetrics') },
    { id: 'dealership-comparisons', icon: Users, label: t('sidebar.comparisons') },
    { id: 'sales-trend', icon: FileText, label: t('sidebar.sales') },
    { id: 'performance', icon: BarChart2, label: t('sidebar.performance') },
    { id: 'settings', icon: Settings, label: t('sidebar.settings') },
    { id: 'support', icon: Mail, label: t('sidebar.support') },
  ];

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
              onClick={() => onSelect(item.id)}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        {!isCollapsed && (
          <Select value={viewMode} onValueChange={onChangeRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin View</SelectItem>
              <SelectItem value="dealer">Dealer View</SelectItem>
              <SelectItem value="buyer">Buyer View</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default Sidebar;