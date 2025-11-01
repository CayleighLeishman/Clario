import type { PageServerLoad } from './$types';
import { createSupabaseServer } from '$lib/SupabaseServer';
// to do : ensue only admins can accessthis page 


export const load: PageServerLoad = async ({ cookies }) => {
  const supabase = createSupabaseServer(cookies);

  // Fetch all users
  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, email, role, created_at, status');

  if (error) {
    console.error('Error fetching users:', error.message);
    return { users: [] };
  }

  return {
    session: locals.session ?? null, // pass session to the page
    users: await getUsersFromDatabase() // your existing users
  };
};
