<script lang="ts">
  import { page } from '$app/state';
  import Icon from '#lib/components/Icon.svelte';
  import Logo from '#lib/components/Logo.svelte';

  let { children } = $props();

  let isLogin = $derived(page.url.pathname === '/login');

  const tab = 'flex items-center justify-center gap-1.5 rounded-xl py-2.5 font-display font-bold transition-all';
  const tabOn = 'neo-shadow-sm border-2 border-ink bg-tomato text-ink';
  const tabOff = 'text-muted hover:bg-white/50 hover:text-ink';
</script>

<svelte:head>
  <meta name="robots" content="noindex" />
</svelte:head>

<main class="flex min-h-screen flex-col items-center justify-center gap-6 bg-dot-grid px-4 py-10">
  <Logo />

  <div class="neo-shadow-lg w-full max-w-md rounded-3xl border-2 border-ink bg-paper p-6 sm:p-8">
    <div class="neo-shadow-sm mb-6 grid grid-cols-2 gap-1 rounded-2xl border-2 border-ink bg-sand p-1.5">
      <a
        href="/login"
        aria-current={isLogin ? 'page' : undefined}
        class="{tab} {isLogin ? tabOn : tabOff}"
      >
        <Icon name="login" class="text-lg" />
        Sign In
      </a>
      <a
        href="/register"
        aria-current={!isLogin ? 'page' : undefined}
        class="{tab} {!isLogin ? tabOn : tabOff}"
      >
        <Icon name="person_add" class="text-lg" />
        Sign Up
      </a>
    </div>

    {@render children()}
  </div>

  <a href="/" class="flex items-center gap-1 font-mono text-xs font-bold hover:text-rust">
    <Icon name="arrow_back" class="text-sm" />
    Back to home
  </a>
</main>
