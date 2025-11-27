// --------------------------
// API ENDPOINT FOR ADMIN ACTIONS
// --------------------------
// This file handles adding, deleting, and updating users
// Only admins should be able to call these!

import type { RequestHandler } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/utils/supabaseServer';

// DELETES A USER
export const DELETE: RequestHandler = async ({ request }) => {
  const { id } = await request.json(); // get the ID from request body

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing user ID' }), { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }));
};

// You can add more handlers for POST (add user) and PUT (Update user) as needed


