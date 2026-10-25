import fs from 'node:fs';
import assert from 'node:assert/strict';
import { upgradeConsularMedia } from '../src/lib/content/consular-media.ts';

const content=JSON.parse(fs.readFileSync('data/content.json','utf8'));
const audit=JSON.parse(fs.readFileSync('docs/source/consular-photo-captions.json','utf8'));
const source=fs.readFileSync('docs/source/piet-2026-10-25.txt','utf8');
let photos=0,documents=0;
for(const item of audit.years){
 const page=content.pages.find(p=>p.id===`ball-${item.year}`);
 const images=page.sections.filter(s=>s.layout==='gallery').flatMap(s=>s.images);
 assert.equal(images.length,item.photos);
 assert.equal(new Set(images.map(i=>i.src)).size,images.length,'Duplicate photo in year gallery');
 for(const image of images)assert.ok(fs.existsSync('static'+image.src),image.src);
 assert.ok(page.card.image.source.endsWith(`${item.year}/${item.cover}`),'Cover belongs to the correct year');
 for(const link of page.sections.flatMap(s=>s.links).filter(link=>link.href.endsWith('.pdf'))){assert.ok(fs.existsSync('static'+link.href));documents++;}
 photos+=images.length;
}
for(const entry of audit.captions){
 const image=content.pages.find(p=>p.id===`ball-${entry.year}`).sections.flatMap(s=>s.images).find(i=>i.source===`Consular Ball/${entry.source}`);
 assert.equal(image?.caption,entry.caption,entry.source);
 assert.ok(source.includes(entry.caption),'Caption must remain word for word');
}
assert.equal(photos,118);assert.equal(audit.captions.length,46);assert.equal(documents,19);

const old=structuredClone(content);delete old.consularMediaRevision;
old.mediaLibrary=old.mediaLibrary.filter(i=>!i.id.startsWith('consular-'));
const home=old.pages.find(p=>p.id==='home');home.subtitle='Existing editor changes stay';
for(const p of old.pages.filter(p=>p.kind==='year')){
 p.sections=p.sections.filter(s=>!s.id.startsWith('consular-documents-'));
 for(const s of p.sections.filter(s=>s.layout==='gallery'))s.images=[];
}
const before=structuredClone(old);
const upgraded=upgradeConsularMedia(old,content);
assert.deepEqual(old,before,'Migration must not mutate the saved record');
assert.equal(upgraded.pages.find(p=>p.id==='home').subtitle,'Existing editor changes stay');
assert.equal(upgraded.pages.find(p=>p.id==='ball-2024').sections.flatMap(s=>s.images).length,19);
const edited=structuredClone(upgraded);
const gallery=edited.pages.find(p=>p.id==='ball-2024').sections.find(s=>s.layout==='gallery');
gallery.images[0].caption='A caption edited in admin';gallery.images.pop();
assert.deepEqual(upgradeConsularMedia(edited,content),edited,'Future caption edits and removals must be retained');
console.log(JSON.stringify({photos,captions:audit.captions.length,documents,migration:'Old drafts upgraded; later admin edits retained'},null,2));
