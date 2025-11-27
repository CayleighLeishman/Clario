import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

/* ==========================================================================
   SERVER-SIDE LAYOUT LOAD FUNCTION
   This runs on the server before rendering client pages. It ensures the
   user is authenticated, is a client, and has all required fields like email.
========================================================================== */
export const load: LayoutServerLoad = async ({ cookies }) => {
  // 1. Create a Supabase client that works on the server.
  //    It uses the user's cookies to authenticate the request.
  const supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Read a cookie value by key
        get: (key) => cookies.get(key),
        // Write/update a cookie value
        set: (key, value, options) => cookies.set(key, value, { ...options, path: '/' }),
        // Remove a cookie
        remove: (key, options) => cookies.set(key, '', { ...options, path: '/' }),
      },
    }
  );

  // 2. Get the user's session from Supabase using the server client
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 3. Check if session exists and user role is 'client'
  if (!session || session.user.user_metadata.role !== 'client') {
    // Redirect to login if not authenticated or wrong role
    throw redirect(303, '/login');
  }

  // 4. Ensure email exists. TypeScript requires a definite string for 'email'.
  if (!session.user.email) {
    // Redirect if email is missing — prevents type errors
    throw redirect(303, '/login');
  }

  // 5. Return only the data needed for client layout
  //    This creates a simpler session object with the fields your Svelte components expect
  return {
    session: {
      userId: session.user.id, // Supabase user ID
      role: session.user.user_metadata.role, // Client, admin, or transcriber
      email: session.user.email, // Guaranteed email
    },
  };
};
