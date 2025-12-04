// src/routes/+layout.server.ts

import { createSupabaseServer } from '$lib/utils/supabaseServer';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies, url }) => {
  console.log('src/routes/(public)/+layout.server.ts running...');

  const supabase = createSupabaseServer(cookies);

  // Get the current session
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error) console.error('Supabase error:', error);

  console.log('🧩 Session data:', session);

  const publicPages = ['/', '/about', '/contact', '/login', '/register'];

  const isPublicRoute =
    publicPages.includes(url.pathname) || url.pathname.startsWith('/(public)');

  // Redirect if not logged in
  if (!session && !isPublicRoute) {
    console.log(`Not logged in and tried to access ${url.pathname} — redirecting to /login`);
    throw redirect(303, '/login');
  }

  // Redirect logged-in users away from login page
  if (session && url.pathname === '/login') {
    const role = session.user.user_metadata?.role;

    if (role === 'client') throw redirect(303, '/client/dashboard');
    if (role === 'transcriber') throw redirect(303, '/transcriber/dashboard');
    if (role === 'admin') throw redirect(303, '/admin/dashboard');
  }

  return { session };
}) 
