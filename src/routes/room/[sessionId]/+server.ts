// src/routes/room/[sessionId]/+server.ts

// This file handles sending new transcript messages in a live room.
// Only users who are logged in can send messages.
// Messages are saved in the database for real-time display.


import { createSupabaseServer } from '$lib/utils/supabaseServer';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
  // --------------------------
  // CREATE SUPABASE CLIENT
  // --------------------------
  // Must pass cookies for server-side auth
  const supabase = createSupabaseServer(event.cookies);

  // --------------------------
  // GET SESSION ID FROM URL
  // --------------------------
  const { sessionId } = event.params;

  // --------------------------
  // GET MESSAGE FROM REQUEST BODY
  // --------------------------
  const { text } = await event.request.json();

  // --------------------------
  // GET CURRENT USER SESSION
  // --------------------------
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  // --------------------------
  // FETCH USER ROLE
  // --------------------------
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!profile) return new Response('Unauthorized', { status: 401 });

  // --------------------------
  // INSERT NEW MESSAGE
  // --------------------------
  const { error } = await supabase
    .from('realtime_chunks')
    .insert({
      session_id: sessionId,
      user_id: session.user.id,
      role: profile.role,
      text
    });

  // --------------------------
  // HANDLE ERRORS
  // --------------------------
  if (error) return new Response(JSON.stringify(error), { status: 400 });

  // --------------------------
  // SUCCESS RESPONSE
  // --------------------------
  return new Response('OK');
};
