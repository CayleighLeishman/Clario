import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

// this file handles redirection based on user roles upon accessing the login page 

export const load: PageServerLoad = async (event) => {
    // Check if a user is already logged in (If a "session" exists in the computers locals)
    const session = event.locals.session;

    // If the user is already logged in and has a role, redirect them to the correct dashboard
    if (session?.role) {
        switch (session.role) {
            case 'student':
                throw redirect(303, '/client/dashboard'); // Redirect students
            case 'transcriber':
                throw redirect(303, '/transcriber/dashboard'); // Redirect transcribers
            case 'admin':
                throw redirect(303, '/admin/dashboard'); // Redirect admins
        }
    }

    // If no session exists or role is undefined, just render the login page
    return {};
};
