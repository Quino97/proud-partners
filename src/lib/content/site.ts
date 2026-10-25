import importedContent from '../../../data/content.json';
import { upgradeConsularMedia } from './consular-media';

export interface ImageItem { id: string; src: string; alt: string; caption: string; position: string; zoom?: number; source?: string; width?: number; height?: number }
export interface ContentLink { label: string; href: string }
export interface VideoItem { url: string; caption: string; poster: string }
export interface TileContent { title: string; subtitle: string; copy: string; label: string; image: ImageItem | null }
export type SectionLayout = 'text' | 'split' | 'gallery' | 'tiles' | 'video' | 'stats';
export interface EditorialSection {
	id: string; heading: string; paragraphs: string[]; layout: SectionLayout; tone: 'cream' | 'blue'; images: ImageItem[]; videos: VideoItem[]; links: ContentLink[]; tileIds: string[]; stats: string[]; cards?: (TileContent & { id: string })[];
}
export interface ContentPage {
	id: string; path: string; parentId: string; title: string; subtitle: string; description: string; kind: 'home' | 'landing' | 'story' | 'ball' | 'year' | 'contact'; hidden: boolean; heroImage: ImageItem | null; card: TileContent; sections: EditorialSection[];
}
export interface SiteContent {
	contentVersion: number;
	consularMediaRevision?: number;
	site: { name: string; description: string; location: string; footerTagline: string; navigation: { label: string; href: string }[] };
	media: { wordmark: string; mark: string; homeQuote: string };
	pages: ContentPage[]; mediaLibrary: ImageItem[];
	contact: { functionName: string; fields: { name: string; email: string; phone: string; message: string; submit: string }; successMessage: string; errorMessage: string };
}
export const defaultContent = importedContent as SiteContent;
// An older published record cannot replace the imported page structure after hydration.
export function normaliseContent(value: unknown): SiteContent {
	const saved = value as Partial<SiteContent> | null;
	if (!saved || (saved.contentVersion ?? 0) < 3 || !Array.isArray(saved.pages)) return structuredClone(defaultContent);
	const content = { ...structuredClone(defaultContent), ...saved } as SiteContent;
	// Read the saved marker before defaults are merged, so old published records migrate too.
	content.consularMediaRevision = saved.consularMediaRevision ?? 0;
	return upgradeConsularMedia(content, defaultContent);
}
export function newSection(): EditorialSection {
	return { id: crypto.randomUUID(), heading: '', paragraphs: [], layout: 'text', tone: 'cream', images: [], videos: [], links: [], tileIds: [], stats: [] };
}
