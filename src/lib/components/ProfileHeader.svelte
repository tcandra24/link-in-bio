<script lang="ts">
	import { SITE } from '#lib/config.ts';
	import Icon from './Icon.svelte';

	interface Props {
		username: string;
		displayName: string;
		bio?: string;
		avatarUrl?: string;
		verified?: boolean;
	}

	let { username, displayName, bio, avatarUrl, verified = false }: Props = $props();
</script>

<header class="relative mt-2 mb-6 flex w-full flex-col items-center text-center sm:mt-4">
	<!-- Pita washi -->
	<div
		class="neo-shadow-sm border-ink bg-sun/85 text-ink mb-3 flex h-5 w-28 -rotate-2 items-center justify-center border font-mono text-[9px] font-bold tracking-widest uppercase sm:h-6 sm:text-[10px]"
	>
		Link board
	</div>

	<!-- Avatar -->
	<div class="relative mb-3">
		<div
			class="bg-sun flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-(--edge) p-1 sm:h-24 sm:w-24"
			style="box-shadow: 4px 4px 0 var(--edge);"
		>
			{#if avatarUrl}
				<img src={avatarUrl} alt={displayName} class="h-full w-full rounded-full object-cover" />
			{:else}
				<span class="font-display text-ink text-3xl font-extrabold sm:text-4xl">
					{displayName.charAt(0).toUpperCase()}
				</span>
			{/if}
		</div>

		{#if verified}
			<div
				class="neo-shadow-sm border-ink bg-sun text-ink absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 sm:h-8 sm:w-8"
				title="Kreator terverifikasi"
			>
				<Icon name="verified" filled class="text-base sm:text-lg" />
			</div>
		{/if}
	</div>

	<h1 class="font-display text-2xl leading-tight font-extrabold tracking-tight sm:text-3xl">
		{displayName}
	</h1>

	<span
		class="border-ink bg-sun text-ink mt-1 rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold"
	>
		{SITE.domain}/{username}
	</span>

	{#if bio}
	<div class="dot-text-card p-2.5 sm:p-3 rounded-2xl max-w-xl my-3">
		<p class="max-w-lg px-4 text-sm leading-relaxed opacity-80 sm:text-base">{bio}</p>
	</div>
	{/if}
</header>
