import type { Action } from 'svelte/action';

export const reveal: Action<HTMLElement, { delay?: number } | undefined> = (node, options) => {
	const delay = options?.delay ?? 0;
	node.style.setProperty('--reveal-delay', `${delay}ms`);

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.dataset.revealed = 'true';
		return;
	}
	// Keep server-rendered content visible without JavaScript; animate only once mounted.
	node.dataset.revealed = 'false';

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.dataset.revealed = 'true';
				observer.unobserve(node);
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
