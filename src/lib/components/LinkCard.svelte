<script lang="ts">
	interface Props {
		title: string;
		url: string;
	}

	let { title, url }: Props = $props();
</script>

<a
	href={url}
	target="_blank"
	rel="noopener noreferrer"
	class="block w-full rounded-xl border border-neutral-200 bg-white px-5 py-3 text-center font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
>
	{title}
</a>
