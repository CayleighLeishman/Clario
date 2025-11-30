// src/lib/utils/supabaseBrowser.ts

import { createClient } from '@supabase/supabase-js';

// The URL to your Supabase project, safe for the browser.
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;

// The public anon key, safe for client use with Row Level Security.
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Creates a Supabase client for browser usage, handling sessions and realtime updates.
export function createSupabaseBrowser() {
	return createClient(supabaseUrl, supabaseKey);
}
