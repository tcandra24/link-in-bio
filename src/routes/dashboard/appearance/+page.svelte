<script lang="ts">
  import { enhance } from '$app/forms';
  import Alert from '#lib/components/Alert.svelte';
  import BoardPreview from '#lib/components/BoardPreview.svelte';
  import Field from '#lib/components/Field.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import { avatarProblem } from '#lib/schemas.ts';
  import type { Profile, ThemeName } from '#lib/types.ts';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();

  // Draf: nilai awal dari server, boleh diubah bebas. Pratinjau ikut berubah seketika;
  // yang tersimpan ke database baru setelah tombol "Simpan" ditekan.
  let displayName = $derived(data.profile.displayName);
  let bio = $derived(data.profile.bio ?? '');
  let theme = $derived<ThemeName>(data.profile.theme);
  let cornerRadius = $derived(data.profile.cornerRadius);
  let shadowDepth = $derived<2 | 4 | 6>(data.profile.shadowDepth);

  let avatarPreview = $state<string | null>(null);
  let avatarError = $state('');
  let fileInput: HTMLInputElement | undefined = $state();
  let submitting = $state(false);

  let draft = $derived<Profile>({
    ...data.profile,
    displayName: displayName.trim() || data.profile.username,
    bio: bio.trim() || undefined,
    theme,
    cornerRadius,
    shadowDepth,
    avatarUrl: avatarPreview ?? data.profile.avatarUrl
  });

  const themeCards: { id: ThemeName; label: string; page: string; tiles: string[] }[] = [
    { id: 'paper', label: 'Paper', page: 'bg-paper', tiles: ['bg-tomato', 'bg-sun', 'bg-mint'] },
    { id: 'clay', label: 'Clay', page: 'bg-ink', tiles: ['bg-lilac', 'bg-sky', 'bg-sun'] },
    { id: 'candy', label: 'Candy', page: 'bg-candy', tiles: ['bg-lilac', 'bg-sun', 'bg-mint'] }
  ];

  const depthOptions: { value: 2 | 4 | 6; label: string }[] = [
    { value: 2, label: 'Tipis' },
    { value: 4, label: 'Sedang' },
    { value: 6, label: 'Tebal' }
  ];

  function onPickAvatar(event: Event & { currentTarget: HTMLInputElement }) {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    const file = event.currentTarget.files?.[0];

    avatarError = file ? (avatarProblem(file) ?? '') : '';
    avatarPreview = file && !avatarError ? URL.createObjectURL(file) : null;
    if (avatarError) event.currentTarget.value = '';
  }

  let serverAvatarError = $derived(form?.errors?.avatar?.[0]);
</script>

<svelte:head>
  <title>Appearance | Dashboard</title>
</svelte:head>

<main class="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
  <div class="flex min-w-0 flex-col gap-5">
    {#if form?.message}
      <Alert message={form.message} title="Perubahan belum berhasil" />
    {:else if form?.ok}
      <div
        role="status"
        class="neo-shadow-sm flex items-center gap-2 rounded-2xl border-2 border-ink bg-mint p-3 font-display text-sm font-bold"
      >
        <Icon name="check_circle" filled class="text-lg" />
        {form.intent === 'removeAvatar' ? 'Photo removed.' : 'Appearance saved.'}
      </div>
    {/if}

    <form
      method="POST"
      action="?/save"
      enctype="multipart/form-data"
      class="neo-shadow flex flex-col gap-6 rounded-3xl border-2 border-ink bg-paper p-5 sm:p-6"
      use:enhance={() => {
        submitting = true;
        return async ({ result, update }) => {
          await update({ reset: false });
          submitting = false;
          if (result.type === 'success') {
            avatarPreview = null;
            if (fileInput) fileInput.value = '';
          }
        };
      }}
    >
      <!-- Foto profil -->
      <div class="flex items-center gap-4">
        <div
          class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-sun font-display text-3xl font-extrabold"
        >
          {#if draft.avatarUrl}
            <img src={draft.avatarUrl} alt="Foto profil" class="h-full w-full object-cover" />
          {:else}
            {draft.displayName.charAt(0).toUpperCase()}
          {/if}
        </div>

        <div class="flex flex-col gap-1.5">
          <label
            for="avatar"
            class="neo-shadow-sm inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full border-2 border-ink bg-sand px-4 py-2 font-display text-sm font-bold hover:bg-washi"
          >
            <Icon name="photo_camera" class="text-base" />
            {data.profile.avatarUrl || avatarPreview ? 'Change photo' : 'Upload photo'}
          </label>
          <input
            bind:this={fileInput}
            id="avatar"
            name="avatar"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onchange={onPickAvatar}
            class="sr-only"
          />
          <p class="text-xs text-muted">JPG, PNG, atau WebP, max 2 MB.</p>
          {#if avatarError || serverAvatarError}
            <p class="font-mono text-xs font-bold text-crimson">{avatarError || serverAvatarError}</p>
          {/if}
        </div>
      </div>

      <!-- Nama dan bio -->
      <Field
        name="displayName"
        label="Display name"
        placeholder="The name that appears on your board"
        bind:value={displayName}
        error={form?.errors?.displayName?.[0]}
      />

      <div class="flex flex-col gap-1.5">
        <div class="flex items-end justify-between">
          <label for="bio" class="font-mono text-xs font-bold tracking-wider uppercase">Bio</label>
          <span class="font-mono text-xs {bio.length > 160 ? 'font-bold text-crimson' : 'text-muted'}">
            {bio.length}/160
          </span>
        </div>
        <textarea
          id="bio"
          name="bio"
          rows="3"
          bind:value={bio}
          placeholder="Tell us about yourself in one or two sentences"
          class="neo-shadow-sm rounded-xl border-2 bg-white px-3.5 py-3 text-sm focus:ring-2 focus:ring-ink focus:outline-none {form
            ?.errors?.bio
            ? 'border-crimson'
            : 'border-ink'}"
        ></textarea>
        {#if form?.errors?.bio?.[0]}
          <p class="font-mono text-xs font-bold text-crimson">{form.errors.bio[0]}</p>
        {/if}
      </div>

      <!-- Tema -->
      <fieldset class="flex flex-col gap-2">
        <legend class="mb-1 font-mono text-xs font-bold tracking-wider uppercase">Tema</legend>
        <div class="grid grid-cols-3 gap-3">
          {#each themeCards as card (card.id)}
            <label class="cursor-pointer">
              <input
                type="radio"
                name="theme"
                value={card.id}
                bind:group={theme}
                class="peer sr-only"
              />
              <span
                class="neo-shadow-sm block rounded-2xl border-2 border-ink p-2 peer-checked:ring-2 peer-checked:ring-ink peer-checked:ring-offset-2 peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 {card.page}"
              >
                <span class="grid grid-cols-3 gap-1">
                  {#each card.tiles as tile (tile)}
                    <span class="h-6 rounded-md border border-ink {tile}"></span>
                  {/each}
                </span>
                <span
                  class="mt-2 block text-center font-display text-xs font-bold {card.id === 'clay'
                    ? 'text-paper'
                    : 'text-ink'}"
                >
                  {card.label}
                </span>
              </span>
            </label>
          {/each}
        </div>
        {#if form?.errors?.theme?.[0]}
          <p class="font-mono text-xs font-bold text-crimson">{form.errors.theme[0]}</p>
        {/if}
      </fieldset>

      <!-- Bentuk petak -->
      <div class="grid gap-5 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label for="cornerRadius" class="flex justify-between font-mono text-xs font-bold tracking-wider uppercase">
            Plot corner
            <span class="text-muted normal-case">{cornerRadius}px</span>
          </label>
          <input
            id="cornerRadius"
            name="cornerRadius"
            type="range"
            min="8"
            max="32"
            step="2"
            bind:value={cornerRadius}
            class="accent-tomato"
          />
        </div>

        <fieldset class="flex flex-col gap-2">
          <legend class="mb-1 font-mono text-xs font-bold tracking-wider uppercase">Shadow</legend>
          <div class="grid grid-cols-3 gap-2">
            {#each depthOptions as option (option.value)}
              <label
                class="neo-shadow-sm cursor-pointer rounded-xl border-2 border-ink bg-white px-2 py-2 text-center font-display text-sm font-bold has-checked:bg-tomato has-focus-visible:ring-2 has-focus-visible:ring-ink"
              >
                <input
                  type="radio"
                  name="shadowDepth"
                  value={option.value}
                  bind:group={shadowDepth}
                  class="sr-only"
                />
                {option.label}
              </label>
            {/each}
          </div>
        </fieldset>
      </div>

      <button
        type="submit"
        disabled={submitting}
        class="neo-shadow-sm flex items-center justify-center gap-1.5 self-start rounded-full border-2 border-ink bg-tomato px-6 py-3 font-display text-sm font-bold transition-all hover:neo-shadow active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60"
      >
        {submitting ? 'Saving…' : 'Save changes'}
      </button>
    </form>

    {#if data.profile.avatarUrl}
      <form method="POST" action="?/removeAvatar" use:enhance>
        <button
          type="submit"
          class="flex items-center gap-1.5 font-mono text-xs font-bold text-crimson hover:underline"
        >
          <Icon name="delete" class="text-sm" />
          Remove profile photo
        </button>
      </form>
    {/if}
  </div>

  <!-- Pratinjau langsung (mengikuti draf, bukan data tersimpan) -->
  <aside class="hidden lg:block">
    <div class="sticky top-6 flex flex-col items-center gap-3">
      <BoardPreview profile={draft} tiles={data.tiles} />
      <p class="text-center font-mono text-xs text-muted">
        Preview changes instantly. Press Save to make them public.
      </p>
    </div>
  </aside>
</main>
