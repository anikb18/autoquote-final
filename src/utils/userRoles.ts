// In src/utils/userRoles.ts
import { supabase } from "@/integrations/supabase/client";

export const fetchUserRole = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    console.error("Error fetching user:", userError);
    return null;
  }

  const { data, error } = await supabase
    .from("profiles") // Your profiles table
    .select("role") // Select the role column
    .eq("id", user?.id) // Get the current user's ID
    .single(); // Fetch a single role

  if (error) {
    console.error("Error fetching user role:", error);
    return null;
  }

  return data?.role; // Return the user's role
};
