<script lang="ts">
	import type { Tile } from '#lib/types.ts';
	import { tileColors, tileSizes } from '#lib/tiles.ts';
	import Icon from './Icon.svelte';

	interface Props {
		tile: Tile;
		radius?: number;
		depth?: number;
		compact?: boolean; // versi kecil untuk mockup ponsel di landing
		external?: boolean; // buka di tab baru
	}

	let { tile, radius = 24, depth = 4, compact = false, external = true }: Props = $props();

	let color = $derived(tileColors[tile.color]);
</script>

<a
	href={tile.url}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	class="group {tileSizes[
		tile.size
	]} {color.card} relative flex flex-col justify-between overflow-hidden border-2 border-(--edge) transition-all duration-200 hover:-translate-y-1 active:translate-x-0.5 active:translate-y-0.5 {compact
		? 'p-3'
		: 'p-4 sm:p-5'}"
	style="border-radius: {radius}px; box-shadow: {depth}px {depth}px 0 var(--edge);"
>
	<div class="flex items-start justify-between gap-2 {compact ? 'mb-2' : 'mb-3'}">
		{#if tile.badge}
			<span
				class="rounded-full font-mono font-bold tracking-wider uppercase {color.badge} {compact
					? 'px-1.5 py-0.5 text-[9px]'
					: 'px-2.5 py-0.5 text-xs'}"
			>
				{tile.badge}
			</span>
		{:else}
			<span></span>
		{/if}
		<Icon name={tile.icon ?? 'arrow_outward'} class={compact ? 'text-sm' : 'text-lg'} />
	</div>

	{#if tile.imageUrl}
		<div
			class="border-ink mb-3 h-36 w-full overflow-hidden rounded-2xl border-2 bg-black/10 sm:h-44"
		>
			<img
				src={tile.imageUrl}
				alt=""
				loading="lazy"
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		</div>
	{/if}

	<div>
		<h3
			class="font-display leading-snug font-extrabold {compact ? 'text-sm' : 'text-lg sm:text-xl'}"
		>
			{tile.title}
		</h3>
		{#if tile.subtitle}
			<p class="mt-1 opacity-80 {compact ? 'text-[11px]' : 'text-xs sm:text-sm'}">
				{tile.subtitle}
			</p>
		{/if}
	</div>
</a>
