<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { page } from '$app/state';
	import { siteContent } from '$lib/stores/site-content';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { sitePath } from '$lib/utils/site-path';

	const site = $derived($siteContent.site);
	const media = $derived($siteContent.media);
	const copy = $derived($siteContent.pages.about);
</script>

<Seo
	title="About"
	description={copy.seoDescription}
	image={media.aboutPhoto}
/>

<section class="page-hero">
	<div class="container" use:reveal>
		<p class="eyebrow">{site.about.eyebrow}</p>
		<h1>{site.about.title}</h1>
	</div>
</section>

<section class="founders">
	<div class="container">
		<figure use:reveal>
			<img src={media.aboutPhoto} alt="Isabel Verwey and Dr Prieur du Plessis" />
			<figcaption>{site.about.photoCaption}</figcaption>
		</figure>
		<p class="lead" use:reveal={{ delay: 100 }}>{site.about.lead}</p>
	</div>
</section>

<section class="section origin">
	<div class="container origin-grid">
		<div use:reveal>
			<SectionHeading eyebrow={copy.originEyebrow} title={site.about.originTitle} />
		</div>
		<div class="origin-copy" use:reveal={{ delay: 100 }}>
			{#each site.about.origin as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
	</div>
</section>

<section class="section principles">
	<div class="container">
		<SectionHeading
			eyebrow={copy.principlesEyebrow}
			title={copy.principlesTitle}
			align="center"
		/>
		<div class="principle-grid">
			{#each site.about.principles as principle, index}
				<article use:reveal={{ delay: index * 80 }}>
					<span>0{index + 1}</span>
					<h2>{principle.title}</h2>
					<p>{principle.copy}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="method">
	<div class="container method-inner" use:reveal>
		<p class="eyebrow">{copy.methodEyebrow}</p>
		<p class="statement">{copy.methodStatement}</p>
		<a class="button" href={sitePath('/projects')}>{copy.methodAction} <span aria-hidden="true">→</span></a>
	</div>
</section>

<style>
	.page-hero {
		padding: clamp(9rem, 18vw, 13rem) 0 clamp(3rem, 6vw, 5rem);
		background:
			radial-gradient(circle at 80% 10%, rgba(37, 169, 214, 0.2), transparent 26rem),
			var(--cream);
	}

	h1 {
		max-width: 10ch;
		margin: 0.55rem 0 0;
		font-size: var(--step-5);
		line-height: 1.025;
		letter-spacing: -0.055em;
	}

	.founders {
		padding-bottom: clamp(4rem, 8vw, 7rem);
	}

	figure {
		margin: 0;
	}

	figure img {
		display: block;
		width: 100%;
		aspect-ratio: 18 / 5;
		object-fit: cover;
		object-position: center 35%;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
	}

	figcaption {
		padding-top: 0.75rem;
		font-family: var(--font-rounded);
		font-size: 0.74rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.lead {
		max-width: 62rem;
		margin: clamp(2rem, 5vw, 4rem) auto 0;
		font-family: 'Nugo Sans', 'Segoe UI', sans-serif;
		font-size: clamp(1.55rem, 2.6vw, 2.5rem);
		line-height: 1.38;
		font-weight: 600;
		text-align: center;
		color: var(--navy);
	}

	.origin {
		background: white;
	}

	.origin-grid {
		display: grid;
		grid-template-columns: minmax(16rem, 0.7fr) minmax(0, 1.3fr);
		gap: clamp(3rem, 8vw, 8rem);
		align-items: start;
	}

	.origin-copy p {
		margin: 0 0 1.5rem;
		font-size: var(--step-1);
		color: var(--ink-soft);
	}

	.principles {
		background: var(--blue-pale);
	}

	.principle-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.25rem;
		margin-top: 3.5rem;
	}

	article {
		padding: 2rem;
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(255, 255, 255, 0.9);
		border-radius: var(--radius-md);
	}

	article > span {
		display: block;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		color: var(--sky);
	}

	article h2 {
		margin: 2.5rem 0 0.8rem;
		font-size: var(--step-2);
	}

	article p {
		margin: 0;
		color: var(--ink-soft);
	}

	.method {
		padding: clamp(5rem, 10vw, 9rem) 0;
		background: var(--navy);
		color: white;
	}

	.method-inner {
		display: grid;
		justify-items: center;
		text-align: center;
	}

	.method .eyebrow {
		color: var(--sky-light);
	}

	.statement {
		max-width: 52rem;
		margin: 1.25rem 0 2.2rem;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 4rem);
		line-height: 1.17;
		font-style: italic;
		text-wrap: balance;
	}

	.method .button {
		background: white;
		border-color: white;
		color: var(--navy);
	}

	@media (max-width: 760px) {
		figure img {
			aspect-ratio: 4 / 3;
			object-position: 68% 30%;
		}

		.origin-grid,
		.principle-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
