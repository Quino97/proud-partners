import fs from 'node:fs';
import crypto from 'node:crypto';
const content=JSON.parse(fs.readFileSync('data/content.json','utf8'));
const art=content.pages.find(p=>p.id==='art');
const choices=[['2016',0],['2017',2],['2018',1],['2019',2]];
for(let index=0;index<choices.length;index++){
 const [year,photoIndex]=choices[index];const source=art.sections.find(s=>s.heading===year);if(!source?.images.length||art.sections[index].images.length)continue;
 const [image]=source.images.splice(Math.min(photoIndex,source.images.length-1),1);art.sections[index].images=[image];art.sections[index].layout='split';
}
for(const id of ['education','music','child-care']){
 const page=content.pages.find(p=>p.id===id);const first=page.sections[0];
 if(first.images.length){const gallery={id:crypto.randomUUID(),heading:'',paragraphs:[],layout:'gallery',tone:'cream',images:first.images,videos:[],links:[],tileIds:[],stats:[]};first.images=[];page.sections.splice(2,0,gallery);}
}
fs.writeFileSync('data/content.json',JSON.stringify(content,null,2)+'\n');
console.log('Editorial photos placed between story sections; category tiles now follow introductions.');
