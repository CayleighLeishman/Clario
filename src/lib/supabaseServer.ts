// src/lib/SupabaseServer.ts
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'; 
import type { Cookies } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

// Admin client for server-only tasks
export const supabaseAdmin = createClient(
  PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

export const createSupabaseServer = (cookies: Cookies) => {
  return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, { ...options, path: '/' }),
      remove: (key, options) => cookies.set(key, '', { ...options, path: '/' }),
    },
  });
};

// to do: ensure only amdins can access admin features
//this file is used for server-side supabase tasks like fetching all users 
//admin taks like deletign and addig users are in supabaseadmin.ts