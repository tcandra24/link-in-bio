<script lang="ts">
  import Icon from './Icon.svelte';

  interface Props {
    open: boolean;
    url: string;
  }

  let { open = $bindable(false), url }: Props = $props();

  let dialog: HTMLDialogElement;
  let copied = $state(false);

  // Sinkronkan prop `open` dengan elemen <dialog> native
  $effect(() => {
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch {
      // clipboard bisa ditolak browser; pengguna masih bisa menyalin manual dari input
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  onclose={() => (open = false)}
  onclick={(e) => {
    if (e.target === dialog) open = false; // klik area gelap = tutup
  }}
  class="neo-shadow-lg m-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl border-2 border-ink bg-paper p-0 text-ink backdrop:bg-black/40 backdrop:backdrop-blur-xs"
>
  <div class="flex flex-col gap-4 p-6">
    <div class="flex items-center justify-between border-b-2 border-ink pb-2">
      <div class="flex items-center gap-2">
        <Icon name="share" class="text-rust" />
        <h2 class="font-display text-lg font-bold">Bagikan papan</h2>
      </div>
      <button
        type="button"
        onclick={() => (open = false)}
        aria-label="Tutup"
        class="flex h-8 w-8 items-center justify-center rounded-full border border-ink bg-sand hover:bg-washi"
      >
        <Icon name="close" class="text-base" />
      </button>
    </div>

    <p class="text-sm text-muted">Tempel tautan ini di bio Instagram, TikTok, atau di mana saja.</p>

    <div class="flex items-center gap-2 rounded-xl border-2 border-ink bg-white p-2">
      <input
        readonly
        value={url}
        aria-label="Tautan papan"
        class="w-full bg-transparent font-mono text-xs focus:outline-none"
      />
      <button
        type="button"
        onclick={copy}
        class="neo-shadow-sm shrink-0 rounded-lg border border-ink bg-sun px-3 py-1.5 font-mono text-xs font-bold"
      >
        {copied ? 'Tersalin ✓' : 'Salin'}
      </button>
    </div>
  </div>
</dialog>
