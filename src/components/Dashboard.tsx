import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BuyerDashboard from "./BuyerDashboard";
import DealerDashboard from "./DealerDashboard";
import AdminDashboard from "./AdminDashboard";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const Dashboard = () => {
  const { toast } = useToast();
  const [viewAs, setViewAs] = useState<'admin' | 'dealer' | 'buyer'>('admin');

  const { data: userRole, isLoading, error } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
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
    meta: {
      errorMessage: "Failed to load dashboard. Please try again later."
    }
  });

  // Handle error state with toast
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load dashboard. Please try again later.",
      variant: "destructive",
    });
  }

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
      {userRole === 'admin' && (
        <div className="mb-6">
          <Select value={viewAs} onValueChange={(value: 'admin' | 'dealer' | 'buyer') => setViewAs(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View dashboard as..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin View</SelectItem>
              <SelectItem value="dealer">Dealer View</SelectItem>
              <SelectItem value="buyer">Buyer View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {(userRole === 'admin' && viewAs === 'admin') ? (
        <AdminDashboard />
      ) : (userRole === 'admin' && viewAs === 'dealer') || userRole === 'dealer' ? (
        <DealerDashboard />
      ) : (
        <BuyerDashboard />
      )}
    </div>
  );
};

export default Dashboard;