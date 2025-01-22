import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useUserRole = () => {
  const { data: userRoleData, error } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { role: 'user', user: null };

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        return { role: 'user', user };
      }

      return { 
        role: data?.role || 'user',
        user 
      };
    },
  });

  return { 
    role: userRoleData?.role || 'user', 
    user: userRoleData?.user || null 
  };
};