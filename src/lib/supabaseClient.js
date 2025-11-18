import { createClient } from "@supabase/supabase-js";
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from "@env";

// Supabase credentials from environment variables
const SUPABASE_URL =
  EXPO_PUBLIC_SUPABASE_URL || "https://bgsihysmgberzwnoajia.supabase.co";
const SUPABASE_ANON_KEY =
  EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnc2loeXNtZ2Jlcnp3bm9hamlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTc5MDEsImV4cCI6MjA3ODk3MzkwMX0.IHaoZNjnp7z-AIlDHS6h1sSQy21RA0j10FRskY79JUA";

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
