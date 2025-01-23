import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { PerformanceChart } from "./dashboard/PerformanceChart";
import { SalesTrendChart } from "./dashboard/SalesTrendChart";
import { MetricsCard } from "./dashboard/MetricsCard";
import { useUser } from "@/hooks/use-user";

interface DashboardData {
  total_quotes: number;
  active_quotes: number;
  completed_quotes: number;
  total_revenue: number;
  metrics_data: {
    performance: Array<{
      period: string;
      conversionRate: number;
      responseTime: number;
      revenue: number;
    }>;
  };
}

const defaultDashboardData: DashboardData = {
  total_quotes: 0,
  active_quotes: 0,
  completed_quotes: 0,
  total_revenue: 0,
  metrics_data: {
    performance: []
  }
};

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useUser();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-data', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_data')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
        throw error;
      }

      return data ? data as DashboardData : defaultDashboardData;
    },
    enabled: !!user // Only run query when user is available
  });

  if (isLoading) {
    return <div className="p-8">Loading dashboard data...</div>;
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Total Quotes"
            value={dashboardData?.total_quotes || 0}
          />
          <MetricsCard
            title="Active Quotes"
            value={dashboardData?.active_quotes || 0}
          />
          <MetricsCard
            title="Completed Quotes"
            value={dashboardData?.completed_quotes || 0}
          />
          <MetricsCard
            title="Total Revenue"
            value={dashboardData?.total_revenue || 0}
            prefix="$"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PerformanceChart data={dashboardData?.metrics_data?.performance || []} />
          <SalesTrendChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;