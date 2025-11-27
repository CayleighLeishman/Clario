// src/routes/room/join/+server.ts
import { createSupabaseServer } from '$lib/utils/supabaseServer';
import { v4 as uuid } from 'uuid';

export const POST = async (event) => {
  const supabase = createSupabaseServer(event);
  const { lectureId } = await event.request.json();

  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  // Create a new session
  const sessionToken = uuid();
  const { error, data } = await supabase
    .from('active_sessions')
    .insert({
      lecture_id: lectureId,
      transcriber_id: session.user.id,
      session_token: sessionToken,
      is_live: true
    })
    .select()
    .single();

  if (error) return new Response(JSON.stringify(error), { status: 400 });

  return new Response(JSON.stringify({ sessionId: data.id }));
};
