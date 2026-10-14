<script lang="ts">
	import '../app.css';
	  import { SITE } from '#lib/config.ts';

	let { children } = $props();
</script>

<svelte:head>
  <title>{SITE.title}</title>
  <meta name="description" content={SITE.description} />
  <meta property="og:title" content={SITE.title} />
  <meta property="og:description" content={SITE.description} />
  <meta property="og:type" content="website" />
</svelte:head>

{@render children()}
