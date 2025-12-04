// src/routes/room/join/+server.ts
import { createSupabaseServer } from '$lib/utils/supabaseServer';
import { v4 as uuid } from 'uuid';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
  try {
    const supabase = createSupabaseServer(event.cookies);

    // Extract lectureId from the request
    const { lectureId } = await event.request.json();
    console.log('Joining lectureId:', lectureId);

    // Get current user securely
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return new Response('Unauthorized', { status: 401 });
    }
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }
    console.log('Session user id:', session.user.id);

    // Create a new active session
    const sessionToken = uuid();
    const { data, error } = await supabase
      .from('active_sessions')
      .insert({
        lecture_id: lectureId,
        transcriber_id: session.user.id,
        session_token: sessionToken,
        is_live: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting active session:', error);
      return new Response(JSON.stringify(error), { status: 400 });
    }

    // Return the new session ID
    return new Response(JSON.stringify({ sessionId: data.id }), {
      headers: { 'Content-Type': 'application/json' }
    });

    // To do : Change "any" to 'unknown' and properly type error for production
  } catch (err: any) { 
    console.error('Unexpected error joining lecture:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
};
