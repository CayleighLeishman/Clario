// src/routes/+layout.server.ts
import { createSupabaseServer } from '$lib/utils/supabaseServer';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  const supabase = createSupabaseServer(cookies);

  /* ============================================================
     AUTH: session (used ONLY for routing decisions)
     ============================================================ */
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error) console.error('Session error:', error);

  const path = url.pathname;

  const PUBLIC = ['/', '/about', '/contact', '/login', '/register'];
  const isPublic = PUBLIC.includes(path) || path.startsWith('/(public)');

  // 🚫 Not logged in → block access
  if (!session && !isPublic) {
    throw redirect(303, '/login');
  }

  // 🔄 Already logged in → redirect away from login page
  if (session && path === '/login') {
    const role = session.user.user_metadata?.role;

    if (role === 'client') throw redirect(303, '/client/dashboard');
    if (role === 'transcriber') throw redirect(303, '/transcriber/dashboard');
    if (role === 'admin') throw redirect(303, '/admin/dashboard');
  }

  /* ============================================================
     AUTHENTICATED USER (verified)
     ============================================================ */
  let settings = null;

  if (session) {
    // ✅ This actually verifies the user with Supabase
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      /* ========================================================
         LOAD USER SETTINGS (RLS-safe)
         ======================================================== */
      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      settings = data ?? null;
    }
  }

  /* ============================================================
     RETURN DATA TO ALL PAGES
     ============================================================ */
  return {
    session,
    settings
  };
};
