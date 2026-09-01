import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Loud warning rather than a silent crash — helps a solo dev catch missing env vars fast.
  console.warn(
    "Supabase env vars are missing. Copy .env.example to .env.local and fill in your project keys."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
