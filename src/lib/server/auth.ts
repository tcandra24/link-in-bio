import { redirect } from '@sveltejs/kit';
import type { User } from '@supabase/supabase-js';

/** Ambil user yang sedang login, atau arahkan ke /login. */
export async function requireUser(locals: App.Locals): Promise<User> {
  const user = await locals.getUser();
  if (!user) redirect(303, '/login');
  return user;
}
