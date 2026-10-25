import fs from 'node:fs';
import { plainText } from '../src/lib/utils/rich-text.ts';
const source=fs.readFileSync('docs/source/piet-2026-10-24.txt','utf8').replace(/\x13[^\x14]*\x14([^\x15]*)\x15/g,'$1');
const content=JSON.parse(fs.readFileSync('data/content.json','utf8'));
const values=[],formattedValues=[];function strings(item){if(typeof item==='string'){formattedValues.push(item);values.push(plainText(item));}else if(Array.isArray(item))item.forEach(strings);else if(item&&typeof item==='object')Object.values(item).forEach(strings);}strings(content);
const starts=[...source.matchAll(/^(.+?) Page(?: - no photos)?:\s*$/gm)];
const missing=[];let verified=0;
for(let i=0;i<starts.length;i++){if(starts[i][1]==='Contact')continue;let text=source.slice(starts[i].index+starts[i][0].length,starts[i+1]?.index||source.length);const at=text.indexOf('Copy:');if(at<0)continue;text=text.slice(at+5).split(/\n[^\n]*Page Design Changes:\s*\n/)[0];for(const paragraph of text.split(/\n+/).map(p=>p.trim()).filter(Boolean)){if(paragraph.startsWith('['))continue;if(values.some(s=>s.includes(plainText(paragraph))))verified++;else missing.push({page:starts[i][1],paragraph});}}
const localPaths=[...new Set(values.filter(s=>s.startsWith('/assets/')))];const missingFiles=localPaths.filter(p=>!fs.existsSync('static'+p));
const brokenTiles=content.pages.flatMap(p=>p.sections.flatMap(s=>s.tileIds.filter(id=>!content.pages.some(p=>p.id===id)).map(id=>({page:p.id,id}))));
const sourceFormatting=JSON.parse(fs.readFileSync('docs/source/piet-formatting.json','utf8')).paragraphs;
const headings=new Set(content.pages.flatMap(p=>[p.title,p.card.title,...p.sections.map(s=>s.heading),...p.sections.flatMap(s=>(s.cards||[]).map(c=>c.title))]));
const missingFormatting=sourceFormatting.filter(p=>!formattedValues.some(value=>value===p.marked||value.split('\n').includes(p.marked))&&!headings.has(p.text)).map(p=>p.text);
console.log(JSON.stringify({verifiedParagraphs:verified,verifiedFormattingParagraphs:sourceFormatting.length-missingFormatting.length,missingCopy:missing,missingFormatting,missingFiles,brokenTiles,projectTiles:content.pages.find(p=>p.id==='projects').sections.find(s=>s.layout==='tiles').tileIds,categoryCounts:Object.fromEntries(['education','music','child-care'].map(id=>[id,content.pages.find(p=>p.id===id).sections.find(s=>s.layout==='tiles').tileIds.length]))},null,2));
if(missing.length||missingFormatting.length||missingFiles.length||brokenTiles.length)process.exitCode=1;
