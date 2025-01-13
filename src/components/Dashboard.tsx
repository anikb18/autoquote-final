import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BuyerDashboard from "./BuyerDashboard";
import DealerDashboard from "./DealerDashboard";

const Dashboard = () => {
  const { data: userRole, isLoading } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data?.role;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      {userRole === 'dealer' ? <DealerDashboard /> : <BuyerDashboard />}
    </div>
  );
};

export default Dashboard;