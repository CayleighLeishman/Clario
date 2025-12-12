// src/routes/transcriber/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import { createSupabaseServer } from '$lib/utils/supabaseServer';

export const load = async ({ cookies }) => {
  const supabase = createSupabaseServer(cookies);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) throw redirect(303, '/login');

  if (session.user.user_metadata.role !== 'transcriber') {
    throw redirect(303, '/login');
  }

  return {
    session: {
      userId: session.user.id,
      role: session.user.user_metadata.role,
      email: session.user.email
    }
  };
};
