<script lang="ts">
  import Icon from '#lib/components/Icon.svelte';
  import { sizeLabels, tileColors } from '#lib/tiles.ts';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  let stats = $derived(data.stats);

  const number = new Intl.NumberFormat('id-ID');
</script>

<svelte:head>
  <title>Statistic | Dashboard</title>
</svelte:head>

<main class="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-8">
  <!-- Ringkasan -->
  <section class="grid gap-4 sm:grid-cols-3" aria-label="Ringkasan klik">
    <div class="neo-shadow rounded-3xl border-2 border-ink bg-tomato p-5">
      <p class="flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
        <Icon name="ads_click" class="text-base" /> Total clicks
      </p>
      <p class="mt-2 font-display text-4xl font-extrabold">{number.format(stats.totalAll)}</p>
    </div>

    <div class="neo-shadow rounded-3xl border-2 border-ink bg-sun p-5">
      <p class="flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
        <Icon name="trending_up" class="text-base" /> Last 7 days
      </p>
      <p class="mt-2 font-display text-4xl font-extrabold">{number.format(stats.last7)}</p>
    </div>

    <div class="neo-shadow rounded-3xl border-2 border-ink bg-mint p-5">
      <p class="flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
        <Icon name="workspace_premium" class="text-base" /> Top plot
      </p>
      {#if stats.top}
        <p class="mt-2 truncate font-display text-2xl font-extrabold">{stats.top.tile.title}</p>
        <p class="font-mono text-xs">{number.format(stats.top.total)} clicks</p>
      {:else}
        <p class="mt-2 font-display text-2xl font-extrabold">-</p>
      {/if}
    </div>
  </section>

  <!-- Grafik harian -->
  <section class="neo-shadow rounded-3xl border-2 border-ink bg-paper p-5 sm:p-6">
    <h2 class="font-display text-lg font-bold">Click per day</h2>

    <div class="mt-5 flex h-48 items-end gap-2 sm:gap-4" role="img" aria-label="Grafik klik 7 hari terakhir">
      {#each stats.days as day, i (day.day)}
        <div class="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
          <span class="font-mono text-xs font-bold">{day.clicks}</span>
          <div
            class="w-full rounded-t-xl border-2 border-ink {i === stats.days.length - 1
              ? 'bg-tomato'
              : 'bg-sun'}"
            style="height: {Math.max(4, (day.clicks / stats.peak) * 100)}%"
          ></div>
          <span class="font-mono text-[11px] text-muted capitalize">{day.label}</span>
        </div>
      {/each}
    </div>

    {#if stats.totalAll === 0}
      <p class="mt-4 rounded-2xl border-2 border-dashed border-ink/30 p-3 text-center text-sm text-muted">
        No clicks yet. Share your board's URL in your bio, then come back here.
      </p>
    {/if}
  </section>

  <!-- Peringkat petak -->
  <section class="neo-shadow overflow-hidden rounded-3xl border-2 border-ink bg-paper">
    <h2 class="border-b-2 border-ink p-5 font-display text-lg font-bold">Plot rank</h2>

    {#if stats.rows.length === 0}
      <p class="p-5 text-sm text-muted">No plot yet.</p>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full min-w-136 text-left text-sm">
          <thead class="bg-sand font-mono text-xs uppercase">
            <tr>
              <th class="px-5 py-3">Plot</th>
              <th class="px-3 py-3 text-right">Clicks</th>
              <th class="px-3 py-3 text-right">Last 7 days</th>
              <th class="px-5 py-3">Share</th>
            </tr>
          </thead>
          <tbody>
            {#each stats.rows as row (row.tile.id)}
              <tr class="border-t border-ink/15 {row.tile.isActive ? '' : 'opacity-60'}">
                <td class="px-5 py-3">
                  <div class="flex items-center gap-2.5">
                    <span
                      class="h-5 w-5 shrink-0 rounded-md border-2 border-ink {tileColors[row.tile.color].card}"
                    ></span>
                    <div class="min-w-0">
                      <p class="truncate font-display font-bold">{row.tile.title}</p>
                      <p class="font-mono text-[11px] text-muted">
                        {sizeLabels[row.tile.size]}{row.tile.isActive ? '' : ' · hidden'}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-3 text-right font-mono font-bold">{number.format(row.total)}</td>
                <td class="px-3 py-3 text-right font-mono">{number.format(row.last7)}</td>
                <td class="px-5 py-3">
                  <div class="flex items-center gap-2">
                    <div class="h-3 w-24 overflow-hidden rounded-full border-2 border-ink bg-sand">
                      <div class="h-full bg-tomato" style="width: {row.share}%"></div>
                    </div>
                    <span class="font-mono text-xs">{row.share}%</span>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>

  <p class="text-xs text-muted">
    Clicks are counted each time a link is opened via your board. Repeated clicks from the same person and bot visits are also counted.
  </p>
</main>
