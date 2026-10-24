<script lang="ts">
	import { page } from '$app/state';
	import { siteContent } from '$lib/stores/site-content';
	import { sitePath } from '$lib/utils/site-path';
	import EditorialPage from '$lib/components/EditorialPage.svelte';
	const content = $derived($siteContent.pages.find(p => p.id === page.params.slug && !p.hidden));
</script>
{#if content}<EditorialPage {content} />{:else}<section class="container section" style="padding-top:10rem"><h1>Page not available</h1><a href={sitePath('/projects')}>← Projects</a></section>{/if}
