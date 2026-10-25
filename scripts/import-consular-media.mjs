// One-time import of the 25 October client delivery; no existing copy is rewritten.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('C:/Users/quint/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const sourceRoot = process.argv[2] || 'C:/Users/quint/Downloads/The Consular Ball Page Photos/The Consular Ball Page Photos';
const sourceText = fs.readFileSync(process.argv[3] || '../proud-partners-work/piet-pages-copy.txt','utf8').replaceAll('\r\n','\n');
const content = JSON.parse(fs.readFileSync('data/content.json','utf8'));
if (content.consularMediaRevision >= 1) throw Error('This delivery has already been imported.');
const years = ['2012','2013','2014','2015','2016','2017','2018','2022','2024'];
const captionFiles = {
 '2012':['70_230.JPG','71_239.JPG','72_285.JPG','73_356.JPG','81_473.JPG'],
 '2013':['60_1399.JPG','64a_1592.JPG','70_1471.JPG','59_1885.JPG','59_2015.JPG','98_1709.JPG'],
 '2014':['81_1743.JPG','82_1757.JPG','90_1806.JPG','90_1840.JPG','59_2007.JPG','59_2009.JPG','59_2164.JPG','89_2145.JPG'],
 '2015':['2015-09-26 18.38.24.jpg','2015-09-26 18.42.24.jpg','2015-09-26 19.42.17.jpg','2015-09-26 20.34.02.jpg'],
 '2016':['coetzerphoto.com-0925.JPG','coetzerphoto.com-1092.JPG','coetzerphoto.com-1193.JPG','coetzerphoto.com-1492.JPG'],
 '2017':['Michael-7.jpg','Kinderkoor-6.jpg','Navi-5.jpg','Carlos-2.jpg'],
 '2018':['CB2018(lowres)-37.jpg','Quickchange-4.jpg','CB2018(lowres)-47.jpg','CB2018(lowres)-42.jpg','Guests&rest-81.jpg','Guests&rest(highres)-3.jpg'],
 '2022':['3.jpg','4.jpg','6.jpg'],
 '2024':['CB(103).jpg','CB(131).jpg','CB(13).jpg','CB(3).jpg','CB(28).jpg','CB(16).jpg']
};
const covers = {
 '2012':'41_417.JPG', '2013':'50_1243.JPG', '2014':'90_1806.JPG',
 '2015':'2015-09-26 20.34.02.jpg', '2016':'coetzerphoto.com-0755.JPG',
 '2017':'Kinderkoor-6.jpg', '2018':'CB2018(lowres)-3.jpg', '2022':'4.jpg', '2024':'CB(6).jpg'
};
const audit = {source:'Proud Partners (1).pages', date:'2026-10-25', captions:[], years:[], notes:[
 '2014 lists 59_2007 twice. The second caption is matched to the adjacent auction-action photograph 59_2009.',
 '2017 “Micahel” identifies Michael-7.jpg; the supplied caption spelling is retained.',
 '2018 “Last photo” identifies Guests&rest(highres)-3.jpg, the supplied portrait of the two organisers.',
 'All main writing and headings match the original brief; only the new caption list is imported.'
]};
const captions = new Map();
const captionStart = sourceText.indexOf('\n2012\n',sourceText.indexOf('Every event has its stories.'));
const captionEnd = sourceText.indexOf('\nThe next chapter: 2026',captionStart);
const captionText = sourceText.slice(captionStart,captionEnd);
for (let y=0;y<years.length;y++) {
 const year=years[y];
 const start=captionText.indexOf(`\n${year}\n`)+year.length+2;
 const end=y+1<years.length?captionText.indexOf(`\n${years[y+1]}\n`,start):captionText.length;
 const lines=captionText.slice(start,end).split('\n').map(s=>s.trim()).filter(s=>s && !s.startsWith('Captions for'));
 if(lines.length!==captionFiles[year].length)throw Error(`Unexpected caption count for ${year}: ${lines.length}`);
 lines.forEach((line,index)=>{
  let text=line.replace(/^\d+\.\s+/,'');
  text=text.startsWith('Micahel.')?text.replace(/^Micahel\.\s+/,''):text.replace(/^[^:;]+[:;]\s*/,'');
  const source=`${year}/${captionFiles[year][index]}`;
  captions.set(source,text);
  audit.captions.push({year,reference:line,source,caption:text});
 });
}
if(audit.captions.length!==46)throw Error('Expected all 46 supplied captions.');
const imported=[]; const bySource=new Map();
for(const year of years){
 const output=`static/assets/consular-ball/${year}`;fs.mkdirSync(output,{recursive:true});
 const images=[];const links=[];const hashes=new Set();
 for(const file of fs.readdirSync(path.join(sourceRoot,year)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}))){
  const original=path.join(sourceRoot,year,file);const relative=`${year}/${file}`;
  const bytes=fs.readFileSync(original);const digest=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,12);
  if(/\.pdf$/i.test(file)){
   const filename=file.replace(/\.pdf$/i,'').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.pdf';
   fs.copyFileSync(original,`${output}/${filename}`);
   links.push({label:file.replace(/\.pdf$/i,'')+' (PDF)',href:`/assets/consular-ball/${year}/${filename}`});
   continue;
  }
  if(!/\.(jpe?g|png|webp)$/i.test(file))continue;
  if(hashes.has(digest))continue;hashes.add(digest);
  const processed=sharp(bytes).rotate().resize({width:2000,height:2000,fit:'inside',withoutEnlargement:true});
  const info=await processed.webp({quality:88}).toFile(`${output}/${digest}.webp`);
  const caption=captions.get(relative)||'';
  const image={id:`consular-${year}-${digest}`,src:`/assets/consular-ball/${year}/${digest}.webp`,alt:caption||`The ${year} Consular Ball — photo ${path.parse(file).name}`,caption,position:'center',source:`Consular Ball/${relative}`,width:info.width,height:info.height};
  images.push(image);imported.push(image);bySource.set(relative,image);
 }
 const page=content.pages.find(p=>p.id===`ball-${year}`);
 if(!page)throw Error(`Missing year page ${year}`);
 const gallery=page.sections.find(s=>s.layout==='gallery');
 if(!gallery)throw Error(`Missing gallery for ${year}`);
 gallery.images=images;
 page.card.image=structuredClone(bySource.get(`${year}/${covers[year]}`));
 if(!page.card.image)throw Error(`Missing cover for ${year}`);
 if(['2012','2014','2015','2017','2022','2024'].includes(year))page.card.image.position='center top';
 if(links.length)page.sections.push({id:`consular-documents-${year}`,heading:'Event documents',paragraphs:[],layout:'text',tone:'cream',images:[],videos:[],links,tileIds:[],stats:[]});
 audit.years.push({year,photos:images.length,captions:images.filter(i=>i.caption).length,documents:links.length,cover:covers[year]});
}
for(const {source} of audit.captions)if(!bySource.has(source))throw Error(`Caption photo missing: ${source}`);
const ball=content.pages.find(p=>p.id==='consular-ball');
const replacements=[['', '2024/CB(28).jpg'],['It started with an idea.','2012/50_261.JPG'],['No ordinary auction.','2013/59_1885.JPG'],['A little music. A lot of magic.','2018/CB2018(lowres)-42.jpg']];
for(const [heading,source] of replacements){const section=ball.sections.find(s=>s.heading===heading);if(!section)throw Error(`Missing Ball section ${heading}`);section.images=[structuredClone(bySource.get(source))];}
ball.card.image=structuredClone(bySource.get('2024/CB(6).jpg'));
ball.card.image.position='center top';
for(const page of content.pages)for(const section of page.sections)for(const card of section.cards||[]){if(card.id==='consular-ball')card.image=structuredClone(ball.card.image);}
const importedIds=new Set(imported.map(i=>i.id));
content.mediaLibrary=[...imported,...content.mediaLibrary.filter(i=>!importedIds.has(i.id))];
content.consularMediaRevision=1;
fs.mkdirSync('docs/source',{recursive:true});
fs.writeFileSync('docs/source/piet-2026-10-25.txt',sourceText);
fs.writeFileSync('docs/source/consular-photo-captions.json',JSON.stringify(audit,null,2)+'\n');
fs.writeFileSync('data/content.json',JSON.stringify(content,null,2)+'\n');
console.log(JSON.stringify({photos:imported.length,captions:audit.captions.length,years:audit.years},null,2));
