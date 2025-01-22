import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useUserRole = () => {
  const { toast } = useToast();

  const { data: authData, isLoading } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) return { role: 'user', user: null };

        // Query user_roles table
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          toast({
            title: "Error fetching role",
            description: "Using default user role",
            variant: "destructive",
          });
        }

        // Also fetch profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        return { 
          role: roleData?.role || 'user',
          user: {
            ...user,
            profile: profileData
          }
        };
      } catch (error) {
        console.error('Auth error:', error);
        return { role: 'user', user: null };
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    meta: {
      errorMessage: 'Failed to fetch user role'
    }
  });

  return {
    role: authData?.role || 'user',
    user: authData?.user,
    isLoading
  };
};