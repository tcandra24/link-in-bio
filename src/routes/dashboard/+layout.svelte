<script lang="ts">
  import { page } from '$app/state';
  import { themes } from '#lib/tiles.ts';
  import Icon from '#lib/components/Icon.svelte';
  import Logo from '#lib/components/Logo.svelte';
  import { SITE } from '#lib/config.ts';
  import type { LayoutProps } from './$types';

  let { data, children }: LayoutProps = $props();

  let copied = $state(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${page.url.origin}/${data.profile.username}`);
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch {
      // clipboard bisa ditolak browser
    }
  }

  // Tab "Tampilan" dibuka di Hari 5, "Statistik" di Hari 6
  const tabs = [
    { href: '/dashboard', label: 'Plot', icon: 'dashboard_customize' },
    { href: null, label: 'Appearance', icon: 'palette' },
    { href: null, label: 'Statistics', icon: 'bar_chart' }
  ];

  let profile = $derived(data.profile);
  let look = $derived(themes[profile.theme]);
</script>

<div class="min-h-screen bg-sand-deep {look.page} {look.dots}">
  <header class="border-b-2 border-ink bg-paper px-4 py-3 sm:px-8">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
      <Logo href="/dashboard" />

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onclick={copyLink}
          class="neo-shadow-sm flex items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-3 py-1.5 font-mono text-xs font-bold"
        >
          {SITE.domain}/{data.profile.username}
          <Icon name={copied ? 'check' : 'content_copy'} class="text-sm" />
        </button>

        <a
          href="/{data.profile.username}"
          target="_blank"
          rel="noopener noreferrer"
          class="neo-shadow-sm flex items-center gap-1 rounded-full border-2 border-ink bg-paper px-3 py-1.5 font-display text-xs font-bold hover:bg-washi"
        >
          Show board
          <Icon name="open_in_new" class="text-sm" />
        </a>

        <form method="POST" action="/logout">
          <button
            type="submit"
            class="neo-shadow-sm flex items-center gap-1 rounded-full border-2 border-ink bg-sand px-3 py-1.5 font-display text-xs font-bold hover:bg-washi"
          >
            <Icon name="logout" class="text-sm" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  </header>

  <nav class="mx-auto mt-6 flex max-w-6xl gap-2 px-4 sm:px-8" aria-label="Menu dashboard">
    {#each tabs as tab (tab.label)}
      {#if tab.href}
        <a
          href={tab.href}
          aria-current={page.url.pathname === tab.href ? 'page' : undefined}
          class="neo-shadow-sm flex items-center gap-1.5 rounded-full border-2 border-ink px-4 py-2 font-display text-sm font-bold {page
            .url.pathname === tab.href
            ? 'bg-tomato'
            : 'bg-paper hover:bg-washi'}"
        >
          <Icon name={tab.icon} class="text-base" />
          {tab.label}
        </a>
      {:else}
        <span
          title="Comming soon"
          class="flex cursor-not-allowed items-center gap-1.5 rounded-full border-2 border-ink/30 px-4 py-2 font-display text-sm font-bold text-ink/40"
        >
          <Icon name={tab.icon} class="text-base" />
          {tab.label}
        </span>
      {/if}
    {/each}
  </nav>

  {@render children()}
</div>
