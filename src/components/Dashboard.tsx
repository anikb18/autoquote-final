import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BuyerDashboard from "./BuyerDashboard";
import DealerDashboard from "./DealerDashboard";
import AdminDashboard from "./AdminDashboard";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle } from "lucide-react";
import { ChatbotPopup } from "./chat/ChatbotPopup";

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

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard. Please try refreshing the page or sign in again.
          </AlertDescription>
        </Alert>
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

      <ChatbotPopup />
    </div>
  );
};

export default Dashboard;