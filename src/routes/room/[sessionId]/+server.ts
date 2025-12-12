// src/routes/room/[sessionId]/+server.ts
import { createSupabaseServer } from '$lib/utils/supabaseServer';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
  const supabase = createSupabaseServer(event.cookies);
  const { sessionId } = event.params;

  const { text } = await event.request.json();

  // Make sure user is logged in (for RLS)
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Session error:', sessionError);
    return new Response('Unauthorized', { status: 401 });
  }

  if (!session) return new Response('Unauthorized', { status: 401 });

  // Insert a new transcript chunk
  const { error } = await supabase
    .from('realtime_chunks')
    .insert({
      session_id: sessionId,
      text_chunk: text
      // sequence_number + created_at can be defaults / nullable for now
    });

  if (error) {
    console.error('Insert chunk error:', error);
    return new Response(JSON.stringify(error), { status: 400 });
  }

  return new Response('OK');
};
