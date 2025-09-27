import { createClient } from "@supabase/supabase-js";  //double check this is the import path /supabase-js I think its smething else
const supabaseUrl = import.meta.env.PUBLIC_SUBABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

//this file is used to create a supabase client that can be used throughout the application
