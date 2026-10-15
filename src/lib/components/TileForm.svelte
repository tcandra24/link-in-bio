<script lang="ts">
  import type { FieldErrors } from '#lib/schemas.ts';
  import {
    TILE_COLORS,
    TILE_ICONS,
    TILE_SIZES,
    colorLabels,
    iconLabels,
    sizeLabels,
    tileColors
  } from '#lib/tiles.ts';
  import type { TileValues } from '#lib/types.ts';
  import Field from './Field.svelte';

  interface Props {
    uid: string; // supaya id input unik kalau ada beberapa form di satu halaman
    values: TileValues;
    errors: FieldErrors;
  }

  let { uid, values, errors }: Props = $props();

  const legend = 'font-mono text-xs font-bold tracking-wider uppercase';
</script>

<div class="flex flex-col gap-4">
  <Field
    id="{uid}-title"
    name="title"
    label="Judul"
    placeholder="mis. Portofolio 2026"
    value={values.title}
    error={errors.title?.[0]}
  />
  <Field
    id="{uid}-subtitle"
    name="subtitle"
    label="Keterangan (opsional)"
    placeholder="Satu kalimat singkat"
    value={values.subtitle}
    error={errors.subtitle?.[0]}
  />
  <Field
    id="{uid}-url"
    name="url"
    label="URL tujuan"
    placeholder="contoh.com/halamanku"
    autocomplete="url"
    value={values.url}
    error={errors.url?.[0]}
  />

  <fieldset class="flex flex-col gap-1.5">
    <legend class="{legend} mb-1.5">Ukuran</legend>
    <div class="grid grid-cols-3 gap-2">
      {#each TILE_SIZES as size (size)}
        <label
          class="neo-shadow-sm cursor-pointer rounded-xl border-2 border-ink bg-white px-2 py-2 text-center font-display text-sm font-bold has-checked:bg-tomato has-focus-visible:ring-2 has-focus-visible:ring-ink"
        >
          <input
            type="radio"
            name="size"
            value={size}
            checked={values.size === size}
            class="sr-only"
          />
          {sizeLabels[size]}
        </label>
      {/each}
    </div>
    {#if errors.size?.[0]}
      <p class="font-mono text-xs font-bold text-crimson">{errors.size[0]}</p>
    {/if}
  </fieldset>

  <fieldset class="flex flex-col gap-1.5">
    <legend class="{legend} mb-1.5">Warna</legend>
    <div class="flex flex-wrap gap-3">
      {#each TILE_COLORS as color (color)}
        <label class="cursor-pointer">
          <input
            type="radio"
            name="color"
            value={color}
            checked={values.color === color}
            aria-label={colorLabels[color]}
            class="peer sr-only"
          />
          <span
            class="block h-9 w-9 rounded-full border-2 border-ink {tileColors[color]
              .card} peer-checked:ring-2 peer-checked:ring-ink peer-checked:ring-offset-2 peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2"
          ></span>
        </label>
      {/each}
    </div>
    {#if errors.color?.[0]}
      <p class="font-mono text-xs font-bold text-crimson">{errors.color[0]}</p>
    {/if}
  </fieldset>

  <div class="grid grid-cols-2 gap-3">
    <div class="flex flex-col gap-1.5">
      <label for="{uid}-icon" class={legend}>Ikon</label>
      <select
        id="{uid}-icon"
        name="icon"
        class="neo-shadow-sm rounded-xl border-2 border-ink bg-white px-3 py-3 text-sm focus:ring-2 focus:ring-ink focus:outline-none"
      >
        {#each TILE_ICONS as icon (icon)}
          <option value={icon} selected={values.icon === icon}>{iconLabels[icon]}</option>
        {/each}
      </select>
    </div>

    <Field
      id="{uid}-badge"
      name="badge"
      label="Label (opsional)"
      placeholder="Toko, Trek, Status"
      value={values.badge}
      error={errors.badge?.[0]}
    />
  </div>
</div>
