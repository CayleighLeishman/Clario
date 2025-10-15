import {supabaseUser } from '$lib/supabaseUser';
import { invalidateAll } from '$app/navigation';
import type { HandleClientError } from '@sveltejs/kit';

// This file is used to ensure that the Supabase client is only created on the client side
// Use hooks.client.ts to:
// - Set up global event listeners,
// - Listen for auth changes,
// - Initialize stores or analytics,
// - Do per-navigation tasks that need to run on the client.

// Global listener for any auth changes and invalidate the session
supabaseUser.auth.onAuthStateChange(() => {
  invalidateAll();
});

// Handle client-side errors here
export const handleError: HandleClientError = async ({ error }) => {
  console.error('Client Error:', error);
  return {
    message: 'An unexpected client error occurred.',
  };
};

// Gemini comment:
// You could add any code here that needs to run once on the client when the app starts, e.g., 
// setting up a global store or sending analytics events.
