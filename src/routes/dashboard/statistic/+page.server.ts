import { error } from '@sveltejs/kit';
import { buildStats, type DailyRow, type TotalsRow } from '#lib/stats.ts';
import { requireUser } from '#lib/server/auth.ts';
import { getOwnTiles } from '#lib/server/boards.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = await requireUser(locals);

  // Tiga permintaan yang saling bebas dijalankan bersamaan
  const [tiles, totals, daily] = await Promise.all([
    getOwnTiles(locals.supabase, user.id),
    locals.supabase.rpc('click_totals'),
    locals.supabase.rpc('click_daily', { p_days: 7 })
  ]);

  if (totals.error || daily.error) {
    console.error('statistic failed to load:', totals.error?.message ?? daily.error?.message);
    error(500, 'The statistics cannot be loaded at this time.');
  }

  return {
    stats: buildStats(tiles, (totals.data ?? []) as TotalsRow[], (daily.data ?? []) as DailyRow[])
  };
};
