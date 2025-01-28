import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function Analytics() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard/analytics/dealer");
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="p-6">
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900">Analytics Overview</h5>
          <p className="font-normal text-gray-700">Here you can find the latest analytics data and insights.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
