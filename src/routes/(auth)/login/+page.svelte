<script lang="ts">
  import { enhance } from '$app/forms';
  import Alert from '#lib/components/Alert.svelte';
  import Field from '#lib/components/Field.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import { SITE } from '#lib/config.ts';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();
  let submitting = $state(false);
</script>

<svelte:head>
  <title>Sign In | {SITE.name}</title>
</svelte:head>

<h1 class="sr-only">Sign In to {SITE.name}</h1>

{#if form?.message}
  <div class="mb-5"><Alert message={form.message} /></div>
{/if}

<form
  method="POST"
  class="flex flex-col gap-4"
  use:enhance={() => {
    submitting = true;
    return async ({ update }) => {
      await update();
      submitting = false;
    };
  }}
>
  <Field
    name="email"
    type="email"
    label="Email address"
    placeholder="name@domain.com"
    autocomplete="email"
    value={form?.values?.email ?? ''}
    error={form?.errors?.email?.[0]}
  />
  <Field
    name="password"
    type="password"
    label="Password"
    autocomplete="current-password"
    error={form?.errors?.password?.[0]}
  />

  <button
    type="submit"
    disabled={submitting}
    class="neo-shadow mt-2 flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-tomato px-6 py-3.5 font-display font-bold transition-all hover:neo-shadow-lg active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60"
  >
    {submitting ? 'Memproses…' : `Masuk ke ${SITE.name}`}
    <Icon name="arrow_forward" class="text-xl" />
  </button>
</form>

<p class="mt-6 border-t-2 border-ink/10 pt-4 text-center text-sm text-muted">
  Don't have an account with {SITE.name}?
  <a href="/register" class="ml-1 font-bold text-rust hover:underline">Sign Up</a>
</p>
