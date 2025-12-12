// src/routes/(public)/+layout.server.ts
import { createSupabaseServer } from '$lib/utils/supabaseServer';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies, url }) => {
  const supabase = createSupabaseServer(cookies);

  // Get session safely
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error) console.error("Session error:", error);

  const path = url.pathname;

  // ------------------------------
  // 1. Public routes (ALLOWED)
  // ------------------------------
  const PUBLIC_ROUTES = ['/', '/about', '/contact', '/login', '/register'];
  const isPublic = PUBLIC_ROUTES.includes(path) || path.startsWith('/(public)');

  // ------------------------------
  // 2. If NOT logged in → redirect to /login
  // ------------------------------
  if (!session && !isPublic) {
    throw redirect(303, '/login');
  }

  // ------------------------------
  // 3. If logged in AND trying to access /login → redirect by role
  // ------------------------------
  if (session && path === '/login') {
    const role = session.user.user_metadata?.role;

    if (role === 'client') throw redirect(303, '/client/dashboard');
    if (role === 'transcriber') throw redirect(303, '/transcriber/dashboard');
    if (role === 'admin') throw redirect(303, '/admin/dashboard');
  }

  // ------------------------------
  // 4. Return session to the page
  // ------------------------------
  return { session };
}) satisfies LayoutServerLoad;
