// src/app.d.ts

import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			// This is the  custom type for the Supabase client
			supabase: SupabaseClient;

			// This is the custom type for the authenticated user object
			user: {
				id: string;
				email: string;
				role: 'client' | 'transcriber' | 'admin';
			} | null;
		}

		// 👇 PageData is now flexible
		interface PageData {
			user?: {
				id: string;
				email: string;
				role: 'client' | 'transcriber' | 'admin';
			} | null;

			// OPTIONAL: allow any other page data like sessionId
			[key: string]: unknown;
		}
	}
}

export {};