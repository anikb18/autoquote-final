import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CustomToast } from "./notifications/CustomToast";
import { useEffect } from "react";

const Dashboard = () => {
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard data
        const { data, error } = await supabase.from('dashboard_data').select('*');
        if (error) throw error;

        // Handle data
        console.log(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      </div>
    </div>
  );
};

export default Dashboard;
