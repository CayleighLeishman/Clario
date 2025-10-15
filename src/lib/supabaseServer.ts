// src/lib/SupabaseServer.ts
// --------------------------------------------------
// This one is used in +layout.server.ts or load functions.
// It can safely read cookies and handle SSR logic.
// --------------------------------------------------

import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Cookies } from '@sveltejs/kit';


export const createSupabaseServer = (cookies : Cookies) => {
  return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, { ...options, path: '/' }),
      remove: (key, options) => cookies.set(key, '', { ...options, path: '/' }),
    },
  });
};
