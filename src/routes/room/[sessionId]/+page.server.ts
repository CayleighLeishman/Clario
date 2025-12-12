//src/routes/room/[sessionId]/+page.server.ts
// ========================= 
// PAGE SERVER: Load Room Info
// ========================= 
// This file validates the authenticated user before entering a room.
// Uses getUser() to ensure a VERIFIED session (required for RLS).

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
  const supabase = createSupabaseServer(event.cookies);

  // --------------------------
  // SECURE USER FETCH (REQUIRED)
  // --------------------------
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    console.error("getUser() Error:", error);
  }

  // If user is NOT authenticated → redirect
  if (!user) throw redirect(303, "/login");

  // --------------------------
  // FETCH USER PROFILE (RLS SAFE)
  // --------------------------
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile error:", profileError);
  }

  if (!profile) throw redirect(303, "/login");

  // --------------------------
  // RETURN DATA TO PAGE
  // --------------------------
  return {
    sessionId,
    user: {
      id: user.id,
      role: profile.role,
      name: profile.full_name
    }
  };
};
