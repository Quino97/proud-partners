<script lang="ts">
	import { page } from '$app/state';

	const site = $derived(page.data.content.site);
	const media = $derived(page.data.content.media);
</script>

<footer>
	<div class="container footer-grid">
		<div class="footer-brand">
			<img src={media.mark} alt="" />
			<div>
				<strong>{site.name}</strong>
				<span>{site.location}</span>
			</div>
		</div>

		<p>{site.description}</p>

		<nav aria-label="Footer navigation">
			{#each site.navigation as item}
				<a href={item.href}>{item.label}</a>
			{/each}
		</nav>
	</div>

	<div class="container footer-bottom">
		<span>© {new Date().getFullYear()} Proud Partners</span>
		<span>Partnership over charity.</span>
	</div>
</footer>

<style>
	footer {
		padding: 4rem 0 1.5rem;
		background: var(--navy-deep);
		color: white;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1.15fr 1.5fr 0.7fr;
		gap: clamp(2rem, 6vw, 6rem);
		align-items: start;
	}

	.footer-brand {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.footer-brand img {
		width: 3.8rem;
		height: 3.8rem;
		border-radius: 50%;
		background: white;
	}

	.footer-brand strong,
	.footer-brand span {
		display: block;
	}

	.footer-brand strong {
		font-size: 1.15rem;
	}

	.footer-brand span {
		margin-top: 0.25rem;
		font-size: 0.78rem;
		color: rgba(255, 255, 255, 0.65);
	}

	footer p {
		margin: 0;
		color: rgba(255, 255, 255, 0.68);
	}

	nav {
		display: grid;
		gap: 0.75rem;
	}

	nav a {
		color: white;
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.footer-bottom {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 4rem;
		padding-top: 1.25rem;
		border-top: 1px solid rgba(255, 255, 255, 0.14);
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.48);
	}

	@media (max-width: 760px) {
		.footer-grid {
			grid-template-columns: 1fr;
		}

		.footer-bottom {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
