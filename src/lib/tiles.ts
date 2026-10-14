import type { ThemeName, TileColor, TileSize } from './types';

// Semua class ditulis utuh supaya Tailwind bisa mendeteksinya.
export const tileColors: Record<TileColor, { card: string; badge: string }> = {
	tomato: { card: 'bg-tomato text-ink', badge: 'bg-ink text-paper' },
	sun: { card: 'bg-sun text-ink', badge: 'bg-ink text-paper' },
	mint: { card: 'bg-mint text-ink', badge: 'bg-ink text-paper' },
	lilac: { card: 'bg-lilac text-ink', badge: 'bg-ink text-paper' },
	sky: { card: 'bg-sky text-ink', badge: 'bg-ink text-paper' },
	cream: { card: 'bg-paper text-ink', badge: 'bg-ink text-paper' },
	ink: { card: 'bg-ink text-paper', badge: 'bg-paper text-ink' }
};

export const tileSizes: Record<TileSize, string> = {
	'1x1': 'col-span-1',
	'2x1': 'col-span-2',
	'2x2': 'col-span-2 row-span-2'
};

export const themes: Record<ThemeName, { page: string; dots: string }> = {
	paper: { page: 'theme-paper bg-paper text-ink', dots: 'bg-dot-grid' },
	clay: { page: 'theme-clay bg-ink text-paper', dots: 'bg-dot-grid-light' },
	candy: { page: 'theme-candy bg-candy text-ink', dots: 'bg-dot-grid' }
};

export function isThemeName(value: string | null): value is ThemeName {
	return value === 'paper' || value === 'clay' || value === 'candy';
}
