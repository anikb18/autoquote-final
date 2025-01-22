import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserTable } from "./user/UserTable";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/use-user-role";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<'profiles'>;

export const UserManagement = () => {
  const { toast } = useToast();
  const { role } = useUserRole();

  const { data: profiles, isLoading, error, refetch: refetchProfiles } = useQuery({
    queryKey: ['user-profiles'],
    queryFn: async () => {
      if (role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }
      
      // Fetch all profiles with their roles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role
          )
        `);
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      console.log('Fetched profiles:', profilesData);
      return profilesData as Profile[];
    },
    enabled: role === 'admin',
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "You don't have permission to access this section",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Set up real-time subscription
  useEffect(() => {
    if (role !== 'admin') return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          refetchProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchProfiles, role]);

  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Access Denied
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You don't have permission to access this section.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
      </div>
      <UserTable profiles={profiles} isLoading={isLoading} />
    </div>
  );
};