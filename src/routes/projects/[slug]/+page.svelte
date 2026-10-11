<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import ImageBand from '$lib/components/ImageBand.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
	const nextProject = $derived(data.nextProject);
</script>

<Seo title={project.title} description={project.summary} image={project.image} />

<article>
	<header class="project-hero">
		<ImageBand src={project.banner} alt={`${project.title} project banner`} />
		<div class="container title-block" use:reveal>
			<a class="back-link" href="/projects">← All projects</a>
			<p class="eyebrow">Project {project.number}</p>
			<h1>{project.title}</h1>
			<p class="summary">{project.summary}</p>
		</div>
	</header>

	<section class="section story">
		<div class="container story-grid">
			<div class="story-image" use:reveal>
				<img src={project.image} alt={project.imageAlt} />
				<span>{project.shortTitle}</span>
			</div>
			<div class="body-copy" use:reveal={{ delay: 100 }}>
				<p class="eyebrow">Why it matters</p>
				{#each project.body as paragraph}
					<p>{paragraph}</p>
				{/each}
			</div>
		</div>
	</section>

	<section class="section initiatives">
		<div class="container">
			<div class="initiatives-intro" use:reveal>
				<p class="eyebrow">Within this project</p>
				<h2>People and ideas in action</h2>
			</div>
			<div class="initiative-list">
				{#each project.initiatives as initiative, index}
					<section use:reveal={{ delay: index * 70 }}>
						<span>0{index + 1}</span>
						<div>
							<h3>{initiative.title}</h3>
							<p>{initiative.copy}</p>
							{#if initiative.links}
								<div class="link-row">
									{#each initiative.links as link}
										<a href={link.href} target="_blank" rel="noreferrer">
											{link.label} <b aria-hidden="true">↗</b>
										</a>
									{/each}
								</div>
							{/if}
						</div>
					</section>
				{/each}
			</div>
		</div>
	</section>

	{#if project.gallery?.length}
		<section class="section gallery-section">
			<div class="container">
				<div class="gallery-intro" use:reveal>
					<p class="eyebrow">From the archive</p>
					<h2>{project.galleryTitle}</h2>
					<p>{project.galleryCopy}</p>
				</div>
				<div class="gallery-grid">
					{#each project.gallery as galleryImage, index (galleryImage.id)}
						<figure class:featured={index === 0} use:reveal={{ delay: Math.min(index * 60, 240) }}>
							<img src={galleryImage.image} alt={galleryImage.alt} loading="lazy" />
							{#if galleryImage.caption}<figcaption>{galleryImage.caption}</figcaption>{/if}
						</figure>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<ImageBand src={project.footerBanner} alt={`Decorative ${project.title} footer banner`} />

	<section class="next-project">
		<a href={`/projects/${nextProject.slug}`}>
			<span>Next project · {nextProject.number}</span>
			<strong>{nextProject.title}</strong>
			<b aria-hidden="true">→</b>
		</a>
	</section>
</article>

<style>
	.project-hero {
		padding-top: 5.4rem;
		background: var(--cream);
	}

	.project-hero :global(.band) {
		min-height: clamp(16rem, 36vw, 31rem);
	}

	.title-block {
		padding-top: clamp(3rem, 7vw, 6rem);
		padding-bottom: clamp(4rem, 8vw, 7rem);
	}

	.back-link {
		display: inline-block;
		margin-bottom: 2.4rem;
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	h1 {
		max-width: 11ch;
		margin: 0.6rem 0 1.2rem;
		font-size: var(--step-5);
		line-height: 0.95;
		letter-spacing: -0.055em;
	}

	.summary {
		max-width: 48rem;
		margin: 0;
		font-size: var(--step-1);
		color: var(--ink-soft);
	}

	.story {
		background: white;
	}

	.story-grid {
		display: grid;
		grid-template-columns: minmax(20rem, 0.95fr) minmax(0, 1.05fr);
		gap: clamp(3rem, 8vw, 8rem);
		align-items: center;
	}

	.story-image {
		position: relative;
	}

	.story-image img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}

	.story-image span {
		position: absolute;
		right: -1.5rem;
		bottom: 2rem;
		padding: 0.8rem 1rem;
		background: var(--sky);
		border-radius: 999px;
		color: white;
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.body-copy > p:not(.eyebrow) {
		margin: 1rem 0 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(1.35rem, 2.2vw, 2rem);
		line-height: 1.5;
		color: var(--navy);
	}

	.initiatives {
		background: var(--blue-pale);
	}

	.initiatives-intro h2 {
		max-width: 10ch;
		margin: 0.6rem 0 0;
		font-size: var(--step-4);
		line-height: 1.02;
		letter-spacing: -0.035em;
	}

	.initiative-list {
		margin-top: 3.5rem;
		border-top: 1px solid var(--line);
	}

	.initiative-list > section {
		display: grid;
		grid-template-columns: 4rem 1fr;
		gap: clamp(1rem, 4vw, 4rem);
		padding: clamp(1.75rem, 4vw, 3rem) 0;
		border-bottom: 1px solid var(--line);
	}

	.initiative-list > section > span {
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		color: var(--sky);
	}

	h3 {
		margin: 0 0 0.7rem;
		font-size: var(--step-2);
	}

	.initiative-list p {
		max-width: 48rem;
		margin: 0;
		color: var(--ink-soft);
	}

	.link-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem 1.5rem;
		margin-top: 1.25rem;
	}

	.link-row a {
		padding-bottom: 0.2rem;
		border-bottom: 1px solid currentColor;
		font-size: 0.76rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--blue);
	}

	.gallery-section {
		background: white;
	}

	.gallery-intro {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(16rem, 0.9fr);
		gap: 1rem clamp(2rem, 7vw, 7rem);
		align-items: end;
		margin-bottom: clamp(2rem, 5vw, 4rem);
	}

	.gallery-intro .eyebrow,
	.gallery-intro h2 {
		grid-column: 1;
	}

	.gallery-intro h2 {
		max-width: 13ch;
		margin: 0.45rem 0 0;
		font-size: var(--step-4);
		line-height: 1.02;
		letter-spacing: -0.035em;
	}

	.gallery-intro > p:last-child {
		grid-column: 2;
		grid-row: 1 / span 2;
		align-self: end;
		margin: 0;
		color: var(--ink-soft);
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(1rem, 2.5vw, 2rem);
	}

	.gallery-grid figure {
		margin: 0;
		padding: 0.55rem;
		background: var(--cream);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}

	.gallery-grid figure.featured {
		grid-column: span 2;
	}

	.gallery-grid img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		border-radius: calc(var(--radius-lg) - 0.35rem);
		background: var(--blue-pale);
	}

	.gallery-grid figure.featured img {
		aspect-ratio: 16 / 9;
	}

	.gallery-grid figcaption {
		padding: 0.85rem 0.55rem 0.45rem;
		font-size: 0.82rem;
		line-height: 1.4;
		color: var(--ink-soft);
	}

	.next-project {
		background: var(--cream);
	}

	.next-project a {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.5rem 2rem;
		width: min(100% - 2rem, 78rem);
		margin-inline: auto;
		padding: clamp(3rem, 7vw, 6rem) 0;
		color: var(--navy);
	}

	.next-project span {
		grid-column: 1;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.next-project strong {
		grid-column: 1;
		font-size: var(--step-3);
		line-height: 1.1;
	}

	.next-project b {
		grid-column: 2;
		grid-row: 1 / span 2;
		align-self: center;
		font-size: 2rem;
	}

	@media (max-width: 760px) {
		.story-grid {
			grid-template-columns: 1fr;
		}

		.story-image {
			width: calc(100% - 1.5rem);
		}

		.gallery-intro {
			grid-template-columns: 1fr;
		}

		.gallery-intro > p:last-child {
			grid-column: 1;
			grid-row: auto;
		}

		.gallery-grid {
			grid-template-columns: 1fr;
		}

		.gallery-grid figure.featured {
			grid-column: auto;
		}
	}
</style>
