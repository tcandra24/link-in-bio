import { error } from '@sveltejs/kit';
import type { Profile, ThemeName, Tile, TileColor, TileSize } from '#lib/types.ts';
import type { SupabaseClient } from '@supabase/supabase-js';
import { normalizeUrl } from '#lib/url.ts';

// Bentuk baris dari database (snake_case)
export interface LinkRow {
  id: string;
  title: string;
  subtitle: string | null;
  url: string;
  size: TileSize;
  color: TileColor;
  badge: string | null;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
}

export interface ProfileRow {
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme: ThemeName;
  corner_radius: number;
  shadow_depth: 2 | 4 | 6;
  links: LinkRow[];
}

export const PROFILE_COLUMNS =
  'username, display_name, bio, avatar_url, theme, corner_radius, shadow_depth';
export const LINK_COLUMNS =
  'id, title, subtitle, url, size, color, badge, icon, image_url, is_active';

export function toTile(row: LinkRow): Tile {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    url: normalizeUrl(row.url) ?? '#',
    size: row.size,
    color: row.color,
    badge: row.badge ?? undefined,
    icon: row.icon ?? undefined,
    imageUrl: row.image_url ?? undefined,
    isActive: row.is_active
  };
}

export function toProfile(row: Omit<ProfileRow, 'links'>): Profile {
  return {
    username: row.username,
    displayName: row.display_name ?? row.username,
    bio: row.bio ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    theme: row.theme,
    cornerRadius: row.corner_radius,
    shadowDepth: row.shadow_depth
  };
}

/** Ambil profil + link aktif dalam satu query. `null` kalau username belum diklaim. */
export async function getPublicBoard(supabase: SupabaseClient, username: string) {

  const { data, error: queryError } = await supabase
    .from('profiles')
    .select(
      `username, display_name, bio, avatar_url, theme, corner_radius, shadow_depth,
       links ( id, title, subtitle, url, size, color, badge, icon, image_url, is_active )`
    )
    .eq('username', username)
    .eq('links.is_active', true)
    .order('position', { referencedTable: 'links', ascending: true })
    .maybeSingle<ProfileRow>();

  if (queryError) {
    console.error('getPublicBoard gagal:', queryError.message);
    error(500, 'Board cannot be loaded at this time.');
  }

  if (!data) return null;

  return {
    profile: toProfile(data),
    tiles: data.links.map(toTile)
  };
}
