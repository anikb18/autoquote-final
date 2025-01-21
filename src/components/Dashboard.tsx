import { useEffect } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import AdminDashboard from "./AdminDashboard";
import DealerDashboard from "./DealerDashboard";
import BuyerDashboard from "./BuyerDashboard";

const Dashboard = () => {
  const { role } = useUserRole();

  // Render the appropriate dashboard based on user role
  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "dealer":
      return <DealerDashboard />;
    default:
      return <BuyerDashboard />;
  }
};

export default Dashboard;