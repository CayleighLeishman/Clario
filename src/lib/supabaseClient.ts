// src/lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr';
//this file is used to create and export the supabase client

// 1. Create the initialized client instance using the browser helper
const supabase = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

//2. Export the client so other files can import it
export { supabase };