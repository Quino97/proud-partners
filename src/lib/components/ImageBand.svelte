<script lang="ts">
	let {
		src,
		alt = '',
		position = 'center',
		zoom = 1
	}: { src: string; alt?: string; position?: string; zoom?: number } = $props();
</script>

<div class="band" style:--band-zoom={zoom} style:--band-origin={position}>
	<img {src} {alt} style:object-position={position} />
</div>

<style>
	.band {
		width: 100%;
		aspect-ratio: 1362 / 360;
		min-height: 13rem;
		max-height: 29rem;
		overflow: hidden;
		background: var(--navy);
	}

	.band img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform-origin: var(--band-origin) center;
		transform: scale(var(--band-zoom));
	}

	@media (max-width: 640px) {
		.band {
			aspect-ratio: 4 / 3;
		}
	}
</style>
