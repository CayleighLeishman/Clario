// src/routes/room/join/+server.ts
import { createSupabaseServer } from '$lib/utils/supabaseServer';
import type { RequestHandler } from './$types';
import { v4 as uuid } from 'uuid';

export const POST: RequestHandler = async (event) => {
  const supabase = createSupabaseServer(event.cookies);

  // ✅ Verified auth (required for RLS)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { lectureId, joinCode } = await event.request.json();

  // --------------------------
  // 1. Find lecture
  // --------------------------
  let lecture;

  if (joinCode) {
    const { data, error } = await supabase
      .from('course_lectures')
      .select('*')
      .eq('join_code', joinCode)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Invalid join code' }), { status: 400 });
    }

    lecture = data;
  }

  if (!lecture && lectureId) {
    const { data, error } = await supabase
      .from('course_lectures')
      .select('*')
      .eq('id', lectureId)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Invalid lectureId' }), { status: 400 });
    }

    lecture = data;
  }

  if (!lecture) {
    return new Response('Missing joinCode or lectureId', { status: 400 });
  }

  // --------------------------
  // 2. Check for existing live session
  // --------------------------
  const { data: existing } = await supabase
    .from('active_sessions')
    .select('*')
    .eq('lecture_id', lecture.id)
    .eq('is_live', true)
    .maybeSingle();

  let sessionId;

  // --------------------------
  // 3. Reuse OR create session
  // --------------------------
  if (existing) {
    sessionId = existing.id;
  } else {
    const newToken = uuid();

    const { data: newSession, error } = await supabase
      .from('active_sessions')
      .insert({
        lecture_id: lecture.id,
        session_token: newToken,
        is_live: true
      })
      .select()
      .single();

    if (error || !newSession) {
      console.error('Session creation failed:', error);
      return new Response('Error creating session', { status: 500 });
    }

    sessionId = newSession.id;
  }

  // --------------------------
  // 4. Return sessionId
  // --------------------------
  return new Response(JSON.stringify({ sessionId }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
