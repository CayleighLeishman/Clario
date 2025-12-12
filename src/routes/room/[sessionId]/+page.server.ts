// src/routes/room/[sessionId]/+page.server.ts

import { createSupabaseServer } from '$lib/utils/supabaseServer';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

/* =========================================================================
   ROLE-BASED REDIRECT
   =========================================================================
   Sends users back to their correct "home" dashboard.
*/

function redirectToHome(role: 'client' | 'transcriber' | 'admin') {
  if (role === 'client') throw redirect(303, '/client/dashboard');
  if (role === 'transcriber') throw redirect(303, '/transcriber/dashboard');
  if (role === 'admin') throw redirect(303, '/admin/dashboard');

  throw redirect(303, '/login');
}


export const load: PageServerLoad = async (event) => {
  const { sessionId } = event.params;

  // Create Supabase client (server-side)
  const supabase = createSupabaseServer(event.cookies);

  // ---------------------------------
  // AUTH: VERIFIED USER (RLS REQUIRED)
  // ---------------------------------
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    console.error('getUser error:', error);
  }

  if (!user) throw redirect(303, '/login');

  // ---------------------------------
  // FETCH USER PROFILE (ROLE)
  // ---------------------------------
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Profile error:', profileError);
  }

  if (!profile) throw redirect(303, '/login');

  // ---------------------------------
  // FETCH LECTURE ID (EXAMPLE)
  // ---------------------------------
 // ---------------------------------
// FETCH LECTURE ID (CORRECT TABLE)
// ---------------------------------
const { data: activeSession, error: sessionError } = await supabase
  .from('active_sessions')
  .select('lecture_id')
  .eq('id', sessionId)
  .single();

if (sessionError) {
  console.error('Active session error:', sessionError);
}

if (!activeSession) {
  redirectToHome(profile.role);
}

  // ---------------------------------
  // RETURN SAFE DATA TO CLIENT
  // ---------------------------------
  return {
    sessionId,
    lectureId: activeSession!.lecture_id,
    session: {
      userId: user.id,
      role: profile.role,
      email: user.email
    }
  };
};
