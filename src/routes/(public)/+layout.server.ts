// src/routes/(public)/+layout.server.ts
import { createSupabaseServer } from '$lib/utils/supabaseServer';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async (event) => {
  const supabase = createSupabaseServer(event.cookies);

  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error) console.error('Session error:', error);

  const urlPath = event.url.pathname;

  if (session && urlPath === '/login') {
    const role = session.user.user_metadata?.role;

    if (role === 'client') throw redirect(303, '/client/dashboard');
    if (role === 'transcriber') throw redirect(303, '/transcriber/dashboard');
    if (role === 'admin') throw redirect(303, '/admin/dashboard');
  }

  return { session };
}) satisfies LayoutServerLoad;
