// src/lib/supabaseUser.ts
// --------------------------------------------------
// This is used ONLY in the browser (e.g., +page.svelte)
// Handles login, logout, fetching user data, etc.
// --------------------------------------------------

import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';


// Basic check to help catch missing .env values
if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase URL or ANON key in .env! ' +
    'You need PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY'
  );
}

export const supabaseUser = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
