// In src/utils/quotes.ts
import { supabase } from "@/integrations/supabase/client";

export const fetchActiveQuote = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error('Error fetching user:', userError);
    return null;
  }

  const { data, error } = await supabase
    .from('quotes') // Your quotes table
    .select('*')
    .eq('user_id', user?.id) // Get the current user's ID
    .eq('status', 'pending') // Assuming you want the active quote with a status of 'pending'
    .single(); // Fetch a single active quote

  if (error) {
    if (error.code === 'PGRST116') {
      console.warn('No active quote found for the user.');
      return null; // Handle no rows returned
    }
    console.error('Error fetching active quote:', error);
    return null;
  }

  return data; // Return the active quote data
};