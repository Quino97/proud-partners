import { defaultContent } from '$lib/content/site';
export const entries = () => defaultContent.pages.filter(p => p.path.startsWith('/projects/') && !p.hidden).map(p => ({slug:p.id}));
