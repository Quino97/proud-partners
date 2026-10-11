<script lang="ts">
	import { page } from '$app/state';
	import { siteContent } from '$lib/stores/site-content';
	import { reveal } from '$lib/actions/reveal';
	import Seo from '$lib/components/Seo.svelte';
	import { sitePath } from '$lib/utils/site-path';

	const content = $derived($siteContent.partnersPage);
	const categories = $derived(['All', ...new Set(content.items.map((item) => item.category))]);
	let activeCategory = $state('All');
	const visiblePartners = $derived(
		activeCategory === 'All'
			? content.items
			: content.items.filter((item) => item.category === activeCategory)
	);
</script>

<Seo title="Partners" description={content.seoDescription} image={content.heroImage} />

<header class="partners-hero">
	<div class="container hero-copy" use:reveal>
		<p class="eyebrow">{content.eyebrow}</p>
		<h1>{content.title}</h1>
		<p>{content.intro}</p>
	</div>
	<div class="container hero-visual" aria-hidden="true">
		<img src={content.heroImage} alt="" />
		<div></div>
	</div>
</header>

<section class="section partner-list">
	<div class="container">
		<div class="list-heading" use:reveal>
			<div><p class="eyebrow">Our network</p><h2>{content.sectionTitle}</h2></div>
			<p>{content.sectionCopy}</p>
		</div>

		<div class="filters" aria-label="Filter partners by type">
			{#each categories as category}
				<button type="button" class:active={activeCategory === category} aria-pressed={activeCategory === category} onclick={() => (activeCategory = category)}>{category}</button>
			{/each}
		</div>

		<div class="partner-grid">
			{#each visiblePartners as partner, index}
				<article use:reveal={{ delay: (index % 3) * 60 }}>
					<div class="partner-image"><img src={partner.image} alt={partner.imageAlt} loading="lazy" /><span>{partner.category}</span></div>
					<div class="partner-copy">
						<h3>{partner.name}</h3>
						<p>{partner.description}</p>
						{#if partner.href && partner.linkLabel}<a href={partner.href} target="_blank" rel="noreferrer">{partner.linkLabel} ↗</a>{/if}
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="closing">
	<div class="container" use:reveal><p class="eyebrow">Our approach</p><h2>{content.closingTitle}</h2><p>{content.closingCopy}</p><a class="button" href={sitePath('/projects#support')}>Support a project →</a></div>
</section>

<style>
	.partners-hero { padding: 7.75rem 0 0; overflow: hidden; background: var(--cream); color: var(--navy); }.hero-copy { padding-bottom: clamp(2.5rem,5vw,4rem); }.hero-copy .eyebrow { color: var(--blue); }
	h1 { max-width: 9ch; margin: .65rem 0 1.1rem; font-size: var(--step-5); line-height: 1.025; letter-spacing: -.055em; }.hero-copy > p:last-child { max-width: 44rem; margin: 0; color: var(--ink-soft); font-size: var(--step-1); }.hero-visual { position: relative; max-width: min(100% - 2rem, 82rem); overflow: hidden; border-radius: var(--radius-lg) var(--radius-lg) 0 0; }.hero-visual img,.hero-visual div { display: block; width: 100%; height: min(31rem,42vw); }.hero-visual img { object-fit: cover; object-position: center 42%; }.hero-visual div { position: absolute; inset: 0; background: linear-gradient(115deg,rgba(251,247,238,.38),rgba(232,243,247,.16)); mix-blend-mode: screen; pointer-events: none; }
	.partner-list { background: white; }.list-heading { display: grid; grid-template-columns: 1fr minmax(18rem,.7fr); gap: 3rem; align-items: end; }.list-heading h2,.closing h2 { margin: .65rem 0 0; font-size: var(--step-4); line-height: 1.03; letter-spacing: -.04em; }.list-heading > p { margin: 0; color: var(--ink-soft); }
	.filters { display: flex; flex-wrap: wrap; gap: .5rem; margin: 3rem 0 2rem; }.filters button { padding: .7rem 1rem; border: 1px solid var(--line); border-radius: 999px; background: var(--cream); color: var(--navy); font: inherit; font-size: .72rem; font-weight: 800; cursor: pointer; }.filters button.active,.filters button:hover { background: var(--navy); border-color: var(--navy); color: white; }
	.partner-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 1.2rem; }.partner-grid article { display: grid; grid-template-rows: auto 1fr; border: 1px solid var(--line); border-radius: var(--radius-lg); background: white; overflow: hidden; box-shadow: var(--shadow-sm); }.partner-image { position: relative; aspect-ratio: 4/3; overflow: hidden; background: var(--blue-pale); }.partner-image img { width: 100%; height: 100%; object-fit: cover; }.partner-image span { position: absolute; left: 1rem; bottom: 1rem; padding: .55rem .75rem; border-radius: 999px; background: rgba(255,255,255,.92); color: var(--blue); font-family: var(--font-rounded); font-size: .64rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }.partner-copy { display: flex; flex-direction: column; padding: 1.5rem; }.partner-copy h3 { margin: 0 0 .75rem; font-size: var(--step-2); }.partner-copy p { margin: 0; color: var(--ink-soft); }.partner-copy a { align-self: flex-start; margin-top: auto; padding-top: 1.5rem; color: var(--blue); font-size: .72rem; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; }
	.closing { padding: clamp(5rem,10vw,9rem) 0; background: var(--cream); text-align: center; }.closing .container { display: grid; justify-items: center; }.closing h2 { max-width: 12ch; }.closing .container > p:not(.eyebrow) { max-width: 46rem; margin: 1.3rem 0 2rem; color: var(--ink-soft); font-size: var(--step-1); }
	@media (max-width:900px) { .partner-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
	@media (max-width:680px) { .list-heading,.partner-grid { grid-template-columns: 1fr; }.partners-hero { padding-top: 7rem; }.hero-visual { max-width: calc(100% - 1.5rem); }.hero-visual img,.hero-visual div { height: 17rem; } }
</style>
