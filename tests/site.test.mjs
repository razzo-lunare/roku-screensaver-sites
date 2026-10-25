import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(import.meta.dirname,'..');
execFileSync(process.execPath,['tools/build.mjs'],{cwd:root});
test('only static pages and stylesheet enter the Pages webroot; all local links resolve',async()=>{
 const files=async p=>(await Promise.all((await readdir(p,{withFileTypes:true})).map(async d=>d.isDirectory()?files(join(p,d.name)):[join(p,d.name)]))).flat();
 const paths=await files(join(root,'docs'));
 assert.equal(paths.length,18);
 const assets=['assets/earth-cover.png','assets/animated-solar-system-store-cover.png','assets/earth-preview.jpg','earth/asset-provenance.json'];
 for(const p of paths){
  assert.ok(/\.(?:html|css)$|\.nojekyll$/.test(p)||assets.some(a=>p===join(root,'docs',a)));
  if(!p.endsWith('.html'))continue;
  const html=await readFile(p,'utf8');
  assert.match(html,/Public review draft/);
  assert.match(html,/noindex,nofollow/);
  assert.doesNotMatch(html,/<script\b|<form\b|<iframe\b|\{\{\w+\}\}|TO CONFIRM|not published|\/Users\//i);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  for(const [,href]of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(/^(https:|mailto:|#)/.test(href))continue;
   const local=resolve(p,'..',href);
   assert.ok(local.startsWith(join(root,'docs')+'/'));
   await access(local);
  }
 }
});
test('credits retain every complete notice and provenance record',async()=>{
 const c=JSON.parse(await readFile(join(root,'content/animated-solar-system/credits.json'),'utf8'));
 const html=await readFile(join(root,'docs/animated-solar-system/credits.html'),'utf8');
 const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 assert.equal(c.notices.length,13);
 for(const n of c.notices)assert.ok(html.includes(escape(n.text)),n.title);
 for(const source of c.provenance.sources)assert.ok(html.includes(escape(source.source)));
 assert.match(html,/Animated Solar System Proprietary License/);
 assert.match(html,/Permission is hereby granted/);
});
test('final website gate fails without claiming phone or store fields are required',()=>{
 assert.throws(()=>execFileSync(process.execPath,['tools/build.mjs','--release'],{cwd:root,stdio:'pipe'}),err=>{
  const error=err.stderr.toString();
  assert.match(error,/Final website blocked/);
  assert.match(error,/publisher policy approval/);
  assert.doesNotMatch(error,/supportPhone|domesticRegion|monetization|ageRating|madeForKids/);
  return true;
 });
});

test('collection uses canonical artwork and accurately labels Earth preview',async()=>{
 const home=await readFile(join(root,'docs/index.html'),'utf8');
 const earth=await readFile(join(root,'docs/earth/index.html'),'utf8');
 assert.match(home,/THE COLLECTION \/ 02/);
 assert.match(home,/assets\/animated-solar-system-store-cover.png/);
 assert.match(earth,/live ISS tracking are not implemented/);
 assert.match(earth,/Full image notices/);
 for(const name of ['earth-preview.jpg','earth-cover.png','animated-solar-system-store-cover.png'])assert.deepEqual(await readFile(join(root,'docs/assets',name)),await readFile(join(root,'content/assets',name)));
});

test('new product branding has current artwork and working legacy URL redirects',async()=>{
 const home=await readFile(join(root,'docs/index.html'),'utf8');
 const product=await readFile(join(root,'docs/animated-solar-system/index.html'),'utf8');
 assert.match(home,/Animated Solar System/);
 assert.match(product,/<h1>Animated Solar System<\/h1>/);
 assert.doesNotMatch(product,/UNIVERSE|UNIVERSO|UNIVERSUM/);
 const alias=await readFile(join(root,'docs/universe/privacy.html'),'utf8');
 assert.match(alias,/url=\.\.\/animated-solar-system\/privacy\.html/);
});
