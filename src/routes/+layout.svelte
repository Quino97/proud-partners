<script lang="ts">
	import '../styles.css';
	import { page } from '$app/state';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
	const isAdmin = $derived(page.url.pathname.startsWith('/admin'));
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
