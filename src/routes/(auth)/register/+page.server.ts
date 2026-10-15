import { fail, redirect } from '@sveltejs/kit';
import { NO_ERRORS, errorOn, fieldErrors, registerSchema, text } from '#lib/schemas.ts';
import type { Actions, PageServerLoad } from './$types';

// Isi awal username dari form klaim di landing (?username=...)
export const load: PageServerLoad = ({ url }) => {
  const username = (url.searchParams.get('username') ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 20);
  return { username };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const raw = {
      username: text(form, 'username'),
      email: text(form, 'email'),
      password: text(form, 'password')
    };
    const values = { username: raw.username, email: raw.email };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, { values, errors: fieldErrors(parsed.error), message: '' });
    }
    const { username, email, password } = parsed.data;

    // Cek username (profil bersifat publik, jadi bisa dibaca client anon)
    const { data: taken } = await locals.supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    if (taken) {
      return fail(400, { values, errors: errorOn('username', 'Username already taken'), message: '' });
    }

    // Username dikirim lewat metadata; trigger di database yang membuat baris profiles
    const { data, error } = await locals.supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });

    if (error) {
      const message =
        error.code === 'user_already_exists'
          ? 'This email is already registered. Please log in.'
          : error.code === 'weak_password'
            ? 'Password is too weak.'
            : 'Registration failed. Please try again later.';
      return fail(400, { values, errors: NO_ERRORS, message });
    }

    // Tanpa session = "Confirm email" masih aktif di Supabase
    if (!data.session) {
      return fail(400, {
        values,
        errors: NO_ERRORS,
        message: 'Account created, but email confirmation is required. Disable "Confirm email" in Supabase for development.'
      });
    }

    redirect(303, '/dashboard');
  }
};
