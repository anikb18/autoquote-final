import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useContext } from "react";
import { ViewModeContext } from "@/components/dashboard/ViewModeContext"; // Assuming you create this context

export const useUserRole = () => {
  const { toast } = useToast();
  const viewMode = useContext(ViewModeContext); // Access viewMode from context

  const {
    data: authData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!session?.user) {
          return { role: null, user: null };
        }

        // Get profile data first
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

        // Get user role
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        if (roleError && roleError.code !== "PGRST116") {
          console.error("Role fetch error:", roleError);
          throw roleError;
        }

        // Default to 'user' role if no specific role is found
        let userRole = roleData?.role || "user";

        // Override role based on viewMode
        if (viewMode === "dealer") {
          userRole = "dealer";
        } else if (viewMode === "admin") {
          userRole = "admin";
        }

        return {
          role: userRole,
          user: {
            ...session.user,
            profile: profileData || null,
          },
        };
      } catch (error) {
        console.error("Auth error:", error);
        toast({
          title: "Error",
          description:
            "Failed to fetch user data. Please try refreshing the page.",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    role: authData?.role || null,
    user: authData?.user || null,
    isLoading,
    error,
  };
};
