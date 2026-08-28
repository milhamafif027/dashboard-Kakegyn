import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ggnesdegvkintfwgxwvq.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_tF8mURZeD3E9rtACHEYDqg_EmfFPehK";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
