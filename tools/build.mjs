import {readFile,writeFile,mkdir,rm,cp} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
export const escapeHtml=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function websiteIssues(c){
 const issues=[];
 for(const key of ['publisherName','supportEmail','effectiveDate'])if(!c[key])issues.push(key);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(c.effectiveDate||'')||!Number.isFinite(Date.parse(c.effectiveDate))||new Date(c.effectiveDate).toISOString().slice(0,10)!==c.effectiveDate)issues.push('valid effectiveDate');
 for(const key of ['providerName','privacyUrl'])if(!c.support?.[key])issues.push('support.'+key);
 if(!c.website?.policyApproval||!c.reviews?.policiesApproved)issues.push('publisher policy approval');
 for(const key of ['assetRightsReviewed','namesReviewed','languageCoverageReviewed'])if(!c.reviews?.[key])issues.push('reviews.'+key);
 return [...new Set(issues)];
}
const c=JSON.parse(await readFile(new URL('content/universe/publication.json',root),'utf8'));
const credits=JSON.parse(await readFile(new URL('content/universe/credits.json',root),'utf8'));
const earthConfig=JSON.parse(await readFile(new URL('content/earth/publication.json',root),'utf8'));
const release=process.argv.includes('--release');
const configs={UNIVERSE:c,EARTH:earthConfig};
const issues=Object.entries(configs).flatMap(([name,config])=>websiteIssues(config).map(i=>name+' '+i));
for(const [name,config] of Object.entries(configs)){
 if(!['review','final'].includes(config.website.mode))throw Error('Unknown '+name+' website mode');
 if((release||config.website.mode==='final')&&websiteIssues(config).length)throw Error('Final website blocked: '+name+' '+websiteIssues(config).join(', '));
}
const draft=c.website.mode!=='final';
const e=escapeHtml;
const contact=`<a href="mailto:${e(c.supportEmail)}">${e(c.supportEmail)}</a>`;
const publicLink=(url,label)=>{if(!/^https:\/\//.test(url))throw Error('HTTPS reference required');return `<a href="${e(url)}">${e(label)}</a>`;};
const replacements={publisherName:e(c.publisherName),supportContact:contact,hostingProvider:e(c.hosting.providerName),hostingLogs:e(c.hosting.operationalLogs),hostingPrivacyLink:publicLink(c.hosting.privacyUrl,'GitHub privacy statement'),supportAccess:e(c.support.authorizedAccess),supportRetention:e(c.support.retention),supportProviderNotice:c.support.providerName?`<p>Email service provider: ${e(c.support.providerName)}. ${publicLink(c.support.privacyUrl,'Email provider privacy policy')}. Email delivery providers process messages to provide their services.</p>`:'<p class="review-note">Review item: the publisher has not yet confirmed the email service provider and its privacy information.</p>',creditsSections:credits.notices.map(n=>`<section><h2>${e(n.title)}</h2><pre>${e(n.text)}</pre></section>`).join('\n')+`<section><h2>Map provenance</h2><p>Source URLs, rights evidence and limitations from the app credit inputs.</p><pre>${e(JSON.stringify(credits.provenance,null,2))}</pre></section>`};
const pages={index:'UNIVERSE',support:'Support',privacy:'Privacy notice',terms:'Terms of use',credits:'Credits and licenses'};
const reviewBanner='<aside class="draft"><strong>Public review draft</strong><p>This website is prepared for public publisher review. Privacy and terms are proposed, have no effective date, and are not approved final policies or Roku certification evidence. App store availability is not confirmed. Pages and legal notices are currently English only.</p></aside>';
function document(title,body,app=false,slug='',product='universe'){
 const config=product==='earth'?earthConfig:c;
 const banner=config.website.mode==='review'?reviewBanner:'';
 const productContact=`<a href="mailto:${e(config.supportEmail)}">${e(config.supportEmail)}</a>`;
 const nav=product==='earth'?Object.entries({index:'Overview',support:'Support',privacy:'Privacy notice',terms:'Terms of use'}).map(([id,label])=>`<a href="${id}.html"${id===slug?' aria-current="page"':''}>${label}</a>`).join('')+'<a href="index.html#sources">Sources &amp; licenses</a>':app?Object.entries(pages).map(([id,label])=>`<a href="${id}.html"${id===slug?' aria-current="page"':''}>${id==='index'?'Overview':e(label)}</a>`).join(''):'<a href="#screensavers">Screensavers</a><a href="universe/support.html">Support</a>';
 return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="Independent Roku screensavers by Tom Cocozzello. UNIVERSE and EARTH information, support, sources and policy review."><title>${e(title)} · Tom Cocozzello</title><link rel="stylesheet" href="${app?'../':''}style.css"></head><body><a class="skip" href="#content">Skip to content</a><header><div class="wrap masthead"><a class="brand" href="${app?'../':''}index.html">TC <span>/ SCREENSAVERS</span></a><nav aria-label="${app?product.toUpperCase():'Main'} navigation">${nav}</nav></div></header><main id="content" class="wrap">${banner}${body}</main><footer class="wrap"><p>Independent screensavers by ${e(config.publisherName)} · ${productContact}</p>${product==='earth'?'<p><a href="privacy.html">EARTH privacy review</a> · <a href="terms.html">EARTH terms review</a> · <a href="index.html#sources">EARTH sources &amp; licenses</a></p>':`<p><a href="${app?'':'universe/'}privacy.html">UNIVERSE privacy review</a> · <a href="${app?'':'universe/'}terms.html">UNIVERSE terms review</a> · <a href="${app?'':'universe/'}credits.html">UNIVERSE sources &amp; licenses</a>${app?'':' · <a href="earth/privacy.html">EARTH privacy review</a> · <a href="earth/terms.html">EARTH terms review</a>'}</p>`}<p class="meta">Not affiliated with or endorsed by Roku or the source institutions. English website.</p></footer></body></html>\n`;
}
await rm(new URL('docs/',root),{recursive:true,force:true});
await mkdir(new URL('docs/universe/',root),{recursive:true});
for(const [slug,title]of Object.entries(pages)){
 let body=await readFile(new URL(`content/universe/site/${slug}.html`,root),'utf8');
 body=body.replace(/\{\{(\w+)\}\}/g,(_,key)=>{if(!(key in replacements))throw Error('Unknown token '+key);return replacements[key];});
 if(!draft)body=body.replace('Proposed policy · No effective date set',`Effective: ${e(c.effectiveDate)}`);

 await writeFile(new URL(`docs/universe/${slug}.html`,root),document(title,body,true,slug));
}
const home='<section class="hero"><p class="eyebrow">INDEPENDENT / ROKU SCREENSAVERS</p><h1>A quieter<br>kind of screen.</h1><p class="lead">Standalone screensavers by Tom Cocozzello.<br>A place for product information, help and the sources behind each scene.</p><a class="button" href="#screensavers">Explore the screensavers <span aria-hidden="true">↘</span></a></section><section id="screensavers"><p class="eyebrow">THE COLLECTION / 02</p><article class="feature"><figure class="product-image"><img src="assets/universe-store-cover.png" width="540" height="405" alt="UNIVERSE cover artwork with the Sun and planets against a starfield"><figcaption>Store cover artwork · not an app screenshot</figcaption></figure><div><p class="eyebrow">SOLAR SYSTEM · STANDALONE SCREENSAVER</p><h2>UNIVERSE</h2><p>A quiet view of the Sun, eight planets and the Moon, alongside your local time and date. Bundled content works offline; sizes and distances are schematic.</p><p class="meta">Product information and support preview. Store availability is not confirmed.</p><a class="button" href="universe/">Explore UNIVERSE <span aria-hidden="true">→</span></a><p><a href="universe/support.html">Get support</a> · <a href="universe/credits.html">Read the full credits</a></p></div></article><article class="feature"><figure class="product-image"><img src="assets/earth-cover.png" width="1448" height="1086" loading="lazy" alt="EARTH cover artwork showing Earth, city lights, the Moon and ISS"><figcaption>Promotional cover artwork · not an app screenshot.</figcaption></figure><div><p class="eyebrow">OUR HOME PLANET · IN DEVELOPMENT</p><h2>EARTH</h2><p>A quiet view of Earth with date-based sunlight and Moon phase, warm city lights, subtle stars and locally calculated ISS orbit predictions.</p><p class="meta">Works offline with bundled, dated ISS elements; the station hides outside their seven-day window. Camera orientation stays fixed. Store availability is not confirmed.</p><a class="button" href="earth/">Explore EARTH <span aria-hidden="true">→</span></a></div></article></section><section class="about"><h2>Each screensaver has its own home.</h2><p>Find setup help, source acknowledgments and policy information inside each product section. Explore UNIVERSE and the EARTH design preview.</p><p>Website hosting is provided by GitHub Pages. GitHub logs visitors’ IP addresses for security purposes. These pages use no analytics, cookies, external fonts or embedded media. <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub privacy statement</a>.</p></section>';
await mkdir(new URL('docs/earth/',root),{recursive:true});
const earthTokens={...replacements,policyStatus:e(earthConfig.website.mode==='review'?'This proposed notice has no effective date. An approved version will identify its effective date and applicable practices.':'This notice applies from '+earthConfig.effectiveDate+'. Changes will be posted with an updated date.'),termsStatus:e(earthConfig.website.mode==='review'?'These proposed terms have no effective date and do not supersede existing licenses or mandatory legal rights. An approved release will identify its applicable terms.':'These terms apply from '+earthConfig.effectiveDate+' and do not supersede accompanying licenses or mandatory legal rights.')};
for(const [key,file] of Object.entries({imageNotices:'image-notices.txt',earthNotices:'earth-notices.txt',sgp4License:'sgp4-license.txt',runtimeLicense:'runtime-license.txt'}))earthTokens[key]=e(await readFile(new URL('content/earth/'+file,root),'utf8'));
for(const [key,label] of Object.entries({publisherName:earthConfig.publisherName,supportAccess:earthConfig.support.authorizedAccess,supportRetention:earthConfig.support.retention,hostingProvider:earthConfig.hosting.providerName,hostingLogs:earthConfig.hosting.operationalLogs}))earthTokens[key]=e(label);
earthTokens.supportContact=`<a href="mailto:${e(earthConfig.supportEmail)}">${e(earthConfig.supportEmail)}</a>`;
earthTokens.hostingPrivacyLink=publicLink(earthConfig.hosting.privacyUrl,'GitHub privacy statement');
earthTokens.supportProviderNotice=earthConfig.support.providerName?`<p>Email service provider: ${e(earthConfig.support.providerName)}. ${publicLink(earthConfig.support.privacyUrl,'Email provider privacy policy')}.</p>`:'<p class="review-note">Review item: the publisher has not yet confirmed the email service provider and its privacy information.</p>';
for(const [slug,title] of Object.entries({index:'EARTH',privacy:'EARTH privacy notice',terms:'EARTH terms of use',support:'EARTH support'})){
 let body=(await readFile(new URL(`content/earth/site/${slug}.html`,root),'utf8')).replace(/\{\{(\w+)\}\}/g,(_,key)=>{if(!(key in earthTokens))throw Error('Unknown EARTH token '+key);return earthTokens[key];});
 if(earthConfig.website.mode==='final')body=body.replace('Proposed policy · No effective date set',`Effective: ${e(earthConfig.effectiveDate)}`);
 await writeFile(new URL(`docs/earth/${slug}.html`,root),document(title,body,true,slug,'earth'));
}
await cp(new URL('content/earth/iss-orbit.json',root),new URL('docs/earth/iss-orbit.json',root));
await cp(new URL('content/assets/',root),new URL('docs/assets/',root),{recursive:true});
await cp(new URL('content/earth/asset-provenance.json',root),new URL('docs/earth/asset-provenance.json',root));
await writeFile(new URL('docs/index.html',root),document('Independent Roku screensavers',home));
await writeFile(new URL('docs/style.css',root),await readFile(new URL('content/style.css',root)));
await writeFile(new URL('docs/.nojekyll',root),'');
console.log(`Built ${draft?'public review draft':'final website'} in docs/. Outstanding final website reviews: ${issues.join(', ')||'none'}.`);
