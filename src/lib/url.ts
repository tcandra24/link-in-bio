/**
 * Rapikan URL dari input pengguna dan pastikan hanya http(s).
 * "contoh.com/x" -> "https://contoh.com/x"; "javascript:..." -> null.
 */
export function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw || raw.length > 2048 || /\s/.test(raw) || raw.startsWith('//')) return null;

  const isHttp = /^https?:\/\//i.test(raw);
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw);
  const looksLikeHostPort = /^[^/\s:]+:\d+(\/|$)/.test(raw); // mis. localhost:3000

  // Skema lain (javascript:, mailto:, ftp://, data:, ...) ditolak
  if (hasScheme && !isHttp && !looksLikeHostPort) return null;

  const candidate = isHttp ? raw : `https://${raw}`;

  try {
    const { protocol } = new URL(candidate);
    return protocol === 'http:' || protocol === 'https:' ? candidate : null;
  } catch {
    return null;
  }
}
