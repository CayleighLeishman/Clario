import { supabase } from '$lib/supabaseClient';
import { invalidateAll } from '$app/navigation';
import type { HandleClientError } from '@sveltejs/kit';
//this file is used to ensure that the supabase client is only created on the client side
//use hooks.client.ts to:
// Set up global event listeners,
// Listen for auth changes,
// Initialize stores or analytics,
// Do per-navigation tasks that need to run on the client.



// handle client-side errors here
export const handleError: HandleClientError = async ({ error }) => {
    console.error('Client Error:', error);
    return {
        message: 'An unexpected client error occurred.',
    };
};

// global listener for any auth changes and invalidate the session
supabase.auth.onAuthStateChange(() => {
  invalidateAll();
});

// Gemini comment:
// You could add any code here that needs to run once on the client when the app starts, e.g., 
// setting up a global store or sending analytics events.
// but this is exactly where you’d put additional global client-side initialization.