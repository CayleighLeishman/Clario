// src/routes/room/join/+server.ts
import { createSupabaseServer } from '$lib/utils/supabaseServer';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const supabase = createSupabaseServer(cookies);

  // AUTH (required for RLS)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  //  Read body ONCE
  const body = await request.json();
  console.log('JOIN BODY:', body);

  const { lectureId, joinCode } = body;

  // NORMALIZE JOIN CODE (THIS IS THE FIX)
  const normalizedJoinCode = joinCode?.trim().toUpperCase();

  // --------------------------
  // 1. Find lecture
  // --------------------------
  let lecture;

  if (normalizedJoinCode) {
    const { data, error } = await supabase
      .from('course_lectures')
      .select('*')
      .eq('join_code', normalizedJoinCode)
      .single();

    if (error || !data) {
      console.error('Invalid join code:', normalizedJoinCode);
      return new Response(
        JSON.stringify({ error: 'Invalid join code' }),
        { status: 400 }
      );
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
      return new Response(
        JSON.stringify({ error: 'Invalid lectureId' }),
        { status: 400 }
      );
    }

    lecture = data;
  }

  if (!lecture) {
    return new Response(
      JSON.stringify({ error: 'Missing joinCode or lectureId' }),
      { status: 400 }
    );
  }

  console.log('AUTH USER ID:', session.user.id);
  console.log('LECTURE ID:', lecture.id);

  // --------------------------
  // 2. Reuse or create session
  // --------------------------
  const { data: existing } = await supabase
    .from('active_sessions')
    .select('*')
    .eq('lecture_id', lecture.id)
    .eq('is_live', true)
    .maybeSingle();

  let sessionId: string;

  if (existing) {
    sessionId = existing.id;
  } else {
    const { data: newSession, error } = await supabase
      .from('active_sessions')
      .insert({
        lecture_id: lecture.id,
        transcriber_id: session.user.id,
        session_token: crypto.randomUUID(),
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

  return new Response(JSON.stringify({ sessionId }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
