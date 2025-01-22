import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LayoutDashboard, Settings, Users, FileText, BarChart3 } from "lucide-react";

interface SidebarProps {
  user: any;
  onSelect: (section: string) => void;
  onChangeRole: (role: string) => void;
  viewMode: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({ user, onSelect, onChangeRole, viewMode, isCollapsed, onToggleCollapse }: SidebarProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-gray-200/50">
        <span className={`font-semibold transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
          Dashboard
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100/50 rounded-full"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-gray-100/50"
              onClick={() => onSelect('overview')}
            >
              <LayoutDashboard size={20} />
              {!isCollapsed && <span>Overview</span>}
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-gray-100/50"
              onClick={() => onSelect('admin-metrics')}
            >
              <BarChart3 size={20} />
              {!isCollapsed && <span>Metrics</span>}
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-gray-100/50"
              onClick={() => onSelect('users')}
            >
              <Users size={20} />
              {!isCollapsed && <span>Users</span>}
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-gray-100/50"
              onClick={() => onSelect('settings')}
            >
              <Settings size={20} />
              {!isCollapsed && <span>Settings</span>}
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-gray-100/50"
              onClick={() => onSelect('reports')}
            >
              <FileText size={20} />
              {!isCollapsed && <span>Reports</span>}
            </Button>
          </li>
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-gray-500 truncate">{viewMode}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;