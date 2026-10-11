import type { LayoutServerLoad } from './$types';
import { readContent } from '$lib/server/content';

export const load: LayoutServerLoad = async () => ({
	content: await readContent()
});
