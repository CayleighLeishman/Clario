import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
// handles server side data and cheks for everything inside the layout 

/* ==========================================================================
    * This is the website's Security Checkpoint    
    * This code runs on the web server before the page loads for the user.
    * Its main job is to check if the user is currently logged in.
   ========================================================================= */
export const load: LayoutServerLoad = async ({ cookies }) => {

    // 1. Setting up the Checkpoint:
    // this sets a secure connection to the database, we have this because it knows how to read 
    // and write the secret user "tickets" (cookies) that show us they logged in
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
    // This retrieves the user's "session" (the proof they logged in).
const {
    data: { session },
} = await supabase.auth.getSession();

    // 3. The redeinforcement: we check the user's "session" (login status) 
    //  if they are not the client they go right back to the login page

if (!session || session.user?.role !== 'client') {
    throw redirect(303, '/login');
}
    // 4. Reporting Back: we send the login status (the 'session') to the part of the code 
    //that lets the website know what page to show (weither the "dashboard" or back to "log in" pg)
    return { session };
};