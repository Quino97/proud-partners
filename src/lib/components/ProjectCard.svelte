<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import type { Project } from '$lib/content/site';

	let { project, delay = 0 }: { project: Project; delay?: number } = $props();
</script>

<a class="card" href={`/projects/${project.slug}`} use:reveal={{ delay }}>
	<div class="image-wrap">
		<img src={project.image} alt={project.imageAlt} loading="lazy" />
		<span>{project.number}</span>
	</div>
	<div class="content">
		<p class="eyebrow">Explore the project</p>
		<h3>{project.title}</h3>
		<p>{project.summary}</p>
		<span class="arrow-link">Discover more <b aria-hidden="true">↗</b></span>
	</div>
</a>

<style>
	.card {
		display: grid;
		grid-template-rows: auto 1fr;
		min-width: 0;
		background: white;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
		color: var(--ink);
		transition:
			transform 260ms ease,
			box-shadow 260ms ease;
	}

	.card:hover {
		transform: translateY(-0.45rem);
		box-shadow: var(--shadow-lg);
	}

	.image-wrap {
		position: relative;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background: var(--blue-pale);
	}

	.image-wrap img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.card:hover img {
		transform: scale(1.045);
	}

	.image-wrap span {
		position: absolute;
		top: 1rem;
		left: 1rem;
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 50%;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: var(--navy);
		backdrop-filter: blur(10px);
	}

	.content {
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
	}

	h3 {
		margin: 0.5rem 0 0.75rem;
		font-size: var(--step-2);
		line-height: 1.15;
	}

	.content > p:not(.eyebrow) {
		margin: 0;
		color: var(--ink-soft);
	}

	.arrow-link {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: auto;
		padding-top: 1.5rem;
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--blue);
	}

	.arrow-link b {
		font-size: 1.1rem;
	}
</style>
