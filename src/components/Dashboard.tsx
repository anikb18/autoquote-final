import { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import AdminDashboard from "./AdminDashboard";
import DealerDashboard from "./DealerDashboard";
import { BuyerDashboard } from "./BuyerDashboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type ViewMode = "admin" | "dealer" | "buyer";

const Dashboard = () => {
  const { role } = useUserRole();
  const [viewMode, setViewMode] = useState<ViewMode>(role as ViewMode || "buyer");

  const handleSettingsClick = () => {
    console.log("Settings clicked");
  };

  // Update viewMode when role changes
  useEffect(() => {
    if (role) {
      setViewMode(role as ViewMode);
    }
  }, [role]);

  // Render view mode selector for admins
  const renderViewModeSelector = () => {
    if (role !== "admin") return null;

    return (
      <div className="fixed top-4 right-4 z-50">
        <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
          <SelectTrigger className="w-[180px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SelectValue placeholder="Select view mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin View</SelectItem>
            <SelectItem value="dealer">Dealer View</SelectItem>
            <SelectItem value="buyer">Buyer View</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };

  // Render the appropriate dashboard based on view mode
  const renderDashboard = () => {
    switch (viewMode) {
      case "admin":
        return <AdminDashboard onSettingsClick={handleSettingsClick} />;
      case "dealer":
        return <DealerDashboard />;
      default:
        return <BuyerDashboard />;
    }
  };

  return (
    <>
      {renderViewModeSelector()}
      {renderDashboard()}
    </>
  );
};

export default Dashboard;