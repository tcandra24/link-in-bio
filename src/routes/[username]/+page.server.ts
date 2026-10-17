import { error, redirect } from '@sveltejs/kit';
import { getPublicBoard } from '#lib/server/boards.ts';
import { isValidUsername } from '#lib/username.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, setHeaders }) => {
  const username = params.username.toLowerCase();

  // /Demo -> /demo (satu alamat kanonik per papan)
  if (username !== params.username) {
    redirect(308, `/${username}`);
  }

  // Bentuk yang mustahil jadi username tidak perlu sampai ke database
  if (!isValidUsername(username)) {
    error(404, 'Page Not Found');
  }

  const board = await getPublicBoard(locals.supabase, username);

  if (!board) {
    error(404, `Board @${username} not found`);
  }

  setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' });

  return board; // { profile, tiles }
};
