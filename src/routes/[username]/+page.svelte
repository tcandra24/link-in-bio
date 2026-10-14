<script lang="ts">
	import { page } from '$app/state';
	import ProfileHeader from '#lib/components/ProfileHeader.svelte';
	import LinkCard from '#lib/components/LinkCard.svelte';
	import { mockProfile, mockLinks } from '#lib/mock.ts';

	let username = $derived(page.params.username ?? '');
</script>

<svelte:head>
	<title>@{username} | LinkBio</title>
</svelte:head>

<main class="mx-auto flex min-h-screen max-w-md flex-col gap-8 px-4 py-12">
	<ProfileHeader {username} displayName={mockProfile.displayName} bio={mockProfile.bio} />

	<section class="flex flex-col gap-3">
		{#each mockLinks as link (link.id)}
			<LinkCard title={link.title} url={link.url} />
		{/each}
	</section>
</main>
