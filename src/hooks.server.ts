// src/hooks.server.ts
import { createSupabaseServer } from '$lib/utils/supabaseServer';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Create a Supabase server client for this request
  // This includes cookies so auth works correctly
  event.locals.supabase = createSupabaseServer(event.cookies);

  // Ask Supabase who the currently authenticated user is
  // (this is the SAFE version, not from cookies)
  const {
    data: { user }
  } = await event.locals.supabase.auth.getUser();

  // If a user exists, map them into the shape OUR app expects
  // Supabase users don't include "role" directly, so we read it from metadata
  event.locals.user = user
    ? {
        id: user.id,
        email: user.email ?? '', // Supabase allows email to be undefined
        role: (user.user_metadata?.role ??
          'client') as 'client' | 'transcriber' | 'admin'
      }
    : null;

  // Continue handling the request
  return resolve(event);
};
