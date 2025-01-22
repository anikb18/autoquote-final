import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useUserRole = () => {
  const { data: userRoleData } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { role: 'user', user: null };

      // Query user_roles table directly
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      return { 
        role: roleData?.role || 'user',
        user 
      };
    },
  });

  return { 
    role: userRoleData?.role || 'user', 
    user: userRoleData?.user || null 
  };
};