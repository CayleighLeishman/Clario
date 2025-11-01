/// <reference types="@sveltejs/kit" />

/**
 * This file is here so TypeScript (our code helper) knows about our secret website info.
 * 
 * - We put our website keys in a .env file so they stay private.
 * - SvelteKit lets us use them in the browser if they start with PUBLIC_.
 * - Without this file, TypeScript gets confused and says it can't find them.
 * - This file just tells TypeScript: "Hey, these keys exist and are strings."
 */
declare module '$env/static/public' {
  export const PUBLIC_SUPABASE_URL: string;
  export const PUBLIC_SUPABASE_ANON_KEY: string;
}
