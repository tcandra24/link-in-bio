<script lang="ts">
  import { enhance } from '$app/forms';
  import Alert from '#lib/components/Alert.svelte';
  import BoardPreview from '#lib/components/BoardPreview.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import TileForm from '#lib/components/TileForm.svelte';
  import { MAX_TILES } from '#lib/config.ts';
  import { NO_ERRORS } from '#lib/schemas.ts';
  import { sizeLabels, tileColors } from '#lib/tiles.ts';
  import type { Tile, TileValues } from '#lib/types.ts';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();

  const defaults: TileValues = {
    title: '',
    subtitle: '',
    url: '',
    size: '1x1',
    color: 'sun',
    badge: '',
    icon: 'arrow_outward'
  };

  // Pesan sukses hanya untuk aksi yang jarang; toggle/geser tidak perlu notifikasi
  const notices: Record<string, string> = {
    create: 'Plot added.',
    update: 'Changes saved.',
    delete: 'Plot deleted.'
  };

  let adding = $state(false);
  let editingId = $state<string | null>(null);

  let activeCount = $derived(data.tiles.filter((tile) => tile.isActive).length);
  let atLimit = $derived(data.tiles.length >= MAX_TILES);

  let notice = $derived(form?.ok ? notices[form.intent] : undefined);

  // Kalau server menolak, buka kembali panel yang bersangkutan
  $effect(() => {
    if (form?.ok || !form) return;
    if (form.intent === 'create') adding = true;
    if (form.intent === 'update' && form.id) editingId = form.id;
  });

  let createValues = $derived(form?.intent === 'create' && form.values ? form.values : defaults);
  let createErrors = $derived(form?.intent === 'create' ? (form.errors ?? NO_ERRORS) : NO_ERRORS);

  function editValues(tile: Tile): TileValues {
    if (form?.intent === 'update' && form.id === tile.id && form.values) return form.values;
    return {
      title: tile.title,
      subtitle: tile.subtitle ?? '',
      url: tile.url,
      size: tile.size,
      color: tile.color,
      badge: tile.badge ?? '',
      icon: tile.icon ?? 'arrow_outward'
    };
  }

  function editErrors(tile: Tile) {
    return form?.intent === 'update' && form.id === tile.id ? (form.errors ?? NO_ERRORS) : NO_ERRORS;
  }

  const iconButton =
    'flex h-8 w-8 items-center justify-center rounded-lg border border-ink bg-sand transition-colors disabled:opacity-20';
  const primaryButton =
    'neo-shadow-sm flex items-center justify-center gap-1.5 rounded-full border-2 border-ink bg-tomato px-5 py-2.5 font-display text-sm font-bold transition-all hover:neo-shadow active:translate-x-0.5 active:translate-y-0.5';
</script>

<svelte:head>
  <title>Plot | Dashboard</title>
</svelte:head>

<main class="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
  <div class="flex min-w-0 flex-col gap-5">
    {#if form?.message}
      <Alert message={form.message} title="Perubahan belum berhasil" />
    {:else if notice}
      <div
        role="status"
        class="neo-shadow-sm flex items-center gap-2 rounded-2xl border-2 border-ink bg-mint p-3 font-display text-sm font-bold"
      >
        <Icon name="check_circle" filled class="text-lg" />
        {notice}
      </div>
    {/if}

    <!-- Tambah petak -->
    <section class="neo-shadow rounded-3xl border-2 border-ink bg-paper">
      <button
        type="button"
        onclick={() => (adding = !adding)}
        disabled={atLimit}
        aria-expanded={adding}
        class="flex w-full items-center justify-between gap-3 p-4 text-left disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span class="flex items-center gap-2 font-display text-lg font-bold">
          <Icon name={adding ? 'remove' : 'add'} class="text-xl" />
          {atLimit ? `Batas ${MAX_TILES} petak tercapai` : 'Tambah petak'}
        </span>
        <span class="font-mono text-xs text-muted">{data.tiles.length}/{MAX_TILES}</span>
      </button>

      {#if adding && !atLimit}
        <form
          method="POST"
          action="?/create"
          class="border-t-2 border-ink/10 p-4"
          use:enhance={() =>
            async ({ result, update }) => {
              await update();
              if (result.type === 'success') adding = false;
            }}
        >
          <TileForm uid="new" values={createValues} errors={createErrors} />
          <div class="mt-5 flex gap-2">
            <button type="submit" class={primaryButton}>Simpan petak</button>
            <button
              type="button"
              onclick={() => (adding = false)}
              class="rounded-full border-2 border-ink bg-sand px-5 py-2.5 font-display text-sm font-bold hover:bg-washi"
            >
              Batal
            </button>
          </div>
        </form>
      {/if}
    </section>

    <!-- Daftar petak -->
    <section class="flex flex-col gap-3">
      <div class="flex items-center justify-between px-1">
        <h2 class="flex items-center gap-2 font-display text-lg font-bold">
          Daftar petak
          <span class="rounded-full border border-ink bg-sand px-2 py-0.5 font-mono text-xs">
            {activeCount} tampil
          </span>
        </h2>
        <span class="flex items-center gap-1 font-mono text-xs text-muted">
          <Icon name="swap_vert" class="text-sm" /> Urutan dari atas
        </span>
      </div>

      {#if data.tiles.length === 0}
        <div
          class="rounded-3xl border-2 border-dashed border-ink/40 p-10 text-center text-sm text-muted"
        >
          Papanmu masih kosong. Tambahkan petak pertamamu.
        </div>
      {/if}

      <ul class="flex flex-col gap-3">
        {#each data.tiles as tile, i (tile.id)}
          <li
            class="neo-shadow rounded-2xl border-2 border-ink bg-paper transition-opacity {tile.isActive
              ? ''
              : 'opacity-65'}"
          >
            <div class="flex items-center justify-between gap-3 p-4">
              <div class="flex min-w-0 items-center gap-3">
                <!-- Geser urutan -->
                <div class="flex flex-col text-muted">
                  {#each ['up', 'down'] as direction (direction)}
                    <form method="POST" action="?/move" use:enhance>
                      <input type="hidden" name="id" value={tile.id} />
                      <input type="hidden" name="direction" value={direction} />
                      <button
                        type="submit"
                        disabled={direction === 'up' ? i === 0 : i === data.tiles.length - 1}
                        aria-label={direction === 'up' ? 'Pindah ke atas' : 'Pindah ke bawah'}
                        class="hover:text-ink disabled:opacity-20"
                      >
                        <Icon
                          name={direction === 'up' ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                          class="text-lg"
                        />
                      </button>
                    </form>
                  {/each}
                </div>

                <span
                  class="h-8 w-8 shrink-0 rounded-lg border-2 border-ink {tileColors[tile.color].card}"
                ></span>

                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="truncate font-display text-base font-bold">{tile.title}</span>
                    <span
                      class="rounded-full border border-ink bg-sun px-2 py-0.5 font-mono text-[10px] font-bold"
                    >
                      {sizeLabels[tile.size]}
                    </span>
                  </div>
                  <span class="block truncate font-mono text-xs text-muted">{tile.url}</span>
                </div>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                <!-- Saklar tampil/sembunyi -->
                <form method="POST" action="?/toggle" use:enhance>
                  <input type="hidden" name="id" value={tile.id} />
                  <input type="hidden" name="active" value={String(!tile.isActive)} />
                  <button
                    type="submit"
                    role="switch"
                    aria-checked={tile.isActive}
                    aria-label={tile.isActive ? 'Sembunyikan petak' : 'Tampilkan petak'}
                    class="neo-shadow-sm flex h-7 w-12 items-center rounded-full border-2 border-ink p-1 transition-colors {tile.isActive
                      ? 'justify-end bg-pine'
                      : 'justify-start bg-sand'}"
                  >
                    <span class="h-4 w-4 rounded-full border border-ink bg-white"></span>
                  </button>
                </form>

                <button
                  type="button"
                  onclick={() => (editingId = editingId === tile.id ? null : tile.id)}
                  aria-expanded={editingId === tile.id}
                  aria-label="Ubah petak"
                  class="{iconButton} hover:bg-sun"
                >
                  <Icon name="edit" class="text-base" />
                </button>

                <form
                  method="POST"
                  action="?/delete"
                  use:enhance={({ cancel }) => {
                    if (!confirm(`Hapus petak "${tile.title}"?`)) cancel();
                  }}
                >
                  <input type="hidden" name="id" value={tile.id} />
                  <button
                    type="submit"
                    aria-label="Hapus petak"
                    class="{iconButton} text-crimson hover:bg-blush"
                  >
                    <Icon name="delete" class="text-base" />
                  </button>
                </form>
              </div>
            </div>

            {#if editingId === tile.id}
              <form
                method="POST"
                action="?/update"
                class="border-t-2 border-ink/10 p-4"
                use:enhance={() =>
                  async ({ result, update }) => {
                    await update({ reset: false });
                    if (result.type === 'success') editingId = null;
                  }}
              >
                <input type="hidden" name="id" value={tile.id} />
                <TileForm uid="edit-{tile.id}" values={editValues(tile)} errors={editErrors(tile)} />
                <div class="mt-5 flex gap-2">
                  <button type="submit" class={primaryButton}>Simpan perubahan</button>
                  <button
                    type="button"
                    onclick={() => (editingId = null)}
                    class="rounded-full border-2 border-ink bg-sand px-5 py-2.5 font-display text-sm font-bold hover:bg-washi"
                  >
                    Batal
                  </button>
                </div>
              </form>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  </div>

  <!-- Live preview -->
  <aside class="block">
    <div class="sticky top-6 flex flex-col items-center gap-3">
      <BoardPreview profile={data.profile} tiles={data.tiles} />
      <p class="text-center font-mono text-xs text-muted">
        Preview will change after each change.
      </p>
    </div>
  </aside>
</main>
