import { error, redirect } from '@sveltejs/kit';
import { getPublicBoard } from '#lib/server/boards.ts';
import { isValidUsername } from '#lib/username.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const username = params.username.toLowerCase();

  // /Demo -> /demo (satu alamat kanonik per papan)
  if (username !== params.username) {
    redirect(308, `/${username}`);
  }

  // Bentuk yang mustahil jadi username tidak perlu sampai ke database
  if (!isValidUsername(username)) {
    error(404, 'Halaman tidak ditemukan');
  }

  const board = await getPublicBoard(username);

  if (!board) {
    error(404, `Petak @${username} belum diklaim`);
  }

  return board; // { profile, tiles }
};
