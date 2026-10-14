<script lang="ts">
  import { page } from '$app/state';
  import Icon from '#lib/components/Icon.svelte';
  import Logo from '#lib/components/Logo.svelte';
  import { SITE } from '#lib/config.ts';

  let username = $derived(page.params.username);
  let notFound = $derived(page.status === 404);
  let unclaimed = $derived(notFound && !!username && page.error?.message?.includes('unclaimed'));

  let title = $derived(
    unclaimed
      ? `Plot @${username} unclaimed`
      : notFound
        ? 'Page Not Found'
        : 'Something Went Wrong'
  );

  let text = $derived(
    unclaimed
      ? 'This username is still available. Claim it now before someone else takes it.'
      : notFound
        ? 'The page you are looking for does not exist. Maybe there was a typo?'
        : 'There was a problem on our end. Please try reloading in a moment.'
  );
</script>

<svelte:head>
  <title>{page.status} | {SITE.name}</title>
</svelte:head>

<main class="flex min-h-screen flex-col items-center justify-center gap-8 bg-dot-grid px-4 text-center">
  <Logo />

  <div
    class="neo-shadow-lg flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border-2 border-ink bg-sun p-8"
  >
    <span
      class="rounded-full bg-ink px-3 py-1 font-mono text-xs font-bold tracking-wider text-paper uppercase"
    >
      Error {page.status}
    </span>
    <h1 class="font-display text-3xl leading-tight font-extrabold tracking-tight">{title}</h1>
    <p class="text-sm">{text}</p>

    <div class="mt-2 flex flex-wrap justify-center gap-3">
      {#if unclaimed}
        <a
          href="/register?username={encodeURIComponent(username ?? '')}"
          class="neo-shadow-sm flex items-center gap-1.5 rounded-full border-2 border-ink bg-tomato px-5 py-2.5 font-display text-sm font-bold transition-all hover:neo-shadow active:translate-x-0.5 active:translate-y-0.5"
        >
          Claim this username
          <Icon name="arrow_forward" class="text-base" />
        </a>
      {/if}
      <a
        href="/"
        class="neo-shadow-sm rounded-full border-2 border-ink bg-paper px-5 py-2.5 font-display text-sm font-bold transition-all hover:neo-shadow active:translate-x-0.5 active:translate-y-0.5"
      >
        To Home
      </a>
    </div>
  </div>
</main>
