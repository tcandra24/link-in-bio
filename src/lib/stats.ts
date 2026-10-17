import type { Tile } from './types';

// Bentuk baris dari fungsi SQL click_totals() dan click_daily()
export interface TotalsRow {
  link_id: string;
  total: number;
  last_7d: number;
}

export interface DailyRow {
  day: string; // 'YYYY-MM-DD'
  clicks: number;
}

export interface TileStat {
  tile: Tile;
  total: number;
  last7: number;
  share: number; // persen dari seluruh klik (0-100)
}

// Tanggal murni (tanpa jam), jadi diformat di UTC agar tidak bergeser zona waktu
const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'short', timeZone: 'UTC' });

export function buildStats(tiles: Tile[], totals: TotalsRow[], daily: DailyRow[]) {
  const byLink = new Map(totals.map((row) => [row.link_id, row]));
  const totalAll = totals.reduce((sum, row) => sum + Number(row.total), 0);

  const rows: TileStat[] = tiles
    .map((tile) => {
      const row = byLink.get(tile.id);
      const total = Number(row?.total ?? 0);
      return {
        tile,
        total,
        last7: Number(row?.last_7d ?? 0),
        share: totalAll > 0 ? Math.round((total / totalAll) * 100) : 0
      };
    })
    .sort((a, b) => b.total - a.total || a.tile.title.localeCompare(b.tile.title));

  const days = daily.map((row) => ({
    day: row.day,
    label: dayName.format(new Date(`${row.day}T00:00:00Z`)),
    clicks: Number(row.clicks)
  }));

  return {
    totalAll,
    last7: days.reduce((sum, d) => sum + d.clicks, 0),
    days,
    peak: Math.max(1, ...days.map((d) => d.clicks)),
    rows,
    top: rows[0] && rows[0].total > 0 ? rows[0] : null
  };
}
