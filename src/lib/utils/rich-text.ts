export interface InlineText {
	text: string;
	bold: boolean;
	italic: boolean;
}

// Deliberately limited to emphasis: all text remains escaped by Svelte.
// Separate runs also support adjacent emphasis and combined bold italics.
export function parseInline(text: string): InlineText[] {
	const parts: InlineText[] = [];
	const emphasis = /\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
	let offset = 0;
	for (const match of text.matchAll(emphasis)) {
		if (match.index > offset) parts.push({ text: text.slice(offset, match.index), bold: false, italic: false });
		parts.push({ text: match[1] ?? match[2] ?? match[3], bold: match[1] !== undefined || match[2] !== undefined, italic: match[1] !== undefined || match[3] !== undefined });
		offset = match.index + match[0].length;
	}
	if (offset < text.length) parts.push({ text: text.slice(offset), bold: false, italic: false });
	return parts;
}

export function plainText(text: string): string {
	return parseInline(text).map(part => part.text).join('');
}
