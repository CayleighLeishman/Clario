// src/routes/room/[sessionId]/+server.ts

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/* =========================================================================
   POST: Receive live transcription text from a transcriber
   -------------------------------------------------------------------------
   This endpoint is hit while the transcriber is typing (debounced)
   and when they submit a final line (Enter key).

   All this does:
   - take the text
   - save it to the database
   - Supabase Realtime handles the rest
   ========================================================================= */


export const POST: RequestHandler = async ({ request, locals, params }) => {

  console.log('🔥 POST /room/[sessionId] HIT');
  console.log('➡️ sessionId:', params.sessionId);

  /* -----------------------------------------------------------------------
     1. Make sure we actually have a Supabase client
     -----------------------------------------------------------------------
     This should always exist if hooks.server.ts ran correctly.
     If it doesn't, we fail fast instead of crashing later.
  ----------------------------------------------------------------------- */
  const supabase = locals.supabase;

  if (!supabase) {
    console.error('Supabase client missing in locals');
    return json(
      { success: false, message: 'Server auth not initialized' },
      { status: 500 }
    );
  }

  /* -----------------------------------------------------------------------
     2. Read the text sent from the client
     -----------------------------------------------------------------------
     Expected body:
     {
       text: "some transcription text"
     }
  ----------------------------------------------------------------------- */
  const { text } = await request.json();

  if (!text || !text.trim()) {
    return json(
      { success: false, message: 'Missing text' },
      { status: 400 }
    );
  }

  /* -----------------------------------------------------------------------
     3. Get the session ID from the URL
     -----------------------------------------------------------------------
     Route: /room/[sessionId]
  ----------------------------------------------------------------------- */
  const sessionId = params.sessionId;
    console.log('src/room/seessionId/+server.ts 🆔 SESSION ID:', sessionId);


  /* -----------------------------------------------------------------------
     4. Insert the text into the realtime_chunks table
     -----------------------------------------------------------------------
     - Every insert triggers Supabase Realtime
     - Clients subscribed to this session update instantly
     - "|EOL|" marks finalized lines
  ----------------------------------------------------------------------- */
  const { error } = await supabase
    .from('realtime_chunks')
    .insert({
      session_id: sessionId,
      text_chunk: text
    });

  /* -----------------------------------------------------------------------
     5. Handle database errors
  ----------------------------------------------------------------------- */
  if (error) {
    console.error('Supabase insert error:', error);
    return json(
      { success: false, message: 'Database insert failed' },
      { status: 500 }
    );
  }

  /* -----------------------------------------------------------------------
     6. Success
     -----------------------------------------------------------------------
     We don’t return the row — Realtime handles updates automatically.
  ----------------------------------------------------------------------- */
  return json({ success: true });
};
