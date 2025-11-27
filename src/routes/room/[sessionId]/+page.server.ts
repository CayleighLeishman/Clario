// --------------------------
// PAGE SERVER: Load Room Info
// --------------------------
// This file checks who you are before entering a room.
// It gives the page your sessionId, your name, and your role.
// Only logged-in users can access the page.

import { createSupabaseServer } from '$lib/utils/supabaseServer';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  // --------------------------
  // GET SESSION ID
  // --------------------------
  const { sessionId } = event.params;

  // --------------------------
  // CREATE SUPABASE CLIENT
  // --------------------------
  // Must pass only the cookies, not the entire event
  const supabase = createSupabaseServer(event.cookies);

  // --------------------------
  // GET CURRENT USER SESSION
  // --------------------------
  const { data: { session } } = await supabase.auth.getSession();

  // If no session, redirect to login
  if (!session) throw redirect(303, '/login');

  // --------------------------
  // FETCH USER PROFILE
  // --------------------------
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', session.user.id)
    .single();

  // If profile not found, block access
  if (!profile) throw redirect(303, '/login');

  // --------------------------
  // RETURN DATA TO PAGE
  // --------------------------
  return {
    sessionId,
    user: {
      id: session.user.id,
      role: profile.role,
      name: profile.full_name
    }
  };
};
