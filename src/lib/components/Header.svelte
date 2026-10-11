<script lang="ts">
	import { page } from '$app/state';

	let menuOpen = $state(false);
	let scrolled = $state(false);
	const path = $derived(page.url.pathname);
	const site = $derived(page.data.content.site);
	const media = $derived(page.data.content.media);

	function isActive(href: string) {
		return href === '/' ? path === '/' : path.startsWith(href);
	}
</script>

<svelte:window onscroll={() => (scrolled = window.scrollY > 18)} />

<header class:scrolled class:open={menuOpen}>
	<a class="skip-link" href="#main-content">Skip to content</a>
	<div class="container nav-shell">
		<a class="brand" href="/" aria-label="Proud Partners home" onclick={() => (menuOpen = false)}>
			<img src={media.wordmark} alt="Proud Partners" />
		</a>

		<button
			class="menu-button"
			type="button"
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<span></span><span></span>
		</button>

		<nav aria-label="Main navigation">
			{#each site.navigation as item}
				<a
					href={item.href}
					class:active={isActive(item.href)}
					aria-current={isActive(item.href) ? 'page' : undefined}
					onclick={() => (menuOpen = false)}>{item.label}</a
				>
			{/each}
			<a class="support-link" href="/projects#support" onclick={() => (menuOpen = false)}>
				Support a project
			</a>
		</nav>
	</div>
</header>

<style>
	header {
		position: fixed;
		inset: 0 0 auto;
		z-index: 50;
		padding: 0.85rem 0;
		background: color-mix(in srgb, var(--cream) 90%, transparent);
		border-bottom: 1px solid transparent;
		backdrop-filter: blur(16px);
		transition:
			padding 220ms ease,
			border-color 220ms ease,
			box-shadow 220ms ease;
	}

	header.scrolled {
		padding: 0.55rem 0;
		border-color: var(--line);
		box-shadow: 0 10px 35px rgba(8, 45, 80, 0.07);
	}

	.nav-shell {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	.brand {
		display: inline-flex;
		width: min(13.5rem, 48vw);
	}

	.brand img {
		display: block;
		width: 100%;
		height: auto;
	}

	nav {
		display: flex;
		align-items: center;
		gap: clamp(1.1rem, 2.5vw, 2.4rem);
	}

	nav a {
		position: relative;
		font-size: 0.73rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--navy);
	}

	nav a:not(.support-link)::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -0.45rem;
		width: 100%;
		height: 2px;
		background: var(--sky);
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 180ms ease;
	}

	nav a:hover::after,
	nav a.active::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.support-link {
		padding: 0.8rem 1rem;
		background: var(--navy);
		border-radius: 999px;
		color: white;
	}

	.support-link:hover {
		background: var(--blue);
	}

	.menu-button {
		display: none;
	}

	.skip-link {
		position: fixed;
		left: 1rem;
		top: 0.5rem;
		z-index: 100;
		padding: 0.65rem 0.9rem;
		background: var(--navy);
		color: white;
		transform: translateY(-160%);
	}

	.skip-link:focus {
		transform: translateY(0);
	}

	@media (max-width: 1020px) {
		.menu-button {
			display: grid;
			place-content: center;
			gap: 0.42rem;
			width: 2.8rem;
			height: 2.8rem;
			padding: 0;
			border: 1px solid var(--line);
			border-radius: 50%;
			background: var(--cream);
		}

		.menu-button span {
			display: block;
			width: 1.1rem;
			height: 1px;
			background: var(--navy);
			transition: transform 180ms ease;
		}

		header.open .menu-button span:first-child {
			transform: translateY(0.225rem) rotate(45deg);
		}

		header.open .menu-button span:last-child {
			transform: translateY(-0.225rem) rotate(-45deg);
		}

		nav {
			position: fixed;
			inset: 4.7rem 1rem auto;
			display: grid;
			gap: 0;
			padding: 0.8rem;
			background: var(--cream);
			border: 1px solid var(--line);
			border-radius: var(--radius-md);
			box-shadow: var(--shadow-lg);
			opacity: 0;
			pointer-events: none;
			transform: translateY(-0.5rem);
			transition:
				opacity 160ms ease,
				transform 160ms ease;
		}

		header.open nav {
			opacity: 1;
			pointer-events: auto;
			transform: translateY(0);
		}

		nav a {
			padding: 1rem;
			border-bottom: 1px solid var(--line);
		}

		nav a::after {
			display: none;
		}

		nav .support-link {
			margin-top: 0.75rem;
			border: 0;
			text-align: center;
		}
	}
</style>
