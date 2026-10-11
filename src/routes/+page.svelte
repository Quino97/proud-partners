<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { page } from '$app/state';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import VideoFeature from '$lib/components/VideoFeature.svelte';

	const site = $derived(page.data.content.site);
	const projects = $derived(page.data.content.projects);
	const media = $derived(page.data.content.media);
	const copy = $derived(page.data.content.pages.home);
</script>

<Seo />

<section class="home-hero" style:--home-background={`url("${media.homeBackground}")`}>
	<div class="hero-orbit orbit-one"></div>
	<div class="hero-orbit orbit-two"></div>
	<div class="container hero-grid">
		<div class="hero-copy" use:reveal>
			<p class="eyebrow">{site.home.eyebrow}</p>
			<h1>{site.home.title}</h1>
			<p class="hero-intro">{site.home.intro}</p>
			<div class="cluster hero-actions">
				<a class="button" href="/projects">{copy.primaryAction} <span aria-hidden="true">↗</span></a>
				<a class="button secondary" href="/about">{copy.secondaryAction}</a>
			</div>
		</div>

		<div class="legacy-masthead" use:reveal={{ delay: 120 }}>
			<div class="masthead-label">{copy.mastheadLabel}</div>
			<img
				src={media.homeMasthead}
				alt="People and community moments from Proud Partners projects"
			/>
			<p>{copy.mastheadCaption}</p>
		</div>
	</div>
	<a class="scroll-cue" href="#welcome" aria-label="Scroll to the introduction">
		<span>Scroll</span><i></i>
	</a>
</section>

<section class="section welcome" id="welcome">
	<div class="container welcome-grid">
		<div class="portrait" use:reveal>
			<img src={media.homePortrait} alt="A smiling child at a Proud Partners project" />
			<div class="portrait-note">{copy.portraitNote}</div>
		</div>
		<div class="welcome-copy" use:reveal={{ delay: 100 }}>
			<SectionHeading
				eyebrow={copy.welcomeEyebrow}
				title={site.home.featureTitle}
				copy={site.home.featureCopy}
			/>
			<div class="principle-line">
				{#each copy.principles as principle, index}
					<span>0{index + 1}</span>
					<p>{principle}</p>
				{/each}
			</div>
		</div>
	</div>
</section>

<section class="impact-strip" aria-label="Proud Partners at a glance">
	<div class="container impact-grid">
		{#each copy.stats as stat}
			<div><strong>{stat.value}</strong><span>{stat.label}</span></div>
		{/each}
	</div>
</section>

<section class="section projects-preview">
	<div class="container">
		<div class="preview-heading" use:reveal>
			<SectionHeading
					eyebrow={copy.projectsEyebrow}
					title={copy.projectsTitle}
					copy={copy.projectsCopy}
			/>
			<a class="text-link" href="/projects">View every project <span aria-hidden="true">→</span></a>
		</div>
		<div class="project-grid">
			{#each projects.slice(0, 3) as project, index}
				<ProjectCard {project} delay={index * 80} />
			{/each}
		</div>
	</div>
</section>

<section class="quote-section">
	<img src={media.homeQuote} alt="Children looking playfully toward the camera" loading="lazy" />
	<div class="quote-overlay"></div>
	<blockquote use:reveal>
		<span aria-hidden="true">“</span>
		<p>{site.home.missionQuote}</p>
		<cite>{copy.quoteAttribution}</cite>
	</blockquote>
</section>

<section class="section video-section">
	<div class="container" use:reveal>
		<VideoFeature
			title={site.home.videoTitle}
			copy={site.home.videoCopy}
			url={site.home.videoUrl}
			poster={media.videoPoster}
			eyebrow={copy.videoEyebrow}
		/>
	</div>
</section>

<style>
	.home-hero {
		position: relative;
		display: grid;
		place-items: center;
		min-height: 100svh;
		padding: 8.5rem 0 5.5rem;
		background:
			linear-gradient(115deg, rgba(251, 247, 238, 0.97), rgba(232, 243, 247, 0.86)),
			var(--home-background) center / cover;
		overflow: hidden;
	}

	.home-hero::after {
		content: '';
		position: absolute;
		inset: auto 0 0;
		height: 7rem;
		background: linear-gradient(transparent, var(--cream));
	}

	.hero-grid {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(24rem, 0.95fr);
		gap: clamp(3rem, 7vw, 8rem);
		align-items: center;
	}

	h1 {
		max-width: 10ch;
		margin: 0.75rem 0 1.3rem;
		font-size: var(--step-5);
		line-height: 0.94;
		letter-spacing: -0.055em;
		text-wrap: balance;
	}

	.hero-intro {
		max-width: 38rem;
		margin: 0;
		font-size: var(--step-1);
		color: var(--ink-soft);
	}

	.hero-actions {
		margin-top: 2rem;
	}

	.legacy-masthead {
		position: relative;
		padding: clamp(1rem, 2.5vw, 1.6rem);
		background: rgba(255, 255, 255, 0.88);
		border: 1px solid rgba(255, 255, 255, 0.75);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		transform: rotate(1.5deg);
		backdrop-filter: blur(8px);
	}

	.legacy-masthead img {
		display: block;
		width: 100%;
		border-radius: var(--radius-sm);
	}

	.legacy-masthead p {
		margin: 1rem 0 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 1.02rem;
		font-style: italic;
		color: var(--ink-soft);
	}

	.masthead-label {
		position: absolute;
		top: -1rem;
		right: 1.5rem;
		padding: 0.6rem 0.9rem;
		background: var(--sky);
		border-radius: 999px;
		color: white;
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.hero-orbit {
		position: absolute;
		border: 1px solid rgba(13, 103, 173, 0.16);
		border-radius: 50%;
	}

	.orbit-one {
		right: -13rem;
		top: -12rem;
		width: 38rem;
		height: 38rem;
	}

	.orbit-two {
		right: 3rem;
		top: 2rem;
		width: 15rem;
		height: 15rem;
	}

	.scroll-cue {
		position: absolute;
		z-index: 3;
		left: 50%;
		bottom: 1.5rem;
		display: grid;
		justify-items: center;
		gap: 0.55rem;
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		transform: translateX(-50%);
	}

	.scroll-cue i {
		display: block;
		width: 1px;
		height: 2.5rem;
		background: var(--navy);
		transform-origin: top;
		animation: scroll-line 1.8s ease-in-out infinite;
	}

	@keyframes scroll-line {
		0%,
		100% {
			transform: scaleY(0.35);
			opacity: 0.4;
		}
		50% {
			transform: scaleY(1);
			opacity: 1;
		}
	}

	.welcome-grid {
		display: grid;
		grid-template-columns: minmax(18rem, 0.82fr) minmax(0, 1.18fr);
		gap: clamp(3rem, 8vw, 8rem);
		align-items: center;
	}

	.portrait {
		position: relative;
		margin-left: clamp(0rem, 4vw, 4rem);
	}

	.portrait::before {
		content: '';
		position: absolute;
		inset: -1rem 2rem 2rem -1rem;
		z-index: -1;
		background: var(--blue-pale);
		border-radius: 45% 45% 1.25rem 1.25rem;
	}

	.portrait img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		object-position: center 28%;
		border-radius: 45% 45% 1.25rem 1.25rem;
		box-shadow: var(--shadow-sm);
	}

	.portrait-note {
		position: absolute;
		right: -2.5rem;
		bottom: 1.5rem;
		width: min(15rem, 70%);
		padding: 1rem;
		background: var(--navy);
		border-radius: var(--radius-sm);
		color: white;
		font-size: 0.78rem;
		line-height: 1.45;
	}

	.principle-line {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0;
		margin-top: 2.5rem;
		border-top: 1px solid var(--line);
	}

	.principle-line span,
	.principle-line p {
		margin: 0;
		padding: 1rem 0;
		border-bottom: 1px solid var(--line);
	}

	.principle-line span {
		padding-right: 1.3rem;
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--sky);
	}

	.principle-line p {
		font-weight: 700;
	}

	.impact-strip {
		padding: 2.5rem 0;
		background: var(--navy);
		color: white;
	}

	.impact-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}

	.impact-grid div {
		display: grid;
		gap: 0.25rem;
		padding: 0.5rem clamp(1rem, 4vw, 4rem);
		border-right: 1px solid rgba(255, 255, 255, 0.18);
	}

	.impact-grid div:last-child {
		border: 0;
	}

	.impact-grid strong {
		font-size: var(--step-2);
		line-height: 1.1;
	}

	.impact-grid span {
		font-size: 0.74rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.62);
	}

	.projects-preview {
		background: white;
	}

	.preview-heading {
		display: flex;
		justify-content: space-between;
		gap: 2rem;
		align-items: end;
	}

	.text-link {
		flex: none;
		padding-bottom: 0.3rem;
		border-bottom: 1px solid var(--navy);
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.project-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.25rem;
		margin-top: 3.5rem;
	}

	.quote-section {
		position: relative;
		display: grid;
		place-items: center;
		min-height: min(78vh, 50rem);
		padding: 5rem 1rem;
		overflow: hidden;
	}

	.quote-section > img,
	.quote-overlay {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.quote-section > img {
		object-fit: cover;
	}

	.quote-overlay {
		background: linear-gradient(110deg, rgba(6, 40, 68, 0.86), rgba(9, 61, 115, 0.48));
	}

	blockquote {
		position: relative;
		z-index: 1;
		max-width: 54rem;
		margin: 0;
		text-align: center;
		color: white;
	}

	blockquote > span {
		display: block;
		height: 3rem;
		font-family: Georgia, serif;
		font-size: 7rem;
		line-height: 0.8;
		color: var(--sky-light);
	}

	blockquote p {
		margin: 1rem 0 1.5rem;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 4rem);
		line-height: 1.14;
		font-style: italic;
		text-wrap: balance;
	}

	blockquote cite {
		font-size: 0.75rem;
		font-style: normal;
		font-weight: 800;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
	}

	.video-section {
		background: var(--cream);
	}

	@media (max-width: 900px) {
		.hero-grid {
			grid-template-columns: 1fr;
		}

		h1 {
			max-width: 12ch;
		}

		.legacy-masthead {
			width: min(100%, 40rem);
			transform: rotate(0.75deg);
		}

		.project-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 680px) {
		.home-hero {
			align-items: start;
			min-height: auto;
			padding-top: 7.3rem;
		}

		.hero-grid {
			gap: 3.5rem;
		}

		.hero-copy {
			text-align: center;
		}

		h1,
		.hero-intro {
			margin-inline: auto;
		}

		.hero-actions {
			justify-content: center;
		}

		.scroll-cue {
			display: none;
		}

		.welcome-grid {
			grid-template-columns: 1fr;
		}

		.portrait {
			width: min(88%, 28rem);
			margin: 0;
		}

		.portrait-note {
			right: -1.5rem;
		}

		.impact-grid,
		.project-grid {
			grid-template-columns: 1fr;
		}

		.impact-grid div {
			border-right: 0;
			border-bottom: 1px solid rgba(255, 255, 255, 0.18);
			text-align: center;
		}

		.preview-heading {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
