import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserTable } from "./user/UserTable";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/use-user-role";
import { Tables } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

type Profile = Tables<'profiles'>;

export const UserManagement = () => {
  const { toast } = useToast();
  const { role } = useUserRole();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  const { data: profiles, isLoading, error, refetch: refetchProfiles } = useQuery({
    queryKey: ['user-profiles', search, page],
    queryFn: async () => {
      if (role !== 'admin' && role !== 'super_admin') {
        throw new Error('Unauthorized: Admin access required');
      }
      
      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role
          )
        `);

      if (search) {
        query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
      }

      const { data: profilesData, error: profilesError } = await query
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      return profilesData as Profile[];
    },
    enabled: role === 'admin' || role === 'super_admin',
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
    if (role !== 'admin' && role !== 'super_admin') return;

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

  if (role !== 'admin' && role !== 'super_admin') {
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

  const handleExport = () => {
    if (!profiles) return;
    
    const csv = [
      ['Email', 'Full Name', 'Role', 'Created At', 'Subscription Status'].join(','),
      ...profiles.map(profile => [
        profile.email,
        profile.full_name,
        profile.role,
        profile.created_at,
        profile.subscription_status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            User Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          Export to CSV
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <UserTable 
        profiles={profiles} 
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
};