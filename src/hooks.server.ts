// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseServer'; // your server Supabase client

export const handle: Handle = async ({ event, resolve }) => {
  // Start with no session
  event.locals.session = null;

  try {
    const sessionCookie = event.cookies.get('session_id');

    if (sessionCookie) {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, email, role')
        .eq('id', sessionCookie)
        .single();

      if (!error && user) {
        event.locals.session = {
          userId: user.id,
          role: user.role,
          email: user.email
        };
      }
    }
  } catch (err) {
    console.error('Error loading session:', err);
  }

  return resolve(event);
};
