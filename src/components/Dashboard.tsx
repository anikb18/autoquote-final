import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BuyerDashboard from "./BuyerDashboard";
import DealerDashboard from "./DealerDashboard";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();

  const { data: userRole, isLoading, error } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // First ensure the user has a role record
      const { data: existingRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (roleError && roleError.code === 'PGRST116') {
        // If no role exists, create a default 'buyer' role
        const { data: newRole, error: insertError } = await supabase
          .from('user_roles')
          .insert([
            { id: user.id, role: 'buyer' }
          ])
          .select('role')
          .single();

        if (insertError) {
          console.error('Error creating user role:', insertError);
          throw new Error('Failed to create user role');
        }
        return newRole?.role;
      }
      
      if (roleError) {
        console.error('Error fetching user role:', roleError);
        throw new Error('Failed to fetch user role');
      }

      return existingRole?.role;
    },
    retry: 1,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to load dashboard. Please try again later.",
        variant: "destructive",
      });
      console.error('Dashboard error:', error);
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
          <p className="text-gray-600">Please try refreshing the page or sign in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {userRole === 'dealer' ? <DealerDashboard /> : <BuyerDashboard />}
    </div>
  );
};

export default Dashboard;