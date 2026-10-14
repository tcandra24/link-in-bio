// Aturan username: sama dengan constraint di tabel profiles.
export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export function isValidUsername(value: string): boolean {
  return USERNAME_PATTERN.test(value);
}
