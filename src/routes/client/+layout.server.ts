// src/routes/client/+layout.server.ts
import { createSupabaseServer } from '$lib/utils/supabaseServer';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const supabase = createSupabaseServer(cookies);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) throw redirect(303, '/login');

  const role = session.user.user_metadata?.role;
  if (role !== 'client') throw redirect(303, '/login');

  return {
    session: {
      userId: session.user.id,
      email: session.user.email!,
      role
    }
  };
};
