import { createClient } from '@supabase/supabase-js';
// to do: ensure this file is secure and never exposed to other users unless they are admins
// this file is used for admin tasks like deleting and adding users and assinging roles
//it uses the service role key which has elevated permissiuons

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
