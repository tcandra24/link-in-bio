<script lang="ts">
  import BentoTile from '#lib/components/BentoTile.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import Logo from '#lib/components/Logo.svelte';
  import { SITE } from '#lib/config.ts';
  import type { Tile } from '#lib/types.ts';

  let menuOpen = $state(false);

  // Form klaim username (GET /register?username=...) — jalan tanpa JavaScript
  let handle = $state('');
  let handleValid = $derived(/^[a-z0-9_]{3,20}$/.test(handle));

  function cleanHandle(event: Event & { currentTarget: HTMLInputElement }) {
    handle = event.currentTarget.value
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 20);
    event.currentTarget.value = handle;
  }

  const demoTiles: Tile[] = [
    {
      id: 'd1',
      title: 'Show 42 Latest Works',
      url: '/demo',
      size: '2x1',
      color: 'tomato',
      badge: 'Portfolio',
      icon: 'arrow_outward',
      isActive: true
    },
    {
      id: 'd2',
      title: 'Sticker Pack',
      subtitle: 'Start from 25k',
      url: '/demo',
      size: '1x1',
      color: 'sun',
      badge: 'Shop',
      icon: 'shopping_bag',
      isActive: true
    },
    {
      id: 'd3',
      title: 'Work vibes',
      subtitle: 'Late afternoon lo-fi',
      url: '/demo',
      size: '1x1',
      color: 'mint',
      badge: 'Playlist',
      icon: 'equalizer',
      isActive: true
    },
    {
      id: 'd4',
      title: 'Open for commissions',
      url: '/demo',
      size: '2x1',
      color: 'lilac',
      badge: 'Status',
      icon: 'palette',
      isActive: true
    }
  ];

  const steps = [
    {
      label: 'Sign up & claim',
      title: 'Claim your personal link',
      text: 'Claim an address like plot.id/yourname in seconds.',
      color: 'bg-sun'
    },
    {
      label: 'Arrange tiles',
      title: 'Free combination',
      text: 'Add links, notes, shops, or playlists. Customize the size and color of each tile.',
      color: 'bg-mint'
    },
    {
      label: 'Share',
      title: 'One link for all',
      text: 'Put it in your Instagram, TikTok, or X bio. Your audience just needs to open one page.',
      color: 'bg-lilac'
    }
  ];
</script>

<div class="flex min-h-screen flex-col justify-between">
  <!-- Header -->
  <header class="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 px-3 py-3 backdrop-blur-md sm:px-8">
    <div class="mx-auto flex max-w-7xl items-center justify-between">
      <div class="flex items-center gap-3">
        <Logo />
        <div
          class="neo-shadow-sm hidden rotate-1 items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-3 py-1 font-mono text-xs font-bold md:inline-flex"
        >
          <span>✨</span>
          <span>One board for all your links</span>
        </div>
      </div>

      <nav class="hidden items-center gap-6 font-display text-sm font-bold lg:flex">
        <a href="#how-to" class="transition-colors hover:text-rust">How it works</a>
        <a href="#feature" class="transition-colors hover:text-rust">Features</a>
        <a href="/demo" class="transition-colors hover:text-rust">Board examples</a>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <a
          href="/login"
          class="px-2.5 py-1.5 font-display text-xs font-bold transition-colors hover:text-rust sm:px-4 sm:py-2 sm:text-sm"
        >
          Getting Started
        </a>
        <a
          href="/register"
          class="neo-shadow-sm rounded-full border-2 border-ink bg-tomato px-3.5 py-2 font-display text-xs font-bold transition-all hover:neo-shadow active:translate-x-0.5 active:translate-y-0.5 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          Start free
        </a>
        <button
          type="button"
          onclick={() => (menuOpen = !menuOpen)}
          aria-label="Navigation menu"
          aria-expanded={menuOpen}
          class="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink bg-sand lg:hidden"
        >
          <Icon name={menuOpen ? 'close' : 'menu'} class="text-lg" />
        </button>
      </div>
    </div>

    {#if menuOpen}
      <nav
        class="mt-3 flex animate-fade-in flex-col gap-2 border-t-2 border-ink pt-3 font-display text-sm font-bold lg:hidden"
      >
        <a href="#how-to" onclick={() => (menuOpen = false)} class="rounded-lg p-2 hover:bg-sand">
          How it works
        </a>
        <a href="#feature" onclick={() => (menuOpen = false)} class="rounded-lg p-2 hover:bg-sand">
          Features
        </a>
        <a
          href="/demo"
          class="neo-shadow-sm flex items-center justify-between rounded-lg border-2 border-ink bg-sun p-2"
        >
          Board examples
          <Icon name="arrow_forward" class="text-base" />
        </a>
      </nav>
    {/if}
  </header>

  <main>
    <!-- Hero -->
    <section class="relative overflow-hidden border-b-2 border-ink bg-dot-grid px-4 pt-10 pb-16 sm:px-8">
      <div
        class="pointer-events-none absolute top-4 right-1/4 z-10 h-6 w-32 rotate-[4deg] rounded-xs border border-ink bg-washi opacity-80"
      ></div>
      <div
        class="pointer-events-none absolute bottom-8 left-12 z-10 h-5 w-28 rotate-[-5deg] rounded-xs border border-ink bg-mint opacity-70"
      ></div>

      <div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div class="flex flex-col gap-6 lg:col-span-7">
          <div
            class="neo-shadow-sm inline-flex -rotate-1 items-center gap-2 self-start rounded-full border-2 border-ink bg-paper px-3.5 py-1.5"
          >
            <span class="h-2.5 w-2.5 animate-pulse rounded-full bg-pine"></span>
            <span class="font-mono text-xs font-bold">Biolink bento for independent creators</span>
          </div>

          <h1
            class="font-display text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
          >
            One board for what you share.
          </h1>

          <div class="dot-text-card p-3.5 sm:p-4 rounded-2xl max-w-xl">
            <p class="font-body text-sm sm:text-base text-ink font-medium leading-relaxed">
              It's more than just a simple row of link buttons. 
              Create a micro-portfolio and bring together your work, social media, shop links, and key notes on a bento-style board, designed with an engaging, sticker-collage aesthetic.
            </p>
          </div>

          <!-- Klaim username -->
          <form
            action="/register"
            method="GET"
            class="neo-shadow flex max-w-xl flex-col items-stretch gap-2 rounded-2xl border-2 border-ink bg-paper p-2 sm:flex-row sm:items-center"
          >
            <label
              class="neo-shadow-sm flex flex-1 items-center rounded-xl border-2 border-ink bg-white px-3 py-2"
            >
              <span class="mr-1 font-mono text-xs font-bold text-muted select-none sm:text-sm">
                {SITE.domain}/
              </span>
              <input
                name="username"
                type="text"
                required
                autocomplete="off"
                placeholder="your name"
                pattern={'[a-z0-9_]{3,20}'}
                value={handle}
                oninput={cleanHandle}
                class="w-full bg-transparent font-mono text-sm font-bold focus:outline-none"
              />
              {#if handleValid}
                <span
                  class="ml-2 hidden shrink-0 items-center gap-1 rounded-md border border-ink bg-mint px-2 py-0.5 font-mono text-[11px] sm:inline-flex"
                >
                  <Icon name="check" class="text-xs" />
                  Format valid
                </span>
              {/if}
            </label>

            <button
              type="submit"
              class="neo-shadow-sm flex shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-ink bg-tomato px-6 py-3 font-display text-sm font-bold transition-all hover:neo-shadow active:translate-x-0.5 active:translate-y-0.5"
            >
              Claim your plot
              <Icon name="arrow_forward" class="text-base" />
            </button>
          </form>

          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted">
            <span class="dot-text-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs">
              <Icon name="lock" class="text-sm text-rust" />
              Secure your unique name first
            </span>
            <span class="dot-text-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs">
              <Icon name="verified" class="text-sm text-pine" />
              Free &amp; instant
            </span>
          </div>
        </div>

        <!-- Mockup ponsel -->
        <div class="flex justify-center lg:col-span-5">
          <div class="relative w-full max-w-85">
            <div
              class="neo-shadow-sm absolute -top-3 right-6 z-20 rotate-3 rounded-sm border-2 border-ink bg-washi px-3 py-1"
            >
              <span class="font-mono text-xs font-bold uppercase">@nayla_studio</span>
            </div>

            <div class="neo-shadow-lg w-full rounded-[44px] bg-ink p-3.5">
              <div
                class="theme-paper flex min-h-140 flex-col gap-3 rounded-[34px] border-2 border-ink bg-paper bg-dot-grid p-4"
              >
                <div class="mb-1 h-4 w-28 self-center rounded-full bg-ink"></div>

                <div
                  class="flex items-center justify-between rounded-full border border-ink bg-sand px-3 py-1.5 font-mono text-[11px]"
                >
                  <span class="font-bold">{SITE.domain}/nayla_studio</span>
                  <a href="/demo" aria-label="Buka contoh papan" class="hover:text-rust">
                    <Icon name="open_in_new" class="text-xs" />
                  </a>
                </div>

                <div class="flex flex-col items-center gap-1.5 pt-1 text-center">
                  <div
                    class="neo-shadow-sm flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-sun font-display text-2xl font-extrabold"
                  >
                    N
                  </div>
                  <h3 class="font-display text-base leading-tight font-bold">Nayla Paramitha</h3>
                  <p class="text-xs text-muted">Visual artist • Bandung</p>
                </div>

                <div class="mt-1 grid auto-rows-[minmax(6.5rem,auto)] grid-cols-2 gap-2">
                  {#each demoTiles as tile (tile.id)}
                    <BentoTile {tile} radius={16} depth={2} compact external={false} />
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cara kerja -->
    <section id="how-to" class="border-b-2 border-ink bg-sand-deep px-4 py-16 sm:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="mb-10 max-w-2xl">
          <div
            class="neo-shadow-sm mb-3 inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-3 py-1 font-mono text-xs font-bold"
          >
            <Icon name="bolt" class="text-sm" />
            Quick Start
          </div>
          <h2 class="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Only takes a few minutes to have your own board.
          </h2>
          <p class="mt-3 text-muted">
            As easy as sticking a sticker on a notebook. No coding, no rigid templates.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          {#each steps as step, i (step.label)}
            <div
              class="neo-shadow flex flex-col justify-between gap-6 rounded-3xl border-2 border-ink bg-paper p-6"
            >
              <div>
                <span
                  class="inline-block rounded-full border border-ink px-2.5 py-0.5 font-mono text-xs font-bold uppercase {step.color}"
                >
                  {i + 1}. {step.label}
                </span>
                <h3 class="mt-3 font-display text-xl font-extrabold">{step.title}</h3>
                <p class="mt-1 text-sm text-muted">{step.text}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- feature -->
    <section id="feature" class="border-b-2 border-ink bg-dot-grid px-4 py-16 sm:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="text-center mb-10 max-w-2xl mx-auto">
          <span
            class="neo-shadow-sm mb-3 inline-block rounded-full border-2 border-ink bg-lilac px-3 py-1 font-mono text-xs font-bold uppercase"
          >
            Creative freature
          </span>
          <h2 class="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
            A Biolink that feels like an original creation.
          </h2>
          <div class="dot-text-card px-4 py-2.5 rounded-2xl max-w-xl mx-auto mt-3">
            <p class="font-body text-sm sm:text-base text-ink font-medium">            
              Ditch the boring vertical list. Showcase your world in a canvas format.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            class="neo-shadow flex flex-col justify-between gap-6 rounded-3xl border-2 border-ink bg-tomato p-6 md:col-span-2"
          >
            <div>
              <span class="font-mono text-xs font-bold uppercase">Quick &amp; responsive</span>
              <h3 class="mt-1 font-display text-2xl font-extrabold">Fluid public board</h3>
              <p class="mt-1 max-w-lg text-sm">
                Pages are server-rendered, so they load quickly and look great on both mobile and
                widescreen displays.
              </p>
            </div>
            <div class="flex flex-wrap gap-2 font-mono text-xs font-bold">
              <span class="rounded-full border-2 border-ink bg-paper px-3 py-1">⚡ Super light</span>
              <span class="rounded-full border-2 border-ink bg-paper px-3 py-1">📱 Responsive</span>
              <span class="rounded-full border-2 border-ink bg-paper px-3 py-1">🔎 SEO friendly</span>
            </div>
          </div>

          <div
            class="neo-shadow flex flex-col justify-between gap-6 rounded-3xl border-2 border-ink bg-sun p-6"
          >
            <div>
              <span class="font-mono text-xs font-bold uppercase">Modular</span>
              <h3 class="mt-1 font-display text-2xl font-extrabold">Atur ukuran petak</h3>
              <p class="mt-1 text-sm">
                Choose 1×1, 2×1, or 2×2 for each tile, then arrange them.
              </p>
            </div>
            <div class="flex items-center gap-2 font-mono text-xs font-bold">
              <Icon name="drag_indicator" class="text-base" />
              Drag to reorder
            </div>
          </div>

          <div
            class="neo-shadow flex flex-col justify-between gap-6 rounded-3xl border-2 border-ink bg-mint p-6"
          >
            <div>
              <span class="font-mono text-xs font-bold uppercase">Statistics</span>
              <h3 class="mt-1 font-display text-2xl font-extrabold">Track every click</h3>
              <p class="mt-1 text-sm">See which tiles are getting the most attention from your audience.</p>
            </div>
            <div class="flex items-center gap-2 font-mono text-xs font-bold">
              <Icon name="trending_up" class="text-base" />
              Last 7 days
            </div>
          </div>

          <div
            class="neo-shadow flex flex-col justify-between gap-6 rounded-3xl border-2 border-ink bg-lilac p-6 md:col-span-2"
          >
            <div>
              <span class="font-mono text-xs font-bold uppercase">Theme &amp; style</span>
              <h3 class="mt-1 font-display text-2xl font-extrabold">
                Paper, Night, or Candy
              </h3>
              <p class="mt-1 max-w-lg text-sm">
                Change the entire profile look with one tap, using a palette that remains easy to read.
              </p>
            </div>
            <div class="flex flex-wrap gap-2 font-mono text-xs font-bold">
              <a href="/demo?theme=paper" class="rounded-full border-2 border-ink bg-paper px-3 py-1">
                Paper
              </a>
              <a href="/demo?theme=clay" class="rounded-full border-2 border-ink bg-ink px-3 py-1 text-paper">
                Clay
              </a>
              <a href="/demo?theme=candy" class="rounded-full border-2 border-ink bg-candy px-3 py-1">
                Candy
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative overflow-hidden border-b-2 border-ink bg-tomato px-4 py-20 text-center sm:px-8">
      <div class="mx-auto flex max-w-2xl flex-col items-center gap-5">
        <span
          class="neo-shadow-sm rounded-full border-2 border-ink bg-paper px-3 py-1 font-mono text-xs font-bold"
        >
          🚀 Start for free
        </span>
        <h2 class="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
          Ready to create a biolink that truly represents you?
        </h2>
        <p class="max-w-xl">
          Claim your unique link today and set up your first bento board in minutes.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <a
            href="/register"
            class="neo-shadow flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-6 py-3 font-display text-sm font-bold text-paper transition-all hover:neo-shadow-lg active:translate-x-0.5 active:translate-y-0.5"
          >
            Start for free
            <Icon name="arrow_forward" class="text-base" />
          </a>
          <a
            href="/demo"
            class="neo-shadow rounded-full border-2 border-ink bg-paper px-6 py-3 font-display text-sm font-bold transition-all hover:neo-shadow-lg active:translate-x-0.5 active:translate-y-0.5"
          >
            View demo board
          </a>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="bg-ink px-4 py-10 font-mono text-xs text-paper sm:px-8">
    <div
      class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row"
    >
      <div class="flex flex-col items-center gap-2 md:items-start">
        <Logo light />
        <p class="opacity-70">Link curation, galleries, music &amp; story in one bento canvas.</p>
      </div>
      <nav class="flex gap-5 font-bold">
        <a href="#how-to" class="hover:text-sun">How it works</a>
        <a href="#feature" class="hover:text-sun">Features</a>
        <a href="/demo" class="hover:text-sun">Demo</a>
      </nav>
    </div>
  </footer>
</div>
