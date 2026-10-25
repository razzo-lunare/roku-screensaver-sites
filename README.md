# Independent Roku screensaver websites

Public website-only repository for Tom Cocozzello's standalone screensavers.
Animated Solar System and the EARTH design preview have separate product paths.
The private Roku application repository and runtime source are not included.

## Current status

**Live on GitHub Pages, verified October 22, 2026:**
https://razzo-lunare.github.io/roku-screensaver-sites/

All six public HTML pages and the stylesheet return HTTP 200 and match the
generated local files byte-for-byte. The Pages deployment succeeded. Hosting
is verified; policy approval and Roku store readiness remain separate.

The website is a **public review draft**, with no confirmed store availability.
Privacy and terms are proposed, have no effective date, and are not approved
final policies or certification evidence. They visibly say so on every page.
English only. No download, store listing, price or release date is claimed.

GitHub MCP verified `razzo-lunare/roku-screensaver-sites` is public, default branch
`main`, with push and admin permissions for the connected user. The MCP tool
inventory has no Pages configuration operation; its generic reader rejected
`/repos/razzo-lunare/roku-screensaver-sites/pages` as unsupported. Repository
admin rights do not add a missing MCP operation. No browser sign-in was used.
The owner configured Pages, and deployment is now verified. See
[HOSTING.md](HOSTING.md) for hosting configuration and verification evidence.

## Build and check

Requires Node 22 or later. No dependency installation, secrets, API keys or
external assets are required.

```sh
npm run build
npm test
npm run check:release
```

`build` replaces only `docs/` from canonical `content/` and public credit exports.
`test` checks the webroot allowlist, local links, draft honesty, complete credits,
and the final-policy gate. `check:release` deliberately fails while facts and
reviews are outstanding, before replacing generated files.

For local preview: `python3 -m http.server 8080 --directory docs`, then visit
`http://localhost:8080/`. A project-path deployment uses relative internal links.

## Sources and maintenance

- `content/animated-solar-system/site/*.html`: canonical English page fragments, adapted from
  the app publication drafts. Make future website content changes here.
- `content/style.css`: canonical shared design.
- `content/assets/`: Animated Solar System and EARTH cover artwork, and EARTH native Roku preview.
- `content/earth/`: EARTH overview, image notices and source provenance.
- `content/animated-solar-system/publication.json`: public publisher facts and review state.
  Original store fields remain unresolved; they do not gate website generation.
- `content/animated-solar-system/credits.json`: complete unwrapped app notices and map
  provenance, exported read-only. Includes proprietary, MIT and separate artwork
  terms, scientific references and input SHA-256 hashes.
- `tools/build.mjs`: static generator. `docs/`: generated Pages webroot.

The old app `publishing/animated-solar-system/site` fragments are now an import baseline,
not the source for this website. Do not edit generated `docs/` files directly.
The app owner should treat these website sources as canonical for future web
changes. Store listing/localization plans remain in the private app project.

After **every app credit, license, asset or provenance change**, run:

```sh
npm run sync:animated-solar-system -- ../roku-screensavers
npm run build
npm test
```

The sync script runs the app's read-only `verifyCredits()` first, then exports
all full `notices` from its schema-3 credit record, map provenance and astronomy
references. It checks the original app/artwork/software notices are preserved
in full; it does not export truncated TV pages. Input hashes allow snapshot
comparison. No private app checkout is needed for normal website builds.
Sync is a deliberate release operation; CI cannot detect a change in a private
repository it cannot access. Review the credit diff alongside each app release.
No app files are changed by the sync command.

## Public upload allowlist

Only these paths belong in this public Git repository:

`README.md`, `HOSTING.md`, `RIGHTS.md`, `.gitignore`, `package.json`,
`content/style.css`, `content/assets/{animated-solar-system-store-cover.png,earth-cover.png,earth-preview.jpg}`,
`content/earth/{image-notices.txt,asset-provenance.json,site/index.html}`,
`content/animated-solar-system/publication.json`,
`content/animated-solar-system/credits.json`, `content/animated-solar-system/site/*.html`,
`tools/{build,sync-animated-solar-system}.mjs`, `tests/site.test.mjs`, and generated
`docs/{index.html,style.css,.nojekyll,animated-solar-system/*.html,earth/index.html,earth/asset-provenance.json,assets/animated-solar-system-store-cover.png,assets/earth-cover.png,assets/earth-preview.jpg}`.

**Only `docs/` is the Pages publishing source.** Never upload the private app
repository, runtime `.brs` or component files, local config, credentials,
node_modules, build ZIPs, reports, device logs, screenshots with household
information or unnecessary app assets. Public credit records include only
notices, provenance and hashes; no application runtime implementation.

## Remaining decisions

Confirm support email provider/privacy information, effective date and final
publisher policy approval. Finish asset rights, naming/country and website
language reviews. Email inbox delivery/access have not been independently tested.
The selected Gmail address and owner-only inbox access are confirmed; retention
is purpose-based, with periodic manual review, no fixed deadline or automation.
Support phone, domestic region, category, age rating, made-for-kids, monetization,
store copy approval and Roku submission remain separate store work.

To finalize: confirm actual decisions in configuration, record approval evidence
in `website.policyApproval`, set only genuinely completed review flags, choose
`website.mode: final`, run `check:release`, build and test, then republish and
verify all public URLs. Publication authorization for website review does not
approve policies, legal clearance or Roku submission.

## Product imagery

Animated Solar System uses the app's checked-in `cover-fhd.png` store cover artwork, an
AI-generated illustration, not a runtime screenshot or evidence of store publication.
EARTH uses the app owner's native Roku `stars-after.jpg` milestone capture;
its screenshot caption and overview identify the sample astronomy and location.
Only these reviewed product images are exported; no household/device information
or private runtime implementation is included. EARTH image notices and provenance
are copied from the app project and shown alongside the preview. Refresh these
with future imagery changes. EARTH has no store/download link or release claim.

EARTH collection cover: original OpenAI-generated promotional artwork, handed
off by the Earth artwork thread from `design/earth/artwork/earth-cover-v1.png`.
It is labeled as artwork; the separate overview screenshot shows current behavior.


## Animated Solar System rename (October 24, 2026)

Current sources, image filenames, sync command and generated product pages use
`animated-solar-system`. The previous `/universe/` URLs remain as static redirect
pages so previously shared Roku policy/support links keep working. The current
product title and cover are **Animated Solar System**. Canonical artwork is the
English menu cover from app build 0.4.53; scientific/imagery qualifications and
public-review status are unchanged. Historical hosting evidence above retains
the URLs and names verified at that time.

```sh
npm run sync:animated-solar-system -- ../roku-screensavers
npm run build
npm test
```
