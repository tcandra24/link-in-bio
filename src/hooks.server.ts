import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';
import type { User } from '@supabase/supabase-js';
// import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$app/env/public';

export const handle: Handle = async ({ event, resolve }) => {
  // Client Supabase per request; session dibaca/ditulis lewat cookie
  
  event.locals.supabase = createServerClient('https://ircptxdwsuonwjnizasr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyY3B0eGR3c3Vvbndqbml6YXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NDAzMzEsImV4cCI6MjEwNzUxNjMzMX0.AAYtl4iqbRGh9wulmwzUJY7J5tcR2Aetj825uRIsXYo', {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        for (const { name, value, options } of cookiesToSet) {
          event.cookies.set(name, value, { ...options, path: '/' });
        }
      }
    }
  });

  // getUser() memverifikasi token ke server Supabase, jadi aman dipercaya.
  // (getSession() hanya membaca cookie, jangan dipakai untuk keputusan keamanan.)
  // Di-cache supaya dalam satu request cuma dipanggil sekali.
  let userPromise: Promise<User | null> | undefined;
  event.locals.getUser = () =>
    (userPromise ??= event.locals.supabase.auth
      .getUser()
      .then(({ data, error }) => (error ? null : data.user)));

  // Penjaga route: berlaku untuk load, form action, dan endpoint sekaligus
  const path = event.url.pathname;
  const isProtected = path === '/dashboard' || path.startsWith('/dashboard/');
  const isAuthPage = path === '/login' || path === '/register';

  if (isProtected || isAuthPage) {
    const user = await event.locals.getUser();
    if (isProtected && !user) redirect(303, '/login');
    if (isAuthPage && user) redirect(303, '/dashboard');
  }

  return resolve(event);
};
