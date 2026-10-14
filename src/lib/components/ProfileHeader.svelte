<script lang="ts">
	interface Props {
		username: string;
		displayName: string;
		bio?: string;
		avatarUrl?: string;
	}

	let { username, displayName, bio, avatarUrl }: Props = $props();
</script>

<header class="flex flex-col items-center gap-2 text-center">
	{#if avatarUrl}
		<img src={avatarUrl} alt={displayName} class="h-24 w-24 rounded-full object-cover" />
	{:else}
		<div
			class="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-900 text-3xl font-bold text-white"
		>
			{displayName.charAt(0).toUpperCase()}
		</div>
	{/if}

	<h1 class="text-xl font-bold">{displayName}</h1>
	<p class="text-sm text-neutral-500">@{username}</p>

	{#if bio}
		<p class="max-w-xs text-neutral-700">{bio}</p>
	{/if}
</header>
