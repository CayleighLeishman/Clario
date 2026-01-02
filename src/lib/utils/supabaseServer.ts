// src/lib/utils/supabaseServer.ts

// This helper creates a Supabase client that works on the SERVER.
// We use this anywhere we need secure access to the database
// (hooks, +server.ts, page.server.ts, etc.)

import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Cookies } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js'
import { env } from '$env/dynamic/private';


// This function takes SvelteKit's cookies object
// and wires it into Supabase so auth sessions persist correctly
export const createSupabaseServer = (cookies: Cookies) => {
  return createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Read cookies (used to restore the auth session)
        get: (key) => cookies.get(key),

        // Set cookies (used when Supabase refreshes tokens)
        set: (key, value, options) =>
          cookies.set(key, value, {
            ...options,
            path: '/' // make sure cookie works across the whole app
          }),

        // Remove cookies (logout / session cleanup)
        remove: (key, options) =>
          cookies.set(key, '', {
            ...options,
            path: '/'
          })
      }
    }
  );
};

// ADMIN CLIENT (server-only)
// Uses the Service Role key for privileged operations like deleting users.
// ⚠️ Never import this into client-side code (.svelte, +page.ts, etc.)
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

