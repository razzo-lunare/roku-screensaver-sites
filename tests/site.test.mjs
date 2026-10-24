import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,access,mkdtemp,cp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(import.meta.dirname,'..');
execFileSync(process.execPath,['tools/build.mjs'],{cwd:root});
test('only static pages and stylesheet enter the Pages webroot; all local links resolve',async()=>{
 const files=async p=>(await Promise.all((await readdir(p,{withFileTypes:true})).map(async d=>d.isDirectory()?files(join(p,d.name)):[join(p,d.name)]))).flat();
 const paths=await files(join(root,'docs'));
 assert.equal(paths.length,17);
 const assets=['assets/earth-cover.png','assets/universe-store-cover.png','assets/earth-preview.jpg','earth/asset-provenance.json','earth/iss-orbit.json'];
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
   const [target,hash]=href.split('#');
   const local=resolve(p,'..',target);
   assert.ok(local.startsWith(join(root,'docs')+'/'));
   await access(local);
   if(hash)assert.ok((await readFile(local,'utf8')).includes(`id="${hash}"`),`Missing fragment ${href}`);
  }
 }
});
test('credits retain every complete notice and provenance record',async()=>{
 const c=JSON.parse(await readFile(join(root,'content/universe/credits.json'),'utf8'));
 const html=await readFile(join(root,'docs/universe/credits.html'),'utf8');
 const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 assert.equal(c.notices.length,13);
 for(const n of c.notices)assert.ok(html.includes(escape(n.text)),n.title);
 for(const source of c.provenance.sources)assert.ok(html.includes(escape(source.source)));
 assert.match(html,/UNIVERSE Proprietary License/);
 assert.match(html,/Permission is hereby granted/);
 const earth=await readFile(join(root,'docs/earth/index.html'),'utf8');
 for(const file of ['image-notices.txt','earth-notices.txt','sgp4-license.txt','runtime-license.txt'])assert.ok(earth.includes(escape(await readFile(join(root,'content/earth',file),'utf8'))),file);

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
 assert.match(home,/assets\/universe-store-cover.png/);
 assert.doesNotMatch(earth,/live ISS tracking are not implemented|EARTH-specific release policies will be prepared/);
 assert.match(home,/date-based sunlight and Moon phase/);
 assert.match(earth,/Playback makes no network requests/);
 assert.match(earth,/SGP4/);
 assert.match(earth,/seven days/);
 assert.match(earth,/same projected Sun direction/);
 for(const slug of ['index','privacy','terms','support']){
  const page=await readFile(join(root,'docs/earth/'+slug+'.html'),'utf8');
  assert.match(page,/href="privacy.html"/);assert.match(page,/href="terms.html"/);
  assert.doesNotMatch(page,/href="(?:\.\.\/)?universe\//);
 }
 const privacy=await readFile(join(root,'docs/earth/privacy.html'),'utf8');
 assert.match(privacy,/GitHub controls its hosting/);
 assert.match(privacy,/local registry/);
 assert.match(privacy,/no effective date/);
 assert.match(privacy,/has not yet confirmed the email service provider/);
 assert.match(earth,/Full image notices/);
 for(const name of ['earth-preview.jpg','earth-cover.png','universe-store-cover.png'])assert.deepEqual(await readFile(join(root,'docs/assets',name)),await readFile(join(root,'content/assets',name)));
});

test('EARTH policy mode, approval gate, date and contact stay independent of UNIVERSE',async()=>{
 const temp=await mkdtemp(join(tmpdir(),'earth-site-'));
 try{
  for(const dir of ['tools','content'])await cp(join(root,dir),join(temp,dir),{recursive:true});
  const path=join(temp,'content/earth/publication.json');
  const c=JSON.parse(await readFile(path,'utf8'));
  c.publisherName='EARTH Test Publisher';c.supportEmail='earth-test@example.test';
  c.effectiveDate='2026-10-24';c.support.providerName='Test mail';c.support.privacyUrl='https://example.test/privacy';
  c.website.mode='final';c.website.policyApproval='Isolated test approval';
  for(const key of Object.keys(c.reviews))c.reviews[key]=true;
  await writeFile(path,JSON.stringify(c));
  execFileSync(process.execPath,['tools/build.mjs'],{cwd:temp});
  const earth=await readFile(join(temp,'docs/earth/privacy.html'),'utf8');
  const overview=await readFile(join(temp,'docs/earth/index.html'),'utf8');
  const universe=await readFile(join(temp,'docs/universe/privacy.html'),'utf8');
  assert.match(earth,/Effective: 2026-10-24/);assert.doesNotMatch(earth,/Public review draft/);
  assert.match(earth,/EARTH Test Publisher/);assert.match(earth,/mailto:earth-test@example.test/);
  assert.doesNotMatch(overview,/mailto:thomas/);
  assert.match(universe,/Public review draft/);assert.doesNotMatch(universe,/earth-test@example.test/);
  c.website.mode='unknown';await writeFile(path,JSON.stringify(c));
  assert.throws(()=>execFileSync(process.execPath,['tools/build.mjs'],{cwd:temp,stdio:'pipe'}),e=>/Unknown EARTH website mode/.test(e.stderr.toString()));
 }finally{await rm(temp,{recursive:true,force:true});}
});
