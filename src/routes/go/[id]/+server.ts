import { error, redirect } from '@sveltejs/kit';
import { idSchema } from '#lib/schemas.ts';
import { normalizeUrl } from '#lib/url.ts';
import type { RequestHandler } from './$types';

// /go/<id>: catat klik, lalu alihkan ke URL tujuan.
export const GET: RequestHandler = async ({ params, locals }) => {
  const id = idSchema.safeParse(params.id);
  if (!id.success) error(404, 'Link not found');

  // Satu panggilan: fungsi SQL mencatat klik dan mengembalikan URL (hanya untuk link aktif)
  const { data, error: rpcError } = await locals.supabase.rpc('record_click', {
    p_link_id: id.data
  });

  if (rpcError) {
    console.error('record_click failed:', rpcError.message);
    error(500, 'The link cannot be opened at this time.');
  }

  // Lapis pertahanan: hanya http(s), apa pun isi database
  const target = typeof data === 'string' ? normalizeUrl(data) : null;
  if (!target) error(404, 'The link cannot be found.');

  redirect(302, target);
};
