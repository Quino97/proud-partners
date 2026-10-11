<script lang="ts">
	import { page } from '$app/state';

	const site = $derived(page.data.content.site);
	const media = $derived(page.data.content.media);

	let {
		title,
		description = site.description,
		image
	}: { title?: string; description?: string; image?: string } = $props();

	const pageTitle = $derived(title ? `${title} — ${site.name}` : `${site.name} — Partnership in action`);
	const socialImage = $derived(image || media.homeQuote);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={socialImage} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
