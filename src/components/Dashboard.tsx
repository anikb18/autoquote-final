import React, { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import AdminDashboard from "./AdminDashboard";
import DealerDashboard from "./DealerDashboard"; // Corrected import
import BuyerDashboard from "./BuyerDashboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import Sidebar from "@/components/ui/sidebar"; // Import sidebar
import Overview from "./Overview"; // Import Overview component
import { AdminMetricsCards } from "./dashboard/AdminMetricsCards"; 

import { DealerMetricsSection } from "./dashboard/DealerMetricsSection"; // Import Dealer Metrics Section component
import   { DealershipComparison } from "./dashboard/DealershipComparison"; // Import Dealership Comparisons component
import { SalesTrendChart } from "./dashboard/SalesTrendChart"; // Import Sales Trend Chart component
import { PerformanceChart } from "./dashboard/PerformanceChart"; // Import Performance Chart component

type ViewMode = "admin" | "dealer" | "buyer";

const Dashboard = () => {
  const { role } = useUserRole();
  const [viewMode, setViewMode] = useState<ViewMode>((role as ViewMode) || "buyer");
  const [selectedSection, setSelectedSection] = useState('overview'); // Default section

  // Update viewMode when role changes
  useEffect(() => {
    if (role) {
      setViewMode(role as ViewMode);
    }
  }, [role]);

  const renderTopBar = () => (
    <div className="fixed top-0 left-0 right-0 h-12 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b flex items-center justify-between px-4 z-50">
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-sm">
          AutoQuote24 • {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Dashboard
        </span>
      </div>

      <div className="flex items-center space-x-3">
        {role === "admin" && (
          <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
            <SelectTrigger className="w-[140px] text-sm h-8">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin" className="text-sm">Admin View</SelectItem>
              <SelectItem value="dealer" className="text-sm">Dealer View</SelectItem>
              <SelectItem value="buyer" className="text-sm">Buyer View</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full"
          onClick={() => console.log("Settings clicked")}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Render the appropriate dashboard based on view mode
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
        return <Overview />; // Render Overview component
      case 'admin-metrics':
        return <AdminMetricsCards />; // Render Admin Metrics component
      case 'dealer-metrics':
        return <DealerMetricsSection />; // Render Dealer Metrics Section component
      case 'dealership-comparisons':
        return <DealershipComparison />; // Render Dealership Comparisons component
      case 'sales-trend':
        return <SalesTrendChart />; // Render Sales Trend Chart component
      case 'performance':
        return <PerformanceChart />; // Render Performance Chart component
      case 'settings':
        return <Settings />; // Render Settings component
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen flex macOS-style" style={{ backgroundImage: `url('/dashboard-bg-2.webp')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundAttachment: 'fixed' }}>
      {renderTopBar()}
      <Sidebar onSelect={setSelectedSection} />
      <main className="flex-1 ml-64 pt-12 macOS-style">
        {renderSection()}
      </main>
    </div>
  );
};

export default Dashboard;
