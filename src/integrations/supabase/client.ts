import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://zndolceqzclnprozyudy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZG9sY2VxemNsbnByb3p5dWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1Njc4MzAsImV4cCI6MjA1MjE0MzgzMH0.vEARcUkV4gyjJWYdzLJNXSOk_59QxSkC6Elw3HL1emk";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storageKey: "sb-auth-token",
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
      storage: localStorage,
      flowType: "pkce",
    },
    global: {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  },
);