// Restore character emphasis from a local Apache POI HWPF CharacterRun export.
// Only presentation markers change; every plain-text value is checked verbatim.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { plainText } from '../src/lib/utils/rich-text.ts';

const input = process.argv.find(arg => arg.endsWith('.json')) || '../proud-partners-work/piet-format-runs.json';
const apply = process.argv.includes('--apply');
const paragraphs = JSON.parse(fs.readFileSync(input, 'utf8'));
const content = JSON.parse(fs.readFileSync('data/content.json', 'utf8'));

function formatParagraph(paragraph) {
	const characters = [];
	const fields = [];
	for (const run of paragraph.runs) for (let character of run.text) {
		if (character === '\x13') { fields.push(false); continue; }
		if (character === '\x14') { if (fields.length) fields[fields.length - 1] = true; continue; }
		if (character === '\x15') { fields.pop(); continue; }
		if (fields.some(visible => !visible)) continue;
		if (character === '\r' || character === '\x0b') character = '\n';
		if (character === '\x07') character = '\t';
		characters.push({ text: character, bold: run.bold, italic: run.italic });
	}
	while (characters.length && /\s/.test(characters[0].text)) characters.shift();
	while (characters.length && /\s/.test(characters.at(-1).text)) characters.pop();
	const runs = [];
	for (const character of characters) {
		const previous = runs.at(-1);
		if (previous && previous.bold === character.bold && previous.italic === character.italic) previous.text += character.text;
		else runs.push({ ...character });
	}
	const text = runs.map(run => run.text).join('');
	const marked = runs.map(run => {
		if (!run.bold && !run.italic || !run.text.trim()) return run.text;
		const leading = run.text.match(/^\s*/)[0];
		const trailing = run.text.match(/\s*$/)[0];
		const markers = run.bold ? run.italic ? '***' : '**' : '*';
		return leading + markers + run.text.slice(leading.length, run.text.length - trailing.length) + markers + trailing;
	}).join('');
	// The supplied document also contains a few literal Markdown italics.
	assert.equal(plainText(marked), plainText(text), `Could not encode formatting without changing text: ${text}`);
	return { text: plainText(text), marked, runs };
}

const source = paragraphs.map(formatParagraph).filter(p => p.text);
let currentScope = '';
const normaliseScope = text => text.toLowerCase().replaceAll('’', "'");
for (const paragraph of source) {
	const heading = paragraph.text.match(/^(.+?) Page(?: - no photos)?:$/);
	if (heading) currentScope = normaliseScope(heading[1]);
	paragraph.scope = currentScope;
}
const scopeOverrides = { home:'Home', about:'About', projects:'Projects', education:'Educational Projects', music:'Music Projects', 'child-care':'Childcare Projects', art:'PJO Art Tracks', 'consular-ball':'The Consular Ball', 'stellenzicht-reading':'Stellenzicht Secondary School Reading Project', 'mathematics-support':'Mathematics Support Project', 'girl-talk':'Girl Talk Initiative Project', 'domestic-partnership':'Domestic Partnership', belhar:'The Belhar Project', 'cableway-charity-challenge':'The Cableway Charity Challenge', '5th-st-peters-scouts':"The 5th St Peter's Scouts" };
const scopes = new Map(content.pages.map(page => [page.id, normaliseScope(scopeOverrides[page.id] || page.card.title)]));
const byText = new Map();
const byScope = new Map();
const conflicts = [];
for (const paragraph of source) {
	if (!byScope.has(paragraph.scope)) byScope.set(paragraph.scope, new Map());
	byScope.get(paragraph.scope).set(paragraph.text, paragraph);
	const previous = byText.get(paragraph.text);
	if (previous && previous.marked !== paragraph.marked) conflicts.push(paragraph.text);
	// Some repeated labels have a plain instance and a formatted instance.
	if (!previous || paragraph.marked !== paragraph.text) byText.set(paragraph.text, paragraph);
}
const changes = [];
const missing = [];
function formatField(object, key, location) {
	if (typeof object[key] !== 'string' || !object[key]) return;
	const original = object[key];
	const text = plainText(original);
	const scoped = byScope.get(scopes.get(location.split('.')[0]));
	const find = value => scoped?.get(value) || byText.get(value);
	const paragraph = find(text);
	const lines = text.split('\n').map(line => find(line));
	const marked = paragraph?.marked ?? (lines.every(Boolean) ? lines.map(line => line.marked).join('\n') : undefined);
	if (marked === undefined) { missing.push({ location, text }); return; }
	assert.equal(plainText(marked), text);
	if (original !== marked) { object[key] = marked; changes.push({ location, text, formatted: marked }); }
}
function formatTile(tile, location) {
	for (const key of ['subtitle', 'copy', 'label']) formatField(tile, key, `${location}.${key}`);
}
for (const page of content.pages) {
	formatField(page, 'subtitle', `${page.id}.subtitle`);
	formatTile(page.card, `${page.id}.card`);
	for (const [i, section] of page.sections.entries()) {
		const at = `${page.id}.sections[${i}]`;
		for (const index of section.paragraphs.keys()) formatField(section.paragraphs, index, `${at}.paragraphs[${index}]`);
		for (const [index, link] of section.links.entries()) formatField(link, 'label', `${at}.links[${index}]`);
		for (const [index, video] of section.videos.entries()) formatField(video, 'caption', `${at}.videos[${index}]`);
		for (const [index, card] of (section.cards || []).entries()) formatTile(card, `${at}.cards[${index}]`);
	}
}

let inCopy = false;
const copiedEmphasis = [];
for (const paragraph of source) {
	if (/ Page(?: - no photos)?:$/.test(paragraph.text) || /Page Design Changes:$/.test(paragraph.text)) inCopy = false;
	if (paragraph.text === 'Copy:') { inCopy = true; continue; }
	if (inCopy && paragraph.marked !== paragraph.text && !paragraph.text.startsWith('[')) copiedEmphasis.push(paragraph);
}
const wholeHeadings = new Set(content.pages.flatMap(page => [page.title, page.card.title, ...page.sections.map(section => section.heading), ...page.sections.flatMap(section => (section.cards || []).map(card => card.title))]));
const fields = [];
function collect(value) { if (typeof value === 'string') fields.push(value); else if (Array.isArray(value)) value.forEach(collect); else if (value && typeof value === 'object') Object.values(value).forEach(collect); }
collect(content);
const unaccounted = copiedEmphasis.filter(p => !fields.some(field => field === p.marked || field.split('\n').includes(p.marked)) && !wholeHeadings.has(p.text));
console.log(JSON.stringify({ changedFields: changes.length, formattedSourceParagraphs: copiedEmphasis.length, duplicateFormatting: [...new Set(conflicts)], unaccounted: unaccounted.map(p => ({ text: p.text, marked: p.marked })), changes }, null, 2));
if (unaccounted.length) process.exitCode = 1;
if (apply) {
	assert.equal(unaccounted.length, 0, 'Resolve unmatched source emphasis before applying.');
	fs.writeFileSync('data/content.json', JSON.stringify(content, null, 2) + '\n');
	fs.writeFileSync('docs/source/piet-formatting.json', JSON.stringify({ source: 'Proud Partners.doc', paragraphs: copiedEmphasis }, null, 2) + '\n');
}
