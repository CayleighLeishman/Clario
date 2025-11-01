// +page.server.ts

// Import type for load function
import type { PageServerLoad } from './$types';

// Import our helper to create a Supabase server client
import { createSupabaseServer } from '$lib/supabaseServer';

// This function runs on the server when the page loads
export const load: PageServerLoad = async (event) => {
    // event.locals has info about the logged-in user (session)
    // event.cookies lets us read cookies if we need them
    const { locals, cookies } = event;

    // Create a Supabase client with the user's cookies
    const supabase = createSupabaseServer(cookies);

    // Get all users from the database
    const { data: users, error } = await supabase
        .from('users')
        .select('id, name, email, role, created_at, status');

    // If something went wrong, log it and return empty users
    if (error) {
        console.error('Error fetching users:', error);
        return {
            users: [],
            session: locals.session ?? null // session info from locals
        };
    }

    // Return the list of users and the current session
    return {
        users: users ?? [],
        session: locals.session ?? null
    };
};
