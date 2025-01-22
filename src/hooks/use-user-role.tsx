import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useUserRole = () => {
  const { toast } = useToast();

  const { data: authData, isLoading, error } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      try {
        // First get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session?.user) return { role: null, user: null };

        // Get user role from user_roles table
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (roleError && roleError.code !== 'PGRST116') {
          console.error('Error fetching user role:', roleError);
          throw roleError;
        }

        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        // Default to 'user' role if no specific role is found
        const userRole = roleData?.role || 'user';

        return {
          role: userRole,
          user: {
            ...session.user,
            profile: profileData
          }
        };
      } catch (error) {
        console.error('Auth error:', error);
        toast({
          title: "Authentication Error",
          description: "There was a problem fetching your user data",
          variant: "destructive",
        });
        return { role: null, user: null };
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    role: authData?.role || null,
    user: authData?.user || null,
    isLoading,
    error
  };
};