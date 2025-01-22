import React, { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import AdminDashboard from "./AdminDashboard";
import DealerDashboard from "./DealerDashboard";
import BuyerDashboard from "./BuyerDashboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import Sidebar from "@/components/ui/sidebar";
import Overview from "./Overview";
import { AdminMetricsCards } from "./dashboard/AdminMetricsCards";
import { DealerMetricsSection } from "./dashboard/DealerMetricsSection";
import { DealershipComparison } from "./dashboard/DealershipComparison";
import { SalesTrendChart } from "./dashboard/SalesTrendChart";
import { PerformanceChart } from "./dashboard/PerformanceChart";

type ViewMode = "admin" | "dealer" | "buyer";

const Dashboard = () => {
  const { role, user } = useUserRole();
  const [viewMode, setViewMode] = useState<ViewMode>((role as ViewMode) || "buyer");
  const [selectedSection, setSelectedSection] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [performanceData, setPerformanceData] = useState([
    { period: 'Jan', conversionRate: 65, responseTime: 24, revenue: 1200 },
    { period: 'Feb', conversionRate: 75, responseTime: 22, revenue: 1400 },
    { period: 'Mar', conversionRate: 70, responseTime: 20, revenue: 1300 },
  ]);

  useEffect(() => {
    if (role) {
      setViewMode(role as ViewMode);
    }
  }, [role]);

  const renderTopBar = () => (
    <div className="fixed top-0 left-0 right-0 h-12 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 border-b border-gray-200/50 flex items-center justify-between px-4 z-50">
      <div className="flex items-center space-x-2">
        {role !== "admin" && (
          <span className="font-medium text-sm text-gray-700">
            AutoQuote24 • {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Dashboard
          </span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {role === "admin" && (
          <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
            <SelectTrigger className="w-[140px] text-sm h-8 bg-gray-100 text-gray-900 border-gray-200/50">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin" className="text-sm text-gray-900">Admin View</SelectItem>
              <SelectItem value="dealer" className="text-sm text-gray-900">Dealer View</SelectItem>
              <SelectItem value="buyer" className="text-sm text-gray-900">Buyer View</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full hover:bg-gray-100/50"
          onClick={() => console.log("Settings clicked")}
        >
          <Settings className="h-4 w-4 text-gray-700" />
        </Button>
      </div>
    </div>
  );

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

  const renderSection = () => {
    switch (selectedSection) {
      case 'overview':
        return <Overview />;
      case 'admin-metrics':
        return <AdminMetricsCards />;
      case 'dealer-metrics':
        return <DealerMetricsSection />;
      case 'dealership-comparisons':
        return <DealershipComparison />;
      case 'sales-trend':
        return <SalesTrendChart />;
      case 'performance':
        return <PerformanceChart data={performanceData} />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F0FB] relative flex w-full">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5" style={{ backgroundImage: 'url(/dashboard-bg.webp)' }} />
      
      <div className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out z-40 
        ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="h-full bg-white/80 backdrop-blur-md shadow-lg border-r border-gray-200/50">
          <Sidebar 
            user={user}
            onSelect={setSelectedSection} 
            onChangeRole={setViewMode} 
            viewMode={viewMode}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>
      </div>

      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} pt-16 p-6`}>
        {renderSection()}
      </main>
    </div>
  );
};

export default Dashboard;