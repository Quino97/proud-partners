<script lang="ts">
	let {
		eyebrow,
		title,
		copy,
		align = 'left'
	}: { eyebrow?: string; title: string; copy?: string; align?: 'left' | 'center' } = $props();
</script>

<div class:center={align === 'center'} class="section-heading">
	{#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
	<h2>{title}</h2>
	{#if copy}<p class="copy">{copy}</p>{/if}
</div>

<style>
	.section-heading {
		max-width: 47rem;
	}

	.section-heading.center {
		margin-inline: auto;
		text-align: center;
	}

	h2 {
		margin: 0.55rem 0 0;
		font-size: var(--step-4);
		line-height: 1.02;
		letter-spacing: -0.035em;
		text-wrap: balance;
	}

	.copy {
		max-width: 42rem;
		margin: 1.25rem 0 0;
		font-size: var(--step-1);
		color: var(--ink-soft);
	}

	.center .copy {
		margin-inline: auto;
	}
</style>
