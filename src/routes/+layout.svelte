<script lang="ts">
	import { browser } from '$app/environment';
	import '../styles.css';
	import { page } from '$app/state';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { refreshPublishedContent, siteContent } from '$lib/stores/site-content';

	let { children, data } = $props();
	const isAdmin = $derived(page.url.pathname.startsWith('/admin'));

	$effect(() => {
		if (!browser) return;
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
