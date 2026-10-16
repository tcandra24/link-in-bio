import { fail } from '@sveltejs/kit';
import { appearanceSchema, avatarProblem, fieldErrors, text, type FieldErrors } from '#lib/schemas.ts';
import { requireUser } from '#lib/server/auth.ts';
import { getOwnTiles } from '#lib/server/boards.ts';
import type { Actions, PageServerLoad } from './$types';

const BUCKET = 'avatars';
const SAVE_FAILED = 'Failed to save. Please try again later.';

function invalid(errors: FieldErrors, message = '') {
  return fail(400, { errors, message });
}

export const load: PageServerLoad = async ({ locals }) => {
  const user = await requireUser(locals);
  // Profil sudah dimuat oleh +layout.server.ts; di sini cukup petak untuk pratinjau
  return { tiles: await getOwnTiles(locals.supabase, user.id) };
};

export const actions: Actions = {
  save: async ({ request, locals }) => {
    const user = await requireUser(locals);
    const form = await request.formData();

    const parsed = appearanceSchema.safeParse({
      displayName: text(form, 'displayName'),
      bio: text(form, 'bio'),
      theme: text(form, 'theme'),
      cornerRadius: text(form, 'cornerRadius'),
      shadowDepth: text(form, 'shadowDepth')
    });
    if (!parsed.success) return invalid(fieldErrors(parsed.error));
    const values = parsed.data;

    // Foto bersifat opsional; kalau ada, server yang menentukan lolos atau tidak
    let avatarUrl: string | undefined;
    const file = form.get('avatar');
    if (file instanceof File && file.size > 0) {
      const problem = avatarProblem(file);
      if (problem) return invalid({ avatar: [problem] });

      // Satu berkas tetap per pengguna: ditimpa setiap unggah
      const path = `${user.id}/avatar`;
      const { error: uploadError } = await locals.supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type, cacheControl: '3600' });
      if (uploadError) {
        console.error('upload avatar failed:', uploadError.message);
        return invalid({}, 'Photo upload failed. Please try again.');
      }

      const { data } = locals.supabase.storage.from(BUCKET).getPublicUrl(path);
      avatarUrl = `${data.publicUrl}?v=${Date.now()}`; // ?v= agar cache browser/CDN ikut baru
    }

    const { error: updateError } = await locals.supabase
      .from('profiles')
      .update({
        display_name: values.displayName,
        bio: values.bio || null,
        theme: values.theme,
        corner_radius: values.cornerRadius,
        shadow_depth: values.shadowDepth,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {})
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('update appearance failed:', updateError.message);
      return invalid({}, SAVE_FAILED);
    }

    return { ok: true as const, intent: 'save' as const };
  },

  removeAvatar: async ({ locals }) => {
    const user = await requireUser(locals);

    // Abaikan error "berkas tidak ada"; yang penting kolom avatar_url dikosongkan
    await locals.supabase.storage.from(BUCKET).remove([`${user.id}/avatar`]);

    const { error: updateError } = await locals.supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', user.id);

    if (updateError) {
      console.error('remove avatar failed:', updateError.message);
      return invalid({}, 'Failed to remove photo. Please try again.');
    }

    return { ok: true as const, intent: 'removeAvatar' as const };
  }
};
