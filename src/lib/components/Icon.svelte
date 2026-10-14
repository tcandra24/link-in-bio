<script lang="ts">
  interface Props {
    name: string;
    filled?: boolean;
    class?: string;
  }

  let { name, filled = false, class: className = '' }: Props = $props();
</script>

<span class="material-symbols-outlined {filled ? 'fill-1' : ''} {className}" aria-hidden="true">
  {name}
</span>
