import type { SiteContent } from './site';

/** Add the client photo delivery to an older saved draft once; later admin edits win. */
export function upgradeConsularMedia(saved: SiteContent, bundled: SiteContent): SiteContent {
	const revision = bundled.consularMediaRevision ?? 0;
	if ((saved.consularMediaRevision ?? 0) >= revision) return saved;
	const result = structuredClone(saved);
	for (const page of result.pages) {
		const updated = bundled.pages.find(item => item.id === page.id);
		if (!updated) continue;
		if (page.kind === 'year' && page.parentId === 'consular-ball') {
			page.card.image = structuredClone(updated.card.image);
			for (const section of page.sections) {
				const source = updated.sections.find(item => item.id === section.id);
				if (section.layout === 'gallery' && source) section.images = structuredClone(source.images);
			}
			for (const section of updated.sections.filter(item => item.id.startsWith('consular-documents-'))) {
				if (!page.sections.some(item => item.id === section.id)) page.sections.push(structuredClone(section));
			}
		}
		if (page.id === 'consular-ball') {
			page.card.image = structuredClone(updated.card.image);
			for (const section of page.sections) {
				const source = updated.sections.find(item => item.id === section.id);
				if (source?.images.length) section.images = structuredClone(source.images);
			}
		}
		for (const section of page.sections) {
			for (const card of section.cards ?? []) {
				if (card.id === 'consular-ball') card.image = structuredClone(bundled.pages.find(item => item.id === card.id)?.card.image ?? null);
			}
		}
	}
	const existing = new Set(result.mediaLibrary.map(image => image.id));
	result.mediaLibrary.unshift(...structuredClone(bundled.mediaLibrary.filter(image => image.id.startsWith('consular-') && !existing.has(image.id))));
	result.consularMediaRevision = revision;
	return result;
}
