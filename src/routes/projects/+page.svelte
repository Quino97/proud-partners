<script lang="ts">
	import { siteContent } from '$lib/stores/site-content';
	import EditorialPage from '$lib/components/EditorialPage.svelte';
	const content = $derived($siteContent.pages.find(p => p.id === 'projects')!);
</script>
<EditorialPage {content} />
