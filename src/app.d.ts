/// <reference types="@sveltejs/kit" />

declare namespace App {
    // Info about the person currently using the website
    interface Locals {
        /**
         * `session` holds details about the logged-in user:
         * - `userId`: a unique ID for the person
         * - `role`: what kind of user they are ('student', 'transcriber', or 'admin')
         * - `email`: their email address
         * 
         * If the person is not logged in, this is null (empty).
         */
        session: {
            userId: string;
            role: 'student' | 'transcriber' | 'admin';
            email: string;
        } | null;
    }

    // Info that pages can see and use
    interface PageData {
        /**
         * The session info is available on any page.
         * Example: check if the user is a student:
         * $page.data.session?.role === 'student'
         */
        session: Locals['session'];

        /**
         * Optional: list of all users.
         * Each user has an id, email, and role.
         * You might not need this if your page doesn’t show all users.
         */
        users?: Array<{
            id: string;
            email: string;
            role: 'student' | 'transcriber' | 'admin';
        }>;
    }

    // Optional: info about errors (if something goes wrong)
    // REMINDER: You can add more fields here if you want to track more details about errors,
    // like a code, timestamp, or user-facing message.
    interface Error {
        message?: string; // a description of the error
        // Example future fields:
        // code?: string;
        // timestamp?: string;
        // userFriendlyMessage?: string;
    }

    // Optional: info about the platform/environment the website is running on
    // REMINDER: You can add more environment-related info here if needed,
    // such as API keys, deployment info, or flags for features.
    interface Platform {
        env?: string; // environment info (like 'dev', 'prod', or 'test')
        // Example future fields:
        // version?: string;
        // featureFlags?: Record<string, boolean>;
    }
}
