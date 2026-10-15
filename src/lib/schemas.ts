import { TILE_COLORS, TILE_ICONS, TILE_SIZES } from './tiles';
import { z } from 'zod';
import { USERNAME_PATTERN } from './username';
import { normalizeUrl } from './url';

// Nama yang bentrok dengan route aplikasi
export const RESERVED_USERNAMES = new Set([
  'login',
  'register',
  'logout',
  'dashboard',
  'settings',
  'go',
  'api',
  'admin',
  'about',
  'help'
]);

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(USERNAME_PATTERN, 'Use 3-20 characters: lowercase letters, numbers, or underscores')
  .refine((value) => !RESERVED_USERNAMES.has(value), 'This username is not available');

const emailSchema = z.string().trim().toLowerCase().email('Email format not valid');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(72, 'Password must be at most 72 characters long')
});

const urlSchema = z.string().transform((value, ctx) => {
  const url = normalizeUrl(value);
  if (!url) {
    ctx.addIssue({ code: 'custom', message: 'Insert a valid URL (http or https)' });
    return z.NEVER;
  }
  return url;
});

export const tileSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(60, 'Maximum 60 characters'),
  subtitle: z.string().trim().max(100, 'Maximum 100 characters'),
  url: urlSchema,
  size: z.enum(TILE_SIZES, { message: 'Invalid size' }),
  color: z.enum(TILE_COLORS, { message: 'Invalid color' }),
  badge: z.string().trim().max(20, 'Maximum 20 characters'),
  icon: z.enum(TILE_ICONS, { message: 'Invalid icon' })
});

export const idSchema = z.string().uuid('ID not valid');

export type FieldErrors = Partial<Record<string, string[]>>;

export const NO_ERRORS: FieldErrors = {};

export function errorOn(field: string, message: string): FieldErrors {
  return { [field]: [message] };
}

export function fieldErrors(error: z.ZodError): FieldErrors {
  return error.flatten().fieldErrors as FieldErrors;
}

export function text(form: FormData, name: string): string {
  return String(form.get(name) ?? '');
}
