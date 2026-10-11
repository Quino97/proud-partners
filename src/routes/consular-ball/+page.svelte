<script lang="ts">
	import { page } from '$app/state';
	import { reveal } from '$lib/actions/reveal';
	import ImageBand from '$lib/components/ImageBand.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const content = $derived(page.data.content.consularBall);
	let selectedYear = $state('2022');
	const selected = $derived(
		content.years.find((entry) => entry.year === selectedYear) || content.years.at(-1)
	);
</script>

<Seo title="Consular Ball" description={content.seoDescription} image={content.banner} />

<article>
	<header class="ball-hero">
		<ImageBand src={content.banner} alt="An elegant Consular Ball table setting" />
		<div class="container ball-intro" use:reveal>
			<p class="eyebrow">{content.eyebrow}</p>
			<h1>{content.title}</h1>
			<p>{content.intro}</p>
		</div>
	</header>

	<section class="section origin">
		<div class="container origin-grid">
			<div use:reveal>
				<p class="eyebrow">The beginning</p>
				<h2>{content.originTitle}</h2>
			</div>
			<div class="origin-copy" use:reveal={{ delay: 90 }}>
				{#each content.origin as paragraph}<p>{paragraph}</p>{/each}
			</div>
		</div>
	</section>

	<section class="impact" aria-label="Consular Ball fundraising milestones">
		<div class="container impact-grid">
			{#each content.stats as stat}
				<div><strong>{stat.value}</strong><span>{stat.label}</span></div>
			{/each}
		</div>
	</section>

	<section class="section years-section">
		<div class="container">
			<div class="years-heading" use:reveal>
				<div><p class="eyebrow">Through the years</p><h2>{content.yearsTitle}</h2></div>
				<p>{content.yearsCopy}</p>
			</div>

			<div class="year-picker" aria-label="Choose a Consular Ball year">
				{#each content.years as entry}
					<button
						type="button"
						class:active={selected?.year === entry.year}
						aria-pressed={selected?.year === entry.year}
						onclick={() => (selectedYear = entry.year)}
					>{entry.year}</button>
				{/each}
			</div>

			{#if selected}
				<div class="year-story" aria-live="polite">
					<div class="year-image">
						<img src={selected.image} alt={selected.imageAlt} />
						<span>{selected.year}</span>
					</div>
					<div class="year-copy">
						<p class="amount">{selected.amount}</p>
						<h3>{selected.title}</h3>
						<p>{selected.summary}</p>
						<ul>{#each selected.highlights as highlight}<li>{highlight}</li>{/each}</ul>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<section class="section auction">
		<div class="container auction-grid">
			<div use:reveal><p class="eyebrow">The auction</p><h2>{content.auctionTitle}</h2></div>
			<div use:reveal={{ delay: 90 }}>
				<p>{content.auctionCopy}</p>
				<a class="button secondary" href={content.externalLink.href} target="_blank" rel="noreferrer">{content.externalLink.label} ↗</a>
			</div>
		</div>
	</section>

	<blockquote class="closing-quote"><p>“{content.closingQuote}”</p></blockquote>
	<ImageBand src={content.footerBanner} alt="Consular Ball flags and table setting" />
</article>

<style>
	.ball-hero { padding-top: 5.4rem; background: var(--navy); color: white; }
	.ball-hero :global(.band) { min-height: clamp(18rem, 40vw, 34rem); }
	.ball-intro { padding-top: clamp(3rem,7vw,6rem); padding-bottom: clamp(4rem,8vw,7rem); }
	.ball-intro .eyebrow { color: var(--sky-light); }
	h1 { max-width: 10ch; margin: .65rem 0 1.2rem; font-size: var(--step-5); line-height: 1.025; letter-spacing: -.055em; }
	.ball-intro > p:last-child { max-width: 48rem; margin: 0; color: rgba(255,255,255,.72); font-size: var(--step-1); }
	.origin { background: white; }.origin-grid { display: grid; grid-template-columns: minmax(18rem,.75fr) minmax(0,1.25fr); gap: clamp(3rem,8vw,8rem); }
	h2 { margin: .65rem 0 0; font-size: var(--step-4); line-height: 1.03; letter-spacing: -.04em; }
	.origin-copy p { margin: 0 0 1.4rem; color: var(--ink-soft); font-size: var(--step-1); }
	.impact { padding: 2.8rem 0; background: var(--blue-pale); }.impact-grid { display: grid; grid-template-columns: repeat(3,1fr); }.impact-grid div { display: grid; gap: .35rem; padding: .5rem clamp(1rem,4vw,4rem); border-right: 1px solid var(--line); }.impact-grid div:last-child { border: 0; }.impact-grid strong { font-size: var(--step-3); }.impact-grid span { color: var(--ink-soft); font-size: .7rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
	.years-section { background: var(--cream); }.years-heading { display: grid; grid-template-columns: 1fr minmax(18rem,.65fr); gap: 3rem; align-items: end; }.years-heading > p { margin: 0; color: var(--ink-soft); }
	.year-picker { display: flex; gap: .5rem; margin: 3rem 0 2rem; padding-bottom: .5rem; overflow-x: auto; scrollbar-width: thin; }.year-picker button { flex: 0 0 auto; padding: .75rem 1.15rem; border: 1px solid var(--line); border-radius: 999px; background: white; color: var(--navy); font: inherit; font-size: .76rem; font-weight: 800; cursor: pointer; }.year-picker button:hover,.year-picker button.active { background: var(--navy); border-color: var(--navy); color: white; }
	.year-story { display: grid; grid-template-columns: minmax(12rem,.55fr) minmax(0,1.45fr); gap: clamp(2rem,7vw,6rem); align-items: center; min-height: 31rem; padding: clamp(1.2rem,3vw,2rem); background: white; border: 1px solid var(--line); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
	.year-image { position: relative; justify-self: center; width: min(100%,20rem); }.year-image img { display: block; width: 100%; aspect-ratio: 204/287; object-fit: cover; border-radius: var(--radius-md); image-rendering: auto; }.year-image span { position: absolute; right: -.8rem; bottom: 1rem; padding: .65rem .85rem; border-radius: 999px; background: var(--sky); color: white; font-size: .74rem; font-weight: 800; }
	.amount { margin: 0; color: var(--sky); font-size: .72rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }.year-copy h3 { margin: .7rem 0 1rem; font-size: var(--step-3); }.year-copy > p:not(.amount) { max-width: 42rem; color: var(--ink-soft); font-size: var(--step-1); }.year-copy ul { display: grid; gap: .7rem; margin: 1.6rem 0 0; padding: 0; list-style: none; }.year-copy li { padding: .8rem 0; border-top: 1px solid var(--line); font-weight: 700; }.year-copy li::before { content: '↗'; margin-right: .7rem; color: var(--sky); }
	.auction { background: white; }.auction-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(3rem,8vw,8rem); align-items: start; }.auction-grid > div:last-child > p { margin: 0 0 2rem; color: var(--ink-soft); font-size: var(--step-1); }
	.closing-quote { display: grid; place-items: center; min-height: 28rem; margin: 0; padding: 5rem 1.5rem; background: var(--navy); color: white; text-align: center; }.closing-quote p { max-width: 52rem; margin: 0; font-family: Georgia,serif; font-size: clamp(2rem,4vw,4rem); line-height: 1.18; font-style: italic; }
	@media (max-width:760px) { .origin-grid,.years-heading,.year-story,.auction-grid { grid-template-columns: 1fr; }.impact-grid { grid-template-columns: 1fr; }.impact-grid div { border-right: 0; border-bottom: 1px solid var(--line); text-align: center; }.year-story { min-height: auto; }.year-image { width: min(72%,16rem); } }
</style>

