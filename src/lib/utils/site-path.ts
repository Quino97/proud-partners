import { base } from '$app/paths';

export function sitePath(path: string) {
	if (!path.startsWith('/') || path.startsWith('//')) return path;
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
