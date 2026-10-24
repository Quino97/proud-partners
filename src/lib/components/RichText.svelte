<script lang="ts">
	import { parseInline } from '$lib/utils/rich-text';
	let { text }: { text: string } = $props();
</script>
{#each parseInline(text) as part}{#if part.bold && part.italic}<strong><em>{part.text}</em></strong>{:else if part.bold}<strong>{part.text}</strong>{:else if part.italic}<em>{part.text}</em>{:else}{part.text}{/if}{/each}
