import type { LayoutServerLoad } from './$types';
import { readContent } from '$lib/server/content';
import { addSiteBase } from '$lib/utils/site-path';

export const prerender = true;
export const trailingSlash = 'always';

export const load: LayoutServerLoad = async () => ({
	content: addSiteBase(await readContent())
});
