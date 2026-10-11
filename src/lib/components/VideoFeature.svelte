<script lang="ts">
	let {
		title,
		copy,
		url,
		poster = '/assets/images/schoolkids.jpg',
		eyebrow = 'Voices of the future'
	}: { title: string; copy: string; url?: string; poster?: string; eyebrow?: string } = $props();
</script>

<section class="video-feature">
	<div class="media">
		{#if url}
			<iframe
				src={url}
				title={title}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		{:else}
			<img src={poster} alt="Children gathered around an outdoor classroom" loading="lazy" />
			<span class="play-mark" aria-hidden="true">▶</span>
		{/if}
	</div>
	<div class="copy">
		<p class="eyebrow">{eyebrow}</p>
		<h2>{title}</h2>
		<p>{copy}</p>
	</div>
</section>

<style>
	.video-feature {
		display: grid;
		grid-template-columns: minmax(0, 1.3fr) minmax(18rem, 0.7fr);
		background: var(--navy);
		border-radius: var(--radius-lg);
		overflow: hidden;
		color: white;
		box-shadow: var(--shadow-lg);
	}

	.media {
		position: relative;
		aspect-ratio: 16 / 10;
		min-height: 100%;
		overflow: hidden;
		background: var(--navy-deep);
	}

	.media::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, transparent 60%, rgba(6, 36, 65, 0.35));
		pointer-events: none;
	}

	.media img,
	.media iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
		object-fit: cover;
	}

	.play-mark {
		position: absolute;
		inset: 50% auto auto 50%;
		z-index: 1;
		display: grid;
		place-items: center;
		width: 4.8rem;
		height: 4.8rem;
		padding-left: 0.25rem;
		border: 1px solid rgba(255, 255, 255, 0.8);
		border-radius: 50%;
		background: rgba(9, 61, 115, 0.68);
		transform: translate(-50%, -50%);
		backdrop-filter: blur(8px);
	}

	.copy {
		display: flex;
		justify-content: center;
		flex-direction: column;
		padding: clamp(2rem, 5vw, 4.5rem);
	}

	.copy .eyebrow {
		color: var(--sky-light);
	}

	h2 {
		margin: 0.65rem 0 1rem;
		font-size: var(--step-3);
		line-height: 1.08;
	}

	.copy > p:last-child {
		margin: 0;
		color: rgba(255, 255, 255, 0.72);
	}

	@media (max-width: 800px) {
		.video-feature {
			grid-template-columns: 1fr;
		}
	}
</style>
