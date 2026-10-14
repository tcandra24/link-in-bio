<script lang="ts">
	import { SITE } from '#lib/config.ts';
	import Icon from './Icon.svelte';

	interface Props {
		href?: string;
		light?: boolean;
	}

	let { href = '/', light = false }: Props = $props();
</script>

<a {href} class="flex items-center gap-2" aria-label="{SITE.name} — beranda">
	<span
		class="neo-shadow-sm border-ink bg-tomato flex h-8 w-8 rotate-[-3deg] items-center justify-center rounded-xl border-2 sm:h-9 sm:w-9"
	>
		<Icon name="grid_view" filled class="text-ink text-lg sm:text-xl" />
	</span>
	<span
		class="font-display text-xl font-extrabold tracking-tight sm:text-2xl {light
			? 'text-paper'
			: 'text-ink'}"
	>
		{SITE.name}
	</span>
</a>
