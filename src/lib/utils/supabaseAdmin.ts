// src/lib/utils/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

// to do: ensure this file is secure and never exposed to other users unless they are admins
// this file is used for admin tasks like deleting and adding users and assigning roles
// it uses the service role key which has elevated permissions

// Reads the Supabase project URL from environment variables to connect the client.
const supabaseUrl = process.env.SUPABASE_URL!;

// Reads the service role key from environment variables, giving elevated access to perform admin actions.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Creates and exports a Supabase client that can be used for admin operations like managing users and roles.
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
