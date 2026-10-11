<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { page } from '$app/state';
	import { siteContent } from '$lib/stores/site-content';
	import ImageBand from '$lib/components/ImageBand.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const site = $derived($siteContent.site);
	const projects = $derived($siteContent.projects);
	const media = $derived($siteContent.media);
	const copy = $derived($siteContent.pages.projects);
</script>

<Seo
	title="Projects"
	description={copy.seoDescription}
	image={media.projectsHero}
/>

<section class="projects-hero">
	<ImageBand src={media.projectsHero} alt="Blue lightbulbs with one bright idea" />
	<div class="container hero-copy" use:reveal>
		<p class="eyebrow">{copy.eyebrow}</p>
		<h1>{copy.title}</h1>
		<p>{copy.intro}</p>
	</div>
</section>

<section class="section projects-list">
	<div class="container">
		<SectionHeading
			eyebrow={copy.listEyebrow}
			title={copy.listTitle}
			copy={copy.listCopy}
		/>
		<div class="project-grid">
			{#each projects as project, index}
				<ProjectCard {project} delay={(index % 3) * 70} />
			{/each}
		</div>
	</div>
</section>

<section class="support section" id="support">
	<div class="container support-grid">
		<div use:reveal>
			<SectionHeading
				eyebrow={site.support.eyebrow}
				title={site.support.title}
				copy={site.support.copy}
			/>
		</div>
		<div class="support-links" use:reveal={{ delay: 100 }}>
			{#each site.support.links as link, index}
				<a href={link.href} target="_blank" rel="noreferrer">
					<span>0{index + 1}</span>
					<strong>{link.label}</strong>
					<b aria-hidden="true">↗</b>
				</a>
			{/each}
		</div>
	</div>
</section>

<ImageBand
	src={media.projectsFooter}
	alt="A pattern of blue lightbulbs"
/>

<style>
	.projects-hero {
		padding-top: 5.4rem;
		background: var(--navy);
		color: white;
	}

	.projects-hero :global(.band) {
		min-height: clamp(18rem, 40vw, 34rem);
	}

	.hero-copy {
		padding-top: clamp(3rem, 7vw, 6rem);
		padding-bottom: clamp(4rem, 8vw, 7rem);
	}

	.hero-copy .eyebrow {
		color: var(--sky-light);
	}

	h1 {
		max-width: 11ch;
		margin: 0.65rem 0 1.25rem;
		font-size: var(--step-5);
		line-height: 1.025;
		letter-spacing: -0.055em;
	}

	.hero-copy > p:last-child {
		max-width: 44rem;
		margin: 0;
		font-size: var(--step-1);
		color: rgba(255, 255, 255, 0.72);
	}

	.projects-list {
		background: var(--cream);
	}

	.project-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.25rem;
		margin-top: 3.5rem;
	}

	.support {
		background: var(--cream);
	}

	.support-grid {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(22rem, 1.2fr);
		gap: clamp(3rem, 8vw, 8rem);
		align-items: start;
	}

	.support-links {
		border-top: 1px solid var(--line);
	}

	.support-links a {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 1.25rem;
		align-items: center;
		padding: 1.5rem 0;
		border-bottom: 1px solid var(--line);
		color: var(--navy);
	}

	.support-links a:hover {
		padding-left: 0.6rem;
		color: var(--blue);
	}

	.support-links span {
		font-size: 0.68rem;
		font-weight: 800;
		color: var(--sky);
	}

	.support-links strong {
		font-size: var(--step-1);
	}

	.support-links b {
		font-size: 1.2rem;
	}

	@media (max-width: 900px) {
		.project-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 680px) {
		.project-grid,
		.support-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
