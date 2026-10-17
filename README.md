# Plot

Biolink bergaya kolase "bento": satu halaman publik berisi petak-petak tautan berwarna,
dikelola lewat dashboard pribadi. Proyek belajar SvelteKit (SSR) selama 7 hari.

## Fitur

- Halaman publik `/<username>` dirender di server, dengan meta SEO/Open Graph dinamis
- Daftar dan masuk (Supabase Auth), sesi lewat cookie
- Dashboard: tambah, ubah, hapus, sembunyikan, dan urutkan petak (ukuran 1x1, 2x1, 2x2, 7 warna)
- Tampilan: tema (Kertas, Malam, Permen), sudut, bayangan, foto profil, pratinjau langsung
- Statistik klik lewat `/go/<id>` (total, 7 hari terakhir, peringkat petak)

## Teknologi

SvelteKit 2 (Svelte 5) • TypeScript • Tailwind CSS 4 • Supabase (Postgres, Auth, Storage) •
Zod • adapter-vercel

## Struktur

```
src/
├─ hooks.server.ts        # client Supabase per request, penjaga /dashboard
├─ lib/
│  ├─ components/         # BentoTile, BoardPreview, Field, TileForm, ...
│  ├─ server/             # boards.ts (akses data), auth.ts
│  ├─ schemas.ts          # validasi Zod
│  └─ stats.ts, url.ts, reorder.ts
└─ routes/
   ├─ +page.svelte        # landing (prerender)
   ├─ (auth)/             # /login, /register
   ├─ [username]/         # papan publik
   ├─ go/[id]/            # catat klik lalu redirect
   ├─ dashboard/          # petak, tampilan, statistik
   └─ logout/
supabase/schema.sql       # skema lengkap
```

## Menjalankan lokal

1. Buat proyek di [supabase.com](https://supabase.com) (disarankan region Singapura).
2. Jalankan `supabase/schema.sql` di SQL Editor.
3. Matikan "Confirm email" (Authentication, pengaturan provider Email).
4. Salin `.env.example` menjadi `.env`, isi URL dan kunci anon proyekmu.
5. ```bash
   npm install
   npm run dev
   ```

```

Skrip: `npm run dev` • `npm run check` (tipe) • `npm run build` • `npm run preview`

## Variabel lingkungan
| Nama | Isi |
|---|---|
| `PUBLIC_SUPABASE_URL` | URL proyek Supabase |
| `PUBLIC_SUPABASE_ANON_KEY` | Kunci anon/publishable (aman publik karena dijaga RLS) |

Nilai dibaca saat build (`$env/static/public`): ubah nilai berarti build ulang.

## Deploy
Vercel dengan `@sveltejs/adapter-vercel`. Isi dua variabel di atas di Project Settings,
lalu deploy. Ganti `SITE.domain` di `src/lib/config.ts` dengan alamat produksi.

## Keputusan dan keamanan
- **Berlapis**: validasi Zod di server, filter pemilik di query, RLS, lalu CHECK constraint
  di database (karena kunci anon publik, aplikasi bisa dilewati).
- URL tujuan hanya http(s); dicek saat menyimpan, saat merender, dan saat redirect.
- Klik dicatat lewat fungsi `security definer` (`record_click`); pengunjung anonim tidak
  punya hak tulis langsung ke tabel klik.
- Profil dibuat oleh trigger saat daftar, bukan oleh klien.
- Halaman publik di-cache CDN 60 detik; landing di-prerender.

## Keterbatasan
- Klik berulang dan bot ikut terhitung; belum ada rate limiting.
- "Confirm email" dimatikan; produksi sebenarnya butuh route `/auth/confirm`.
- Urutan petak lewat tombol panah (tanpa drag and drop), disimpan dengan beberapa update
  yang tidak atomik.
- Belum ada tes otomatis; fungsi murni (`normalizeUrl`, `reorder`, `buildStats`) mudah diuji.

## Yang dipelajari
1. Routing, layout, komponen, dan runes Svelte 5
2. `load` di server, error page, query Supabase
3. Auth: hooks, `locals`, form action, route group
4. CRUD dengan banyak action bernama, `use:enhance`
5. Unggah berkas, Storage + RLS, SEO/OG di SSR
6. Fungsi SQL (`security definer`/`invoker`), endpoint `+server.ts`, opsi render
7. Adapter, deploy, dan audit keamanan
```

## Catatan jujur

- Peringatan `env_module_deprecated` dari `$env/static/public` tidak menghalangi build maupun deploy. Migrasi ke `$app/env/*` bisa dikerjakan terpisah setelah proyek ini.
- Penjaga akses hanya melindungi `/dashboard`. Halaman publik dan `/go` memang terbuka, dan `/go` belum dibatasi lajunya.
- Pratinjau tautan (OG) memakai kartu `summary` dengan foto profil. Gambar OG khusus 1200×630 belum ada.

## Rangkuman 7 hari dan langkah lanjut

Kamu sudah membangun aplikasi SSR lengkap: auth, CRUD, upload, statistik, SEO, dan deploy. Saran lanjutan, berurutan dari yang paling berdampak:

1. Konfirmasi email (`/auth/confirm`) agar pendaftaran produksi tidak bisa dipalsukan.
2. Rate limiting untuk `/go` dan pendaftaran.
3. Tes otomatis untuk fungsi murni dan action utama (Vitest).
4. Gambar OG dinamis per profil.
5. Migrasi env ke `$app/env/*` dan drag-and-drop untuk urutan petak.

Kalau ada error saat deploy, kirim pesannya ke sini, baik error build di Vercel maupun log runtime.
