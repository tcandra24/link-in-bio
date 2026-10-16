import { fail } from '@sveltejs/kit'; 

import { MAX_TILES } from '#lib/config.ts';
import { reorder } from '#lib/reorder.ts';
import { NO_ERRORS, fieldErrors, idSchema, text, tileSchema, type FieldErrors } from '#lib/schemas.ts';
import { requireUser } from '#lib/server/auth.ts';
import { getOwnTiles } from '#lib/server/boards.ts';
import type { TileValues } from '#lib/types.ts';
import type { Actions, PageServerLoad } from './$types';

type Intent = 'create' | 'update' | 'toggle' | 'delete' | 'move';

const EMPTY: TileValues = {
  title: '',
  subtitle: '',
  url: '',
  size: '1x1',
  color: 'sun',
  badge: '',
  icon: 'arrow_outward'
};

const SAVE_FAILED = 'Gagal menyimpan. Coba lagi beberapa saat.';

function readTile(form: FormData): TileValues {
  return {
    title: text(form, 'title'),
    subtitle: text(form, 'subtitle'),
    url: text(form, 'url'),
    size: text(form, 'size'),
    color: text(form, 'color'),
    badge: text(form, 'badge'),
    icon: text(form, 'icon')
  };
}

// Semua hasil action berbentuk sama supaya `form` di halaman mudah dipakai
function invalid(
  intent: Intent,
  id: string,
  values: TileValues,
  errors: FieldErrors,
  message = ''
) {
  return fail(400, { intent, id, values, errors, message });
}

function done(intent: Intent, id = '') {
  return { intent, id, ok: true as const };
}

export const load: PageServerLoad = async ({ locals }) => {
  const user = await requireUser(locals);
  return { tiles: await getOwnTiles(locals.supabase, user.id) };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const user = await requireUser(locals);
    const values = readTile(await request.formData());

    const parsed = tileSchema.safeParse(values);
    if (!parsed.success) return invalid('create', '', values, fieldErrors(parsed.error));
    const tile = parsed.data;

    const { data: rows, error: listError } = await locals.supabase
      .from('links')
      .select('position')
      .eq('profile_id', user.id);
    if (listError) return invalid('create', '', values, NO_ERRORS, SAVE_FAILED);

    const positions = (rows ?? []).map((row) => Number(row.position));
    if (positions.length >= MAX_TILES) {
      return invalid('create', '', values, NO_ERRORS, `Maksimal ${MAX_TILES} petak per papan.`);
    }

    const { error: insertError } = await locals.supabase.from('links').insert({
      profile_id: user.id,
      title: tile.title,
      subtitle: tile.subtitle || null,
      url: tile.url,
      size: tile.size,
      color: tile.color,
      badge: tile.badge || null,
      icon: tile.icon,
      position: Math.max(0, ...positions) + 1,
      is_active: true
    });
    if (insertError) {
      console.error('create petak gagal:', insertError.message);
      return invalid('create', '', values, NO_ERRORS, SAVE_FAILED);
    }

    return done('create');
  },

  update: async ({ request, locals }) => {
    const user = await requireUser(locals);
    const form = await request.formData();
    const values = readTile(form);

    const id = idSchema.safeParse(text(form, 'id'));
    if (!id.success) return invalid('update', '', values, NO_ERRORS, 'Petak tidak valid.');

    const parsed = tileSchema.safeParse(values);
    if (!parsed.success) return invalid('update', id.data, values, fieldErrors(parsed.error));
    const tile = parsed.data;

    // .eq('profile_id', ...) = hanya milik sendiri (RLS menjaga hal yang sama di database)
    const { data, error: updateError } = await locals.supabase
      .from('links')
      .update({
        title: tile.title,
        subtitle: tile.subtitle || null,
        url: tile.url,
        size: tile.size,
        color: tile.color,
        badge: tile.badge || null,
        icon: tile.icon
      })
      .eq('id', id.data)
      .eq('profile_id', user.id)
      .select('id');

    if (updateError) {
      console.error('update petak gagal:', updateError.message);
      return invalid('update', id.data, values, NO_ERRORS, SAVE_FAILED);
    }
    if (!data?.length) {
      return invalid('update', id.data, values, NO_ERRORS, 'Petak tidak ditemukan.');
    }

    return done('update', id.data);
  },

  toggle: async ({ request, locals }) => {
    const user = await requireUser(locals);
    const form = await request.formData();

    const id = idSchema.safeParse(text(form, 'id'));
    if (!id.success) return invalid('toggle', '', EMPTY, NO_ERRORS, 'Petak tidak valid.');

    const { error: updateError } = await locals.supabase
      .from('links')
      .update({ is_active: text(form, 'active') === 'true' })
      .eq('id', id.data)
      .eq('profile_id', user.id);
    if (updateError) {
      console.error('toggle petak gagal:', updateError.message);
      return invalid('toggle', id.data, EMPTY, NO_ERRORS, SAVE_FAILED);
    }

    return done('toggle', id.data);
  },

  delete: async ({ request, locals }) => {
    const user = await requireUser(locals);
    const id = idSchema.safeParse(text(await request.formData(), 'id'));
    if (!id.success) return invalid('delete', '', EMPTY, NO_ERRORS, 'Petak tidak valid.');

    const { error: deleteError } = await locals.supabase
      .from('links')
      .delete()
      .eq('id', id.data)
      .eq('profile_id', user.id);
    if (deleteError) {
      console.error('hapus petak gagal:', deleteError.message);
      return invalid('delete', id.data, EMPTY, NO_ERRORS, 'Gagal menghapus. Coba lagi.');
    }

    return done('delete', id.data);
  },

  move: async ({ request, locals }) => {
    const user = await requireUser(locals);
    const form = await request.formData();

    const id = idSchema.safeParse(text(form, 'id'));
    const direction = text(form, 'direction');
    if (!id.success || (direction !== 'up' && direction !== 'down')) {
      return invalid('move', '', EMPTY, NO_ERRORS, 'Permintaan tidak valid.');
    }

    const { data, error: listError } = await locals.supabase
      .from('links')
      .select('id, position')
      .eq('profile_id', user.id)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true });
    if (listError) return invalid('move', id.data, EMPTY, NO_ERRORS, SAVE_FAILED);

    const items = (data ?? []).map((row) => ({ id: String(row.id), position: Number(row.position) }));
    const changes = reorder(items, id.data, direction);

    const results = await Promise.all(
      changes.map((change) =>
        locals.supabase
          .from('links')
          .update({ position: change.position })
          .eq('id', change.id)
          .eq('profile_id', user.id)
      )
    );
    if (results.some((result) => result.error)) {
      return invalid('move', id.data, EMPTY, NO_ERRORS, SAVE_FAILED);
    }

    return done('move', id.data);
  }
};
