// src/lib/utils/SupabaseServer.ts
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Cookies } from '@sveltejs/kit';

export const createSupabaseServer = (cookies: Cookies) => {
  return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) =>
        cookies.set(key, value, { ...options, path: '/' }),
      remove: (key, options) =>
        cookies.set(key, '', { ...options, path: '/' })
    }
  });
};
