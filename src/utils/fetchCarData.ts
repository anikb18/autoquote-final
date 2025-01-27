// In src/utils/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zndolceqzclnprozyudy.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_KEY || ""; // Ensure you set this in your .env file
const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchCarsFromSupabase = async () => {
  const { data, error } = await supabase
    .from("quotes") // Replace with your actual table name
    .select("*");

  if (error) {
    console.error("Error fetching cars:", error);
    return [];
  }

  return data;
};
