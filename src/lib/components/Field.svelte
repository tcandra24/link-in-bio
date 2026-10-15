<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import Icon from './Icon.svelte';

  interface Props {
    name: string;
    id?: string;
    label: string;
    type?: 'text' | 'email' | 'password';
    value?: string;
    error?: string;
    hint?: string;
    placeholder?: string;
    autocomplete?: HTMLInputAttributes['autocomplete'];
    prefix?: string;
  }

  let {
    name,
    id = name,
    label,
    type = 'text',
    value = '',
    error,
    hint,
    placeholder,
    autocomplete,
    prefix
  }: Props = $props();

  let show = $state(false);
  let inputType = $derived(type === 'password' && show ? 'text' : type);
</script>

<div class="flex flex-col gap-1.5">
  <label for={id} class="font-mono text-xs font-bold tracking-wider uppercase">{label}</label>

  <div
    class="neo-shadow-sm flex items-center overflow-hidden rounded-xl border-2 bg-white focus-within:ring-2 focus-within:ring-ink {error
      ? 'border-crimson'
      : 'border-ink'}"
  >
    {#if prefix}
      <span class="border-r-2 border-ink bg-sand px-3 py-3 font-mono text-xs font-bold select-none">
        {prefix}
      </span>
    {/if}

    <input
      {id}
      {name}
      type={inputType}
      {value}
      {placeholder}
      {autocomplete}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      class="w-full bg-transparent px-3.5 py-3 text-sm placeholder:text-ink/40 focus:outline-none"
    />

    {#if type === 'password'}
      <button
        type="button"
        onclick={() => (show = !show)}
        aria-label={show ? 'Hide password' : 'Show password'}
        class="px-3 hover:text-rust"
      >
        <Icon name={show ? 'visibility_off' : 'visibility'} class="text-xl" />
      </button>
    {/if}
  </div>

  {#if error}
    <p id="{id}-error" class="font-mono text-xs font-bold text-crimson">{error}</p>
  {:else if hint}
    <p class="text-xs text-muted">{hint}</p>
  {/if}
</div>
