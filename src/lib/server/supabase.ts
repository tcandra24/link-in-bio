import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$app/env/public';

// Folder `server` tidak pernah dikirim ke browser.
// Client anon untuk membaca data publik (dibatasi RLS). Di Hari 3 diganti
// client berbasis cookie dari hooks.server.ts agar tahu siapa yang login.
export function createSupabase() {
  return createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
