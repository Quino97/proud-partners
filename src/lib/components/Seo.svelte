<script lang="ts">
	import { siteContent } from '$lib/stores/site-content';
	import { plainText } from '$lib/utils/rich-text';

	const site = $derived($siteContent.site);
	const media = $derived($siteContent.media);

	let {
		title,
		description = site.description,
		image
	}: { title?: string; description?: string; image?: string } = $props();

	const pageTitle = $derived(title ? `${plainText(title)} — ${site.name}` : `${site.name} — Partnership in action`);
	const socialImage = $derived(image || media.homeQuote);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={plainText(description)} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={plainText(description)} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={socialImage} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
