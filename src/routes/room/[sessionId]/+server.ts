// src/routes/room/[sessionId]/+server.ts

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/* =========================================================================
 * POST Handler
 * -------------------------------------------------------------------------
 * Handles POST requests from the client (transcriber input) and inserts 
 * the text chunk into the 'realtime_chunks' table.
 * =========================================================================
 */
export const POST: RequestHandler = async ({ request, locals, params }) => {
    // 1. Authentication and Authorization Check
    // Destructure the Supabase client and the pre-verified 'user' object from locals.
    const { supabase, user } = locals; 

    // The 'user' object is defined by your app.d.ts. If it's null, the user is not authenticated.
    if (!user) {
        return json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Extract Data
    // The request body contains the 'text' chunk from the transcriber
    const { text } = await request.json();

    if (!text) {
        return json({ success: false, message: 'Missing text chunk' }, { status: 400 });
    }

    // Use the dynamic sessionId from the URL path
    const sessionId = params.sessionId;

    // 3. Database Insertion
    // Insert the text chunk into the 'realtime_chunks' table
    const { error } = await supabase.from('realtime_chunks').insert({
        session_id: sessionId,
        user_id: user.id, // Use the user ID from the locals object
        text_chunk: text,
    });

    // 4. Response Handling
    if (error) {
        console.error('Supabase insert error:', error);
        return json(
            { success: false, message: 'Database insert failed' },
            { status: 500 }
        );
    }

    return json({ success: true, message: 'Chunk inserted' });
};