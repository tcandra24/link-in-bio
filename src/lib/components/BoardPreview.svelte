<script lang="ts">
  import { themes } from '#lib/tiles.ts';
  import type { Profile, Tile } from '#lib/types.ts';
  import BentoTile from './BentoTile.svelte';

  interface Props {
    profile: Profile;
    tiles: Tile[];
  }

  let { profile, tiles }: Props = $props();

  let look = $derived(themes[profile.theme]);
  let visible = $derived(tiles.filter((tile) => tile.isActive));
</script>

<div class="neo-shadow-lg rounded-[44px] bg-ink p-3.5 w-full">
  <!-- `inert`: pratinjau tidak bisa diklik atau difokus -->
  <div
    inert
    class="flex h-140 flex-col gap-3 overflow-hidden rounded-[34px] border-2 border-ink p-4 {look.page} {look.dots}"
  >
    <div class="mx-auto h-4 w-28 shrink-0 rounded-full bg-ink ring-1 ring-paper/30"></div>

    <div class="flex shrink-0 flex-col items-center gap-1 text-center">
      <div
        class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-(--edge) bg-sun font-display text-xl font-extrabold text-ink"
      >
        {#if profile.avatarUrl}
          <img src={profile.avatarUrl} alt="" class="h-full w-full object-cover" />
        {:else}
          {profile.displayName.charAt(0).toUpperCase()}
        {/if}
      </div>
      <p class="font-display text-sm leading-tight font-bold">{profile.displayName}</p>
      <p class="font-mono text-[10px] opacity-70">@{profile.username}</p>
    </div>

    {#if visible.length > 0}
      <div class="grid auto-rows-[minmax(6.5rem,auto)] grid-cols-2 gap-2">
        {#each visible as tile (tile.id)}
          <BentoTile {tile} radius={Math.min(profile.cornerRadius, 20)} depth={2} compact />
        {/each}
      </div>
    {:else}
      <p class="mt-4 text-center font-mono text-[11px] opacity-70">Belum ada petak yang tampil.</p>
    {/if}
  </div>
</div>
