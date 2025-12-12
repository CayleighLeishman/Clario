// src/app.d.ts
import type { SupabaseClient } from '@supabase/supabase-js';

declare namespace App {
  interface Locals {
    supabase: SupabaseClient;

    user: {
      id: string;
      email: string;
      role: 'client' | 'transcriber' | 'admin';
    } | null;
  }

  // 👇 PageData is now flexible — no required fields
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
