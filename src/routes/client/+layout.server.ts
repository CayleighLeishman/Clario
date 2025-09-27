import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import type { LayoutServerLoad } from './$types';

/**
 * This is the website's Security Checkpoint.
 * This code runs on the web server before the page loads for the user.
 * Its main job is to check if the user is currently logged in.
 */
export const load: LayoutServerLoad = async ({ cookies }) => {

    // 1. Setting up the Checkpoint: We create a secure connection to the database.
    // This connection is special because it knows how to read and write the
    // secret user "tickets" (cookies) that prove they are logged in.
    const supabase = createServerClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {

                // Read the ticket from the user's browser.
                get: (key) => cookies.get(key),

                // Write new/updated tickets back to the user's browser.
                set: (key, value, options) => {
                    cookies.set(key, value, { ...options, path: '/' });
                },
                // Delete old tickets when the user logs out.
                remove: (key, options) => {
                    cookies.set(key, '', { ...options, path: '/' });
                },
            },
        }
    );

    // 2. Getting the Status: We ask the database, "Who is this user?"
    // This retrieves the user's "session" (the proof of being logged in).
    const {
        data: { session },
        error
    } = await supabase.auth.getSession();

    if (error) {
        // If there's an error reading the status, we log it for the developers.
        console.error('Layout Server Load Session error:', error);
    }

    // 3. Reporting Back: We send the login status (the 'session') to the
    // part of the code that draws the page, so it knows whether to show
    // the "Welcome Dashboard" or the "Please Log In" screen.
    return { session };
};