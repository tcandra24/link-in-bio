<script lang="ts">
  import Icon from './Icon.svelte';

  interface Props {
    message: string;
    title?: string;
  }

  let { message, title = 'Double-check your data' }: Props = $props();
</script>

<div
  role="alert"
  class="neo-shadow-sm flex items-start gap-2.5 rounded-2xl border-2 border-ink bg-blush p-3.5 text-crimson"
>
  <Icon name="warning" class="mt-0.5 shrink-0 text-xl" />
  <div>
    <p class="font-display text-sm leading-tight font-bold">{title}</p>
    <p class="mt-0.5 text-xs">{message}</p>
  </div>
</div>
