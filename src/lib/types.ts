export type TileSize = '1x1' | '2x1' | '2x2';

export type TileColor = 'tomato' | 'sun' | 'mint' | 'lilac' | 'sky' | 'cream' | 'ink';

export type ThemeName = 'paper' | 'clay' | 'candy';

export interface Tile {
	id: string;
	title: string;
	subtitle?: string;
	url: string;
	size: TileSize;
	color: TileColor;
	icon?: string; // nama Material Symbol, mis. 'headphones'
	badge?: string;
	imageUrl?: string;
	isActive: boolean;
}

export interface Profile {
	username: string;
	displayName: string;
	bio?: string;
	avatarUrl?: string;
	verified?: boolean;
	theme: ThemeName;
	cornerRadius: number; // 8 - 32 (px)
	shadowDepth: 2 | 4 | 6; // px
}
