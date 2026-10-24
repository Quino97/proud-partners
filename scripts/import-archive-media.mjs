// Recovers media URLs from the old site's static page data, without executing it.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const sharp=createRequire(import.meta.url)('C:/Users/quint/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const archive=JSON.parse(fs.readFileSync('../proud-partners-work/recovered-archive.json','utf8'));
const content=JSON.parse(fs.readFileSync('data/content.json','utf8'));
const freshSection=(heading='',layout='text')=>({id:crypto.randomUUID(),heading,paragraphs:[],layout,tone:'cream',images:[],videos:[],links:[],tileIds:[],stats:[]});
const failures=[];
fs.mkdirSync('static/assets/ball-archive',{recursive:true});
for(const entry of archive.filter(e=>e.title.startsWith('Ball '))){
 const year=entry.title.replace('Ball ','');const page=content.pages.find(p=>p.id===`ball-${year}`);if(!page)continue;
 const candidates=entry.special.filter(s=>s.type==='image').map(s=>s.elementProperties.imageUrl).filter(i=>i?.imagePath&&!/header|footer|bar\.|logo/i.test(i.imagePath));
 const unique=[...new Map(candidates.map(i=>[i.imagePath,i])).values()];
 const photos=unique.filter(i=>i.imageWidth/i.imageHeight>.85);
 const pool=photos.length?photos:unique;
 const selected=pool.length<=18?pool:[...new Set([...pool.slice(0,7),...Array.from({length:11},(_,i)=>pool[Math.floor((i+1)*(pool.length-1)/11)])])];
 const images=[];
 for(const item of selected){
  const url=item.imagePath.startsWith('https://')?item.imagePath:`https://storage.googleapis.com/wzukusers/user-${item.ownerID||21717408}/images/${item.imagePath}`;
  const id=crypto.createHash('sha256').update(url).digest('hex').slice(0,12);const src=`/assets/ball-archive/${year}-${id}.webp`;
  try{if(!fs.existsSync('static'+src)){const response=await fetch(url);if(!response.ok)throw Error(String(response.status));const bytes=Buffer.from(await response.arrayBuffer());await sharp(bytes).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:87}).toFile('static'+src);}const image={id,src,alt:`Consular Ball ${year}`,caption:'',position:'center',source:`Consular Ball archive/${year}/${item.imagePath.split('/').at(-1)}`};images.push(image);if(!content.mediaLibrary.some(i=>i.src===src))content.mediaLibrary.push(image);}catch(error){failures.push({year,url,message:String(error)});}
 }
 const gallery=freshSection('','gallery');gallery.images=images;
 page.sections=[gallery];
 if(images.length)page.card.image=images[0];
 const videos=entry.special.filter(s=>s.type==='VideoPlayer').map(s=>s.elementProperties.videoUrl).filter(Boolean);
 if(videos.length){const section=freshSection('','video');section.videos=[{url:videos[0],caption:'',poster:''}];page.sections.push(section);}
 console.log(year,images.length,'photos');
}
// No 2024 album was supplied, and the old site's archive stops in 2022.
const year2024=content.pages.find(p=>p.id==='ball-2024');year2024.sections=[];year2024.card.image={id:'ball-2024-mark',src:content.media.mark,alt:'Proud Partners',caption:'',position:'center'};year2024.card.subtitle='R900,000';
const home=content.pages.find(p=>p.id==='home');
const homeVideo=freshSection('','video');homeVideo.videos=[{url:'https://youtu.be/0yRNGcmamGU',caption:'',poster:home.heroImage.src}];home.sections=home.sections.filter(s=>s.layout!=='video');home.sections.push(homeVideo);
const kinder=content.pages.find(p=>p.id==='kinders-vir-die-koning');
if(!kinder.sections.some(s=>s.videos.length)){const video=freshSection('','video');video.videos=homeVideo.videos;kinder.sections.push(video);}
const choir=content.pages.find(p=>p.id==='stellenbosch-university-choir');
choir.sections=choir.sections.filter(s=>s.layout!=='video');const choirVideos=freshSection('','video');
choirVideos.videos=[{url:'https://youtu.be/W3-Y69zUgnw',caption:'Amateur video of the choir singing the Russian anthem at their National Day Celebrations in Cape Town',poster:''},{url:'https://youtu.be/7tOIsGNUMtM',caption:'The choir winning another of their 3 categories',poster:''}];choir.sections.push(choirVideos);
const david=content.pages.find(p=>p.id==='david-cyster');david.sections.flatMap(s=>s.links).find(l=>l.label==='Watch David Perform →').href='https://www.youtube.com/channel/UC7kVu1V1mdgVykInAy-EivA/videos';
const ball=content.pages.find(p=>p.id==='consular-ball');
const eventPhoto=year=>content.pages.find(p=>p.id===`ball-${year}`)?.sections[0]?.images.find(i=>!i.source.includes('/02.jpg'));
ball.sections.find(s=>s.heading==='It started with an idea.').images=[eventPhoto('2013')].filter(Boolean);ball.sections.find(s=>s.heading==='It started with an idea.').layout='split';
ball.sections.find(s=>s.heading==='No ordinary auction.').images=[eventPhoto('2015')].filter(Boolean);ball.sections.find(s=>s.heading==='No ordinary auction.').layout='split';
ball.sections.find(s=>s.heading==='A little music. A lot of magic.').images=[content.mediaLibrary.find(i=>i.source?.includes('Tygerberg Childrens Choir/')&&i.source.includes('4.26.05'))].filter(Boolean);ball.sections.find(s=>s.heading==='A little music. A lot of magic.').layout='split';
ball.sections.find(s=>s.layout==='stats').heading='Amounts raised for the combined charitable beneficiaries';
const main=content.pages.find(p=>p.id==='projects');const domestic=content.pages.find(p=>p.id==='domestic-partnership');main.sections.find(s=>s.layout==='tiles').cards=[{...domestic.card,id:domestic.id,title:'Domestic Project'}];
fs.writeFileSync('data/content.json',JSON.stringify(content,null,2)+'\n');
fs.writeFileSync('docs/source/archive-media.json',JSON.stringify({videos:archive.filter(e=>['Kinders vir die Koning','Stellenbosch University Choir','David Cyster'].includes(e.title)).map(e=>({page:e.title,urls:e.special.filter(s=>s.type==='VideoPlayer').map(s=>s.elementProperties.videoUrl)})),images:content.mediaLibrary.filter(i=>i.source?.startsWith('Consular Ball archive/')),failures},null,2)+'\n');
console.log(JSON.stringify({failures,images:content.mediaLibrary.length}));
