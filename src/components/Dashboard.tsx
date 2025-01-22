import React, { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import AdminDashboard from "./AdminDashboard";
import DealerDashboard from "./DealerDashboard";
import BuyerDashboard from "./BuyerDashboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import Sidebar from "@/components/ui/sidebar";
import { User } from "@supabase/supabase-js";

type ViewMode = "admin" | "dealer" | "user";

const Dashboard = () => {
  const { role, user } = useUserRole();
  const [viewMode, setViewMode] = useState<ViewMode>((role as ViewMode) || "user");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (role) {
      setViewMode(role as ViewMode);
    }
  }, [role]);

  const renderDashboard = () => {
    switch (viewMode) {
      case "admin":
        return <AdminDashboard />;
      case "dealer":
        return <DealerDashboard />;
      default:
        return <BuyerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F0FB] relative flex w-full">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5" 
           style={{ backgroundImage: 'url(/dashboard-bg.webp)' }} />
      
      <div className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out z-40 
        ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="h-full bg-white/80 backdrop-blur-md shadow-lg border-r border-gray-200/50">
          <Sidebar 
            user={user}
            onSelect={() => {}} // This can be implemented if needed
            onChangeRole={(newRole: ViewMode) => setViewMode(newRole)}
            viewMode={viewMode}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>
      </div>

      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} pt-16 p-6`}>
        {renderDashboard()}
      </main>

      {role === "admin" && (
        <div className="fixed top-4 right-4 z-50">
          <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
            <SelectTrigger className="w-[140px] text-sm h-8 bg-white/80 backdrop-blur-sm border-gray-200/50">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin View</SelectItem>
              <SelectItem value="dealer">Dealer View</SelectItem>
              <SelectItem value="user">Buyer View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default Dashboard;