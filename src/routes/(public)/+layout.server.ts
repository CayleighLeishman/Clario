// src/routes/(public)/+layout.server.ts

import { createSupabaseServer } from '$lib/supabaseServer';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  // ✅ Log that the layout server load function is running
  console.log('✅ +layout.server.ts running...');

  try {
    // 🔗 Create a Supabase client that is aware of cookies
    const supabase = createSupabaseServer(cookies);

    // 🧩 Attempt to fetch the current user's session from Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) console.error('Supabase error:', error);

    console.log('🧩 Session data:', session);

    // 📄 Define routes that are public (accessible without login)
    const publicPages = ['/', '/about', '/contact']; // Add more public pages here

    // 🚦 If the user is not logged in and tries to access a restricted page
    if (!session && !publicPages.includes(url.pathname)) {
      console.log(`Not logged in and tried to access ${url.pathname} — redirecting to /login`);
      throw redirect(303, '/login'); // Force redirect to login
    }

    // 🔑 If the user is already logged in and visits the login page
    // Redirect them automatically to their dashboard based on role
    if (session && url.pathname === '/login') {
      const role = session.user?.role;
      if (role === 'client') throw redirect(303, '/client/dashboard');
      if (role === 'transcriber') throw redirect(303, '/transcriber/dashboard');
    }

    // 📨 Return the session data to the frontend (available in +page.svelte or components)
    return { session };

  } catch (err) {
    // 🚨 Log any errors that happen during the load function
    console.error(' SERVER LOAD ERROR:', err);
    throw err; // Rethrow to surface the error
  }
};
