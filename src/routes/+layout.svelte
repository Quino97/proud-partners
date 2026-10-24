<script lang="ts">
	import { browser } from '$app/environment';
	import '../styles.css';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { refreshPublishedContent, siteContent } from '$lib/stores/site-content';
	import { normaliseContent } from '$lib/content/site';
	import { addSiteBase } from '$lib/utils/site-path';

	let { children, data } = $props();
	const isAdmin = $derived(page.url.pathname.slice(base.length).startsWith('/admin'));

	$effect(() => {
		if (!browser) return;
		if (page.url.searchParams.has('preview')) {
			try { const draft=localStorage.getItem('pp-preview-v3'); if(draft){siteContent.set(addSiteBase(normaliseContent(JSON.parse(draft))));return;} } catch { /* Fall through to published content. */ }
		}
		siteContent.set(data.content);
		void refreshPublishedContent();
	});
</script>

{#if !isAdmin}<Header />{/if}
<main id="main-content" class:admin-shell={isAdmin}>
	{@render children()}
</main>
{#if !isAdmin}<Footer />{/if}

<style>
	.admin-shell {
		min-height: 100vh;
	}
</style>
