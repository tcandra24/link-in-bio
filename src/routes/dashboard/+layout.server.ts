import { error, redirect } from '@sveltejs/kit';
import { PROFILE_COLUMNS, toProfile, type ProfileRow } from '#lib/server/boards.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const user = await locals.getUser();
  if (!user) redirect(303, '/login');

  const { data, error: queryError } = await locals.supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', user.id)
    .single();

  if (queryError || !data) {
    console.error('profile dashboard failed to load:', queryError?.message);
    error(500, 'Profile not found');
  }

  return {
    email: user.email ?? '',
    profile: toProfile(data as unknown as Omit<ProfileRow, 'links'>)
  };
};
