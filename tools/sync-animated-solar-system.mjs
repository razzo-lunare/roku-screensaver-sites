import {readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const app=resolve(process.argv[2]||'../roku-screensavers');
// Only these public notices/provenance may cross the private repository boundary.
const files=['screensavers/animated-solar-system/src/data/credits.json','screensavers/animated-solar-system/src/data/animated-solar-system-license.txt','screensavers/animated-solar-system/src/images/LICENSE.txt','shared/runtime/data/third-party-licenses.txt','screensavers/animated-solar-system/src/data/asset-provenance.json','screensavers/animated-solar-system/src/data/lighting-provenance.json'];
const {verifyCredits}=await import(pathToFileURL(join(app,'tools/animated-solar-system/credits.mjs')));
const credits=await verifyCredits(); // Read-only: no --write or app changes.
if(!credits.notices?.length)throw Error('Full unwrapped notices required');
const inputs=await Promise.all(files.map(p=>readFile(join(app,p),'utf8')));
for(const i of [1,2,3])if(!credits.notices.some(n=>n.text.includes(inputs[i].trim())))throw Error('Full license missing: '+files[i]);
const snapshot={schema:1,notices:credits.notices,provenance:JSON.parse(inputs[4]),astronomyReferences:JSON.parse(inputs[5]).ringPhotometry.references,inputSha256:Object.fromEntries(files.map((p,i)=>[p,createHash('sha256').update(inputs[i]).digest('hex')]))};
await writeFile(new URL('../content/animated-solar-system/credits.json',import.meta.url),JSON.stringify(snapshot,null,2)+'\n');
console.log(`Exported ${credits.notices.length} complete public notices; no app source or assets copied.`);
