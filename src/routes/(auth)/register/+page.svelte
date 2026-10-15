<script lang="ts">
  import { enhance } from '$app/forms';
  import Alert from '#lib/components/Alert.svelte';
  import Field from '#lib/components/Field.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import { SITE } from '#lib/config.ts';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
  let submitting = $state(false);
</script>

<svelte:head>
  <title>Sign Up | {SITE.name}</title>
</svelte:head>

<h1 class="sr-only">Create account {SITE.name}</h1>

{#if form?.message}
  <div class="mb-5"><Alert message={form.message} title="Registration failed" /></div>
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
    name="username"
    label="Username {SITE.name}"
    prefix="{SITE.domain}/"
    placeholder="your name"
    autocomplete="username"
    hint="Lowercase letters, numbers, and underscores (3-20 characters)."
    value={form?.values?.username ?? data.username}
    error={form?.errors?.username?.[0]}
  />
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
    placeholder="At least 8 characters"
    autocomplete="new-password"
    error={form?.errors?.password?.[0]}
  />

  <button
    type="submit"
    disabled={submitting}
    class="neo-shadow mt-2 flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-tomato px-6 py-3.5 font-display font-bold transition-all hover:neo-shadow-lg active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60"
  >
    {submitting ? 'Creating…' : `Create my ${SITE.name} account`}
    <Icon name="auto_awesome" class="text-xl" />
  </button>
</form>

<p class="mt-6 border-t-2 border-ink/10 pt-4 text-center text-sm text-muted">
  Already have an account?
  <a href="/login" class="ml-1 font-bold text-rust hover:underline">Sign in</a>
</p>
