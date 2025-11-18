import { createClient } from "@supabase/supabase-js";

// Supabase credentials from environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Test Supabase connection by querying the focus_sessions table
 * @returns {Promise<void>}
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from("focus_sessions")
      .select("*")
      .limit(1);

    console.log("Supabase test:", { data, error });

    if (error) {
      console.error("Supabase connection error:", error.message);
      return { success: false, error };
    }

    console.log("✅ Supabase connected successfully!");
    return { success: true, data };
  } catch (err) {
    console.error("Supabase test failed:", err);
    return { success: false, error: err };
  }
}
