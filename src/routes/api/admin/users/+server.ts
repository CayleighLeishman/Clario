// this deletes/POST./PATCH endpoints using supabaseAdmin 

import type { RequestHandler } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/utils/supabaseAdmin';

export const DELETE: RequestHandler = async ({ request }) => {
  const { id } = await request.json();

  if (!id) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
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

export const POST: RequestHandler = async ({ request }) => {
  const { name, email, role, password } = await request.json();

  if (!name || !email || !role || !password) {
    return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { name, role }
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, user: data.user }));
};

export const PATCH: RequestHandler = async ({ request }) => {
  const { id, role } = await request.json();

  if (!id || !role) {
    return new Response(JSON.stringify({ error: 'ID and role are required' }), { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update({ role })
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }));
};