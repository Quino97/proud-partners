// One-time, reproducible import. The brief's copy is never rewritten or summarised.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('C:/Users/quint/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = process.cwd();
const photoRoot = process.argv[2] || 'C:/Users/quint/Downloads/Proud Partners Website/Photos';
const sourcePath = process.argv[3] || '../proud-partners-work/piet-copy.txt';
const raw = fs.readFileSync(sourcePath, 'utf8');
const source = raw.replace(/\x13[^\x14]*\x14([^\x15]*)\x15/g, '$1');
const old = JSON.parse(fs.readFileSync('data/content.json', 'utf8'));
if (old.contentVersion >= 3) throw Error('Import already completed. Restore an archived original before re-importing.');
fs.copyFileSync('data/content.json', '../proud-partners-work/content-before-piet.json');
fs.mkdirSync('docs/source', { recursive: true });
fs.copyFileSync(sourcePath, 'docs/source/piet-2026-10-24.txt');
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
const allFiles = walk(photoRoot).filter(f => /\.(png|jpe?g|webp)$/i.test(f)).sort();
const mediaLibrary = [];
const assets = new Map();
fs.mkdirSync('static/assets/piet', { recursive: true });
for (const file of allFiles) {
 const rel = path.relative(photoRoot, file).replaceAll('\\', '/');
 const digest = crypto.createHash('sha256').update(rel).digest('hex').slice(0, 10);
 const slug = rel.split('/')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
 const filename = `${slug}-${digest}.webp`;
 const metadata = await sharp(file).metadata();
 if(!fs.existsSync(`static/assets/piet/${filename}`)) await sharp(file).rotate().resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:88}).toFile(`static/assets/piet/${filename}`);
 const image = { id:digest, src:`/assets/piet/${filename}`, alt:rel.split('/')[0], caption:'', position:'center', source:rel, width:metadata.width, height:metadata.height };
 assets.set(rel, image); mediaLibrary.push(image);
}
function photos(folder) { return [...assets].filter(([f]) => f.startsWith(folder+'/')).map(([,a]) => structuredClone(a)); }
function one(folder) { return photos(folder)[0]; }
function selected(folder, contains) { return photos(folder).find(i=>i.source.includes(contains)) || one(folder); }
function archive(src, alt) { const image={ id:crypto.createHash('sha256').update(src).digest('hex').slice(0,10),src,alt,caption:'',position:'center',source:'Existing website archive' }; if(!mediaLibrary.some(i=>i.src===src))mediaLibrary.push(image); return structuredClone(image); }
const sectionStarts = [...source.matchAll(/^(.+?) Page(?: - no photos)?:\s*$/gm)];
const copies = new Map();
for (let i=0;i<sectionStarts.length;i++) {
 const match=sectionStarts[i]; let chunk=source.slice(match.index+match[0].length, sectionStarts[i+1]?.index ?? source.length);
 const at=chunk.indexOf('Copy:'); if(at<0)continue;
 chunk=chunk.slice(at+5).split(/\n[^\n]*Page Design Changes:\s*\n/)[0];
 copies.set(match[1],chunk.split(/\n+/).map(p=>p.trim()).filter(Boolean));
}
const pages=[];
const section=(heading='',paragraphs=[],layout='text',extras={})=>({id:crypto.randomUUID(),heading,paragraphs,layout,tone:'cream',images:[],videos:[],links:[],tileIds:[],stats:[],...extras});
function page(id,title,subtitle='',parentId='',extras={}) { const item={id,path:id==='home'?'/':id==='about'?'/about':id==='projects'?'/projects':id==='consular-ball'?'/consular-ball':id==='contact'?'/contact':`/projects/${id}`,parentId,title,subtitle,description:'',kind:'story',hidden:false,heroImage:null,card:{title,subtitle,copy:'',label:'Explore Project →',image:null},sections:[],...extras};pages.push(item);return item; }
const headings = {
 'Kinders vir die Koning':['Where the need was greatest','Two mornings a week. A world of possibilities.','Making room for everyone','From containers to classrooms','A little diplomacy. A lot of goodwill.','At last, a place to call their own','A partnership that continues'],
 'Domestic Partnership':['A working relationship.','Sometimes, the smallest things matter.','Practical ideas for everyday life.','A philosophy that still matters.'],
 'David Cyster':['An instrument out of reach.','And the music played on.','A proud partnership indeed.'],
 'PJO Art Tracks':['Art in unexpected places.','Four years of extraordinary imagination.','More than a splash of colour.'],
 'The Consular Ball':['It started with an idea.','No ordinary auction.','A little music. A lot of magic.','An evening that keeps on giving.','Every event has its stories.','The next chapter: 2026'],
 'About':['A partnership worth celebrating','From an idea to a purpose','The first steps','A shared commitment.','The story continues']
};
function narrative(target, paragraphs, names=[], images=[]) {
 let current=section(); target.sections.push(current);
 for(const p of paragraphs) {
  if(names.includes(p)) { current=section(p); target.sections.push(current); }
  else if(/→$/.test(p)) current.links.push({label:p,href:''});
  else if(/^https?:\/\//.test(p)||/^www\./.test(p)) { const link=current.links.at(-1); if(link)link.href=p.startsWith('www.')?'https://'+p:p; }
  else if(!p.startsWith('[')) current.paragraphs.push(p);
 }
 target.sections=target.sections.filter(s=>s.heading||s.paragraphs.length||s.links.length);
 images.forEach((image,index)=>{const block=target.sections[Math.min(index,target.sections.length-1)]; block.images.push(image); if(block.images.length===1)block.layout='split';});
 for(const s of target.sections) if(s.images.length>2) s.layout='gallery';
 target.description=paragraphs.find(p=>p.length>80&&!p.startsWith('['))||target.subtitle||target.title;
}
const stories=[
 ['kinders-vir-die-koning','Kinders vir die Koning','Kinders vir die Koning Page','education',true],
 ['end-period-poverty','#EndPeriodPoverty','#EndPeriodPoverty','education',true],
 ['temperance-town','Temperance Town Primary School','Temperance Town Page','education',false],
 ['stellenzicht-reading','Stellenzicht Secondary School Reading Project','Stellenzicht','education',true],
 ['mathematics-support','Mathematics Support Project','Mathematics Support Page','education',true],
 ['girl-talk','Girl Talk Initiative Project','Girl Talk Page','education',true],
 ['domestic-partnership','Domestic Partnership','Domestic Partnership','projects',true],
 ['david-cyster','David Cyster','David Cyster','music',true],
 ['stellenbosch-university-choir','Stellenbosch University Choir','Stellenbosch University Choir','music',true],
 ['tygerberg-childrens-choir','Tygerberg Children’s Choir','Tygerberg Childrens Choir','music',false],
 ['junior-rosa-choir','Junior Rosa Choir','Junior Rosa Choir','music',true],
 ['5th-st-peters-scouts','The 5th St Peter’s Scouts',"5th St Peter's Scouts",'music',true],
 ['instrument-donors','Instrument Donors','Instrument Donors','music',true],
 ['artscape-wellington-youth-band','Artscape Wellington Youth Band','Artscape Wellington Youth Band','music',true],
 ['durbanville-childrens-home','Durbanville Children’s Home',"Durbanville Children's Home",'music',true],
 ['soyisile-primary-school','Soyisile Primary School','Soyisile Primary School','music',true],
 ['belhar','The Belhar Project','The Belhar Project','music',true],
 ['ermelo-music','Ermelo Music Project','Ermelo Music Project','music',true],
 ['pick-a-pal','Pick a Pal','Pick A Pal','music',true],
 ['iris-house','Iris House Children’s Hospice',"Iris House Children's Hospice",'child-care',true],
 ['st-josephs',"St Joseph's Home for Chronically Ill Children","St Joseph's Home for Chronically Ill Children",'child-care',true],
 ['operation-smile','Operation Smile','Operation Smile','child-care',true],
 ['cableway-charity-challenge','The Cableway Charity Challenge','Cableway Charity Challenge','child-care',true],
 ['art','PJO Art Tracks','PJO Art Tracks Page','projects',true]
];
for(const [id,key,folder,parent,hasSubtitle] of stories) {
 const copy=[...copies.get(key)];const title=copy.shift();
 let subtitle='';if(id==='david-cyster') {const meta=copy.shift();subtitle=copy.shift();copy.unshift(meta);} else if(hasSubtitle)subtitle=copy.shift();
 const p=page(id,title,subtitle,parent);
 let imgs=id==='end-period-poverty'?[]:photos(folder);
 if(id==='art') imgs=imgs.filter(i=>!i.source.includes('/2026/'));
 narrative(p,copy,headings[key]||[],id==='art'?[]:imgs);
 if(id==='david-cyster') p.sections[0].paragraphs=p.sections[0].paragraphs.filter(t=>t!=='Music Projects | Kuils River, Western Cape');
 if(id==='david-cyster')p.subtitle='Music Projects | Kuils River, Western Cape\n'+subtitle;
 if(id==='art') for(const year of ['2016','2017','2018','2019','2026']) p.sections.push(section(year,[],'gallery',{images:photos(`${folder}/${year}`)}));
 p.card.image=imgs.find(i=>!/(newspaper|women|russia)/i.test(i.source))||null;
 if(id==='kinders-vir-die-koning')p.sections.at(-1).links.at(-1).href='https://kindersvandiekoning.co.za/';
}
function findTitle(title) { const aliases={'Stellenzicht Reading Project':'stellenzicht-reading','Girl Talk by BecomingKids':'girl-talk','Cableway Charity Challenge':'cableway-charity-challenge'};if(aliases[title])return pages.find(p=>p.id===aliases[title]);const plain=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');return pages.find(p=>plain(p.title)===plain(title)||plain(p.card.title)===plain(title)); }
function tilesFrom(copy,start,end,folder) {
 const paragraphs=copy.slice(start,end);const ids=[];let chunk=[];
 for(const p of paragraphs) { chunk.push(p);if(/→$/.test(p)) { const [title,subtitle,...rest]=chunk; const cta=rest.pop();const item=findTitle(title);if(!item)throw Error('No tile page for '+title);item.card={...item.card,title,subtitle,copy:rest.join('\n\n'),label:cta};if(folder){const expected=photos(folder).find(i=>i.source.toLowerCase().includes(title.toLowerCase().replaceAll("’","'")))||photos(folder).find(i=>i.source.split('/').slice(-2,-1)[0].toLowerCase().startsWith(title.toLowerCase().slice(0,10)));if(expected)item.card.image=expected;}ids.push(item.id);chunk=[];} }
 return ids;
}
for(const [id,key,title,folder] of [
 ['education','Educational Projects','Educational Projects','Educational Projects Page'],
 ['music','Music Projects','Music Projects','Music Projects Page'],
 ['child-care','Childcare Projects','Childcare Projects','Childcare Projects Page']
]) {
 const copy=[...copies.get(key)];let introTitle=copy.shift();if(id==='child-care'){introTitle=copy.shift();}
 const tileStart=copy.findIndex(p=>['Kinders vir die Koning','David Cyster',"Iris House Children's Hospice"].includes(p));
 const tileEnd=id==='music'?copy.findIndex(p=>p.startsWith('[The one below')):copy.length;
 const item=page(id,introTitle,'','projects',{kind:'landing'});item.card.title=title;
 item.sections=[section('',copy.slice(0,tileStart)),section('',[],'tiles',{tileIds:tilesFrom(copy,tileStart,tileEnd,folder)})];
 item.description=copy[0];
 const landingPhotos=photos(`${folder}/${title} Photos`);
 if(landingPhotos.length)item.sections[0].images=landingPhotos;
 if(id==='music') {const extra=copy.slice(tileEnd+1);item.sections.push(section(extra.shift(),extra,'gallery',{images:photos('Music Projects Page/Lesedi Fish & Chips')}));}
}
// Exact tile choices provided in each dedicated folder take precedence.
const tileAssignments={
 'kinders-vir-die-koning':['Educational Projects Page/7 Project Tiles Photos/Kinders vir die Koning'],
 'end-period-poverty':['Educational Projects Page/7 Project Tiles Photos/#EndPeriodPoverty'],
 'temperance-town':['Educational Projects Page/7 Project Tiles Photos/Temperance Town'],
 'stellenzicht-reading':['Educational Projects Page/7 Project Tiles Photos/Stellenzicht Reading Project'],
 'mathematics-support':['Educational Projects Page/7 Project Tiles Photos/Mathematics Support Project'],
 'girl-talk':['Educational Projects Page/7 Project Tiles Photos/Girl Talk'],
 'domestic-partnership':['Educational Projects Page/7 Project Tiles Photos/Domestic Partnership'],
 'iris-house':['Childcare Projects Page/4 Projects Tiles Photos/Iris House'],
 'st-josephs':['Childcare Projects Page/4 Projects Tiles Photos/St Josephs'],
 'operation-smile':['Childcare Projects Page/4 Projects Tiles Photos/Operation Smile'],
 'cableway-charity-challenge':['Childcare Projects Page/4 Projects Tiles Photos/Cableway']
};
for(const p of pages) {const assigned=tileAssignments[p.id];if(assigned) p.card.image=one(assigned[0])||p.card.image;if(p.parentId==='music'){const match=photos('Music Projects Page/12 Project Tiles Photos').find(i=>i.source.split('/')[2].replaceAll('’',"'").toLowerCase()===p.title.replaceAll('’',"'").toLowerCase());if(match)p.card.image=match;}}
const mainCopy=copies.get('Projects');const main=page('projects',mainCopy[0],'','',{kind:'landing'});
const mainTiles=tilesFrom(mainCopy,3,mainCopy.length);
mainTiles.push('domestic-partnership');
main.sections=[section('',mainCopy.slice(1,3)),section('',[],'tiles',{tileIds:mainTiles})];main.description=mainCopy[1];
for(const id of ['education','music','child-care']){const p=pages.find(p=>p.id===id);p.card.image=p.sections[0].images[0]||archive(old.projects.find(s=>s.slug===id).image,p.card.title);}
const art=pages.find(p=>p.id==='art');art.card.image=selected('Home Page/Photos/Project Tiles','1.21.28');
const aboutCopy=[...copies.get('About')];const about=page('about',aboutCopy.shift(),aboutCopy.shift(),'');
narrative(about,aboutCopy,headings.About,[]);
about.sections[0].images=[selected('About Page/Photos','2.04.41')];about.sections[0].layout='split';
about.sections[1].images=[selected('About Page/Photos','2.03.30')];about.sections[1].layout='split';
about.sections[2].images=[selected('About Page/Photos','2.02.32')];about.sections[2].layout='split';
about.sections[3].images=[selected('About Page/Photos','5790852')];about.sections[3].layout='split';
about.sections[4].images=[selected('About Page/Photos','Newspaper')];about.sections[4].layout='split';
about.sections.at(-1).links[0].href='/projects';
const ballCopy=[...copies.get('The Consular Ball')];const ball=page('consular-ball',ballCopy.shift(),ballCopy.shift(),'home',{kind:'ball'});
narrative(ball,ballCopy.filter(p=>!/^\d{4}$/.test(p)),headings['The Consular Ball'],[]);
ball.card.image=selected('Home Page/Photos/Project Tiles','ConBal');
ball.sections[0].images=[ball.card.image];ball.sections[0].layout='split';
const ballYears=['2012','2013','2014','2015','2016','2017','2018','2022','2024'];
for(const year of ballYears){const legacy=old.consularBall.years.find(y=>y.year===year);const p=page(`ball-${year}`,year,'','consular-ball',{path:`/consular-ball/${year}`,kind:'year'});const image=legacy?.image?archive(legacy.image,legacy.imageAlt||`Consular Ball ${year}`):archive('/assets/images/consular-2022.jpg',`Consular Ball ${year}`);p.card={title:year,subtitle:'',copy:'',label:'',image};p.sections=[section('',[],'gallery',{images:[image]})];}
const years=ball.sections.find(s=>s.heading==='Every event has its stories.');years.layout='tiles';years.tileIds=ballYears.map(y=>'ball-'+y);
const stats=section('',[],'stats',{tone:'blue',stats:['2012 — R205,000','2018 — More than R1 million','2022 — R1.8 million','2024 — R900,000','More than R7 million cumulative']});
ball.sections.splice(ball.sections.findIndex(s=>s.heading==='Every event has its stories.'),0,stats);
ball.sections.find(s=>s.heading==='No ordinary auction.').images=[archive('/assets/images/consular-banner-branded.png','The Consular Ball')];
const homeCopy=[...copies.get('Home')];const home=page('home',homeCopy.shift(),'','',{kind:'home'});
home.heroImage=selected('Kinders vir die Koning Page','2.27.05');home.heroImage.position='50% 35%';
home.sections=[section('',[homeCopy.shift()]),section(homeCopy.shift(),[homeCopy.shift()],'tiles')];
const homeTileEnd=homeCopy.indexOf('It began with a certificate.');
const homeTiles=[];
for(let i=0;i<homeTileEnd;i+=4){const [title,subtitle,copy,label]=homeCopy.slice(i,i+4);const item=findTitle(title);if(!item)throw Error('Missing home card '+title);homeTiles.push({...item.card,title,subtitle,copy,label,id:item.id});}
home.sections[1].tileIds=homeTiles.map(t=>t.id);
// Home feature cards intentionally have distinct copy from category cards.
home.sections[1].cards=homeTiles;
home.sections[1].cards[0].image=selected('Home Page/Photos/Project Tiles','20141203');
home.sections[1].cards[1].image=selected('Home Page/Photos/Project Tiles','1.21.28');
home.sections[1].cards[2].image=selected('Home Page/Photos/Project Tiles','ConBal');
home.sections.push(section('',[],'stats',{tone:'blue',stats:['Established 2004','Western Cape','Partnership']}));
const remaining=homeCopy.slice(homeTileEnd);let block;
for(const p of remaining){if(['It began with a certificate.','A little time. A little kindness. A lot can happen.'].includes(p)){block=section(p);home.sections.push(block);}else if(p.endsWith('→'))block.links.push({label:p,href:p.startsWith('Discover')?'/about':'/projects'});else block.paragraphs.push(p);}
home.sections[3].images=[selected('About Page/Photos','2.04.41')];home.sections[3].layout='split';
if(old.site.home.videoUrl)home.sections.push(section('',[],'video',{videos:[{url:old.site.home.videoUrl,caption:'',poster:old.media.videoPoster}]}));
home.description=home.sections[0].paragraphs[0];
const contact=page('contact','Contact','','',{kind:'contact'});contact.description='Contact Proud Partners.';
const content={contentVersion:3,site:{name:'Proud Partners',description:home.description,location:'Western Cape, South Africa',footerTagline:'Partnership over charity.',navigation:[{label:'Home',href:'/'},{label:'About',href:'/about'},{label:'Projects',href:'/projects'},{label:'Consular Ball',href:'/consular-ball'},{label:'Contact',href:'/contact'}]},media:{wordmark:old.media.wordmark,mark:old.media.mark,homeQuote:home.heroImage.src},pages:[home,about,main,...pages.filter(p=>!['home','about','projects'].includes(p.id))],mediaLibrary,contact:{functionName:'contact',fields:{name:'Name',email:'Email',subject:'Subject',message:'Message',submit:'Send message'},successMessage:'Thank you. Your message has been sent.',errorMessage:'Your message could not be sent. Please try again later.'}};
fs.writeFileSync('data/content.json',JSON.stringify(content,null,2)+'\n');
fs.writeFileSync('docs/source/photo-map.json',JSON.stringify(mediaLibrary.map(i=>({source:i.source,src:i.src})),null,2)+'\n');
console.log(JSON.stringify({pages:content.pages.length,photos:mediaLibrary.length,projectStories:stories.length,missingCardImages:pages.filter(p=>!['home','about','contact','projects'].includes(p.id)&&!p.card.image).map(p=>p.id)}));
