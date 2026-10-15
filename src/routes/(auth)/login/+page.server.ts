import { fail, redirect } from '@sveltejs/kit';
import { NO_ERRORS, fieldErrors, loginSchema, text } from '#lib/schemas.ts';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const raw = { email: text(form, 'email'), password: text(form, 'password') };
    const values = { email: raw.email }; // password tidak pernah dikirim balik

    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, { values, errors: fieldErrors(parsed.error), message: '' });
    }

    const { error } = await locals.supabase.auth.signInWithPassword(parsed.data);
    if (error) {
      // Pesan sengaja umum: jangan bocorkan apakah email terdaftar atau tidak
      return fail(400, { values, errors: NO_ERRORS, message: 'Email or password is incorrect.' });
    }

    redirect(303, '/dashboard');
  },
};
