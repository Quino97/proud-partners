import { defaultContent } from '$lib/content/site';
export const entries = () => defaultContent.pages.filter(p => p.kind === 'year' && !p.hidden).map(p => ({year:p.id.replace('ball-','')}));
