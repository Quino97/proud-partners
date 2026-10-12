<script lang="ts">
	let {
		src,
		alt = '',
		position = 'center',
		zoom = 1,
		mobilePanorama = false,
		mobilePosition = position
	}: { src: string; alt?: string; position?: string; zoom?: number; mobilePanorama?: boolean; mobilePosition?: string } = $props();
</script>

<div class="band" class:mobile-panorama={mobilePanorama} style:--band-zoom={zoom} style:--band-origin={position} style:--mobile-position={mobilePosition}>
	<img {src} {alt} />
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
		object-position: var(--band-origin);
		transform-origin: var(--band-origin) center;
		transform: scale(var(--band-zoom));
	}

	@media (max-width: 640px) {
		.band {
			aspect-ratio: 4 / 3;
		}

		.band.mobile-panorama {
			aspect-ratio: 5 / 2;
			min-height: 0;
			max-height: none;
		}

		.mobile-panorama img {
			object-position: var(--mobile-position);
			transform: none;
		}
	}
</style>
