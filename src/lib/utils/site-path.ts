import { base } from '$app/paths';

// Upgrade bundled legacy banners in previously saved admin/Supabase content.
const bannerReplacements: Record<string, string> = {
	'/assets/images/projects-lightbulbs.jpg': '/assets/images/projects-lightbulbs-branded.png',
	'/assets/images/projects-lightbulbs-footer.jpg': '/assets/images/projects-lightbulbs-footer-branded.png',
	'/assets/images/consular-footer.jpg': '/assets/images/consular-footer-branded.png'
};

export function sitePath(path: string) {
	if (!path.startsWith('/') || path.startsWith('//')) return path;
	const unprefixed = base && path.startsWith(`${base}/`) ? path.slice(base.length) : path;
	if (bannerReplacements[unprefixed]) return `${base}${bannerReplacements[unprefixed]}`;
	if (base && (path === base || path.startsWith(`${base}/`))) return path;
	return `${base}${path}`;
}

export function addSiteBase<T>(value: T): T {
	if (typeof value === 'string') return sitePath(value) as T;
	if (Array.isArray(value)) return value.map((item) => addSiteBase(item)) as T;
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, item]) => [key, addSiteBase(item)])
		) as T;
	}
	return value;
}
