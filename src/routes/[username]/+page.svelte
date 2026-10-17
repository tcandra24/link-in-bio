<script lang="ts">
  import { page } from '$app/state';
  import BentoTile from '#lib/components/BentoTile.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import ProfileHeader from '#lib/components/ProfileHeader.svelte';
  import ShareDialog from '#lib/components/ShareDialog.svelte';
  import { SITE } from '#lib/config.ts';
  import { themes } from '#lib/tiles.ts';
  import type { PageProps } from './$types';

  // `data` datang dari +page.server.ts: { profile, tiles }
  let { data }: PageProps = $props();

  let profile = $derived(data.profile);
  let look = $derived(themes[profile.theme]);

  let shareOpen = $state(false);
  let shareUrl = $derived(`${page.url.origin}/${profile.username}`);

  let title = $derived(`${profile.displayName} (@${profile.username}) | ${SITE.name}`);
  let description = $derived(
    profile.bio || `All links ${profile.displayName} in one board.`
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={shareUrl} />

  <meta property="og:type" content="profile" />
  <meta property="og:site_name" content={SITE.name} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={shareUrl} />
  {#if profile.avatarUrl}
    <meta property="og:image" content={profile.avatarUrl} />
    <meta name="twitter:image" content={profile.avatarUrl} />
  {/if}

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
</svelte:head>

<div class="flex min-h-screen flex-col justify-between {look.page} {look.dots}">
  <!-- Bilah mengambang -->
  <div
    class="neo-shadow fixed top-3 left-1/2 z-40 flex max-w-[96vw] -translate-x-1/2 items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-ink"
  >
    <span class="truncate px-1 font-mono text-[11px] font-bold text-muted sm:text-xs">
      {SITE.domain}/{profile.username}
    </span>
    <button
      type="button"
      onclick={() => (shareOpen = true)}
      class="inline-flex shrink-0 items-center gap-1 rounded-full border border-ink bg-sun px-3 py-1.5 font-mono text-[11px] font-bold transition-transform hover:scale-105 active:scale-95 sm:text-xs"
    >
      <Icon name="share" class="text-sm" />
      Share
    </button>
  </div>

  <main class="mx-auto flex w-full max-w-2xl flex-col items-center px-3 pt-20 pb-16 sm:px-4">
    <ProfileHeader
      username={profile.username}
      displayName={profile.displayName}
      bio={profile.bio}
      avatarUrl={profile.avatarUrl}
      verified={profile.verified}
    />

    <!-- Papan bento -->
    {#if data.tiles.length > 0}
      <section class="mt-2 grid w-full auto-rows-[minmax(9rem,auto)] grid-cols-2 gap-4">
        {#each data.tiles as tile (tile.id)}
          <BentoTile {tile} href="/go/{tile.id}" radius={profile.cornerRadius} depth={profile.shadowDepth} />
        {/each}
      </section>
    {:else}
      <p
        class="neo-shadow w-full rounded-3xl border-2 border-dashed border-(--edge) p-8 text-center font-mono text-sm opacity-80"
      >
        This Board is still empty.
      </p>
    {/if}

    <!-- Ajakan membuat papan sendiri -->
    <div class="mt-12 flex flex-col items-center gap-3">
      <a
        href="/register"
        class="neo-shadow flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-6 py-3 font-display text-sm font-bold text-ink transition-all hover:neo-shadow-lg active:translate-x-0.5 active:translate-y-0.5"
      >
        Create your own board on {SITE.name}
        <Icon name="arrow_forward" class="text-base" />
      </a>
      <span class="font-mono text-[11px] font-bold tracking-widest uppercase dot-text-card p-2 rounded-xl">
        Bento link board • {SITE.domain}
      </span>
    </div>
  </main>
</div>

<ShareDialog bind:open={shareOpen} url={shareUrl} />
