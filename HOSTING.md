# GitHub Pages hosting

Repository: https://github.com/razzo-lunare/roku-screensaver-sites

The initial repository was verified public and empty using GitHub MCP. Files
are uploaded through MCP; no GitHub CLI, SSH push or browser login is required
for that upload. The available MCP tools cannot read or change Pages settings.
The attempted Pages GET was rejected by the connector's endpoint allowlist.

## Publishing source (configured by the owner)

Open the repository **Settings → Pages → Build and deployment**. Set:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/docs**
- Click **Save**

Direct settings page:
https://github.com/razzo-lunare/roku-screensaver-sites/settings/pages

The owner completed this setting; no hosting operation remains outstanding.
No custom domain, paid hosting, app upload or license-picker selection is needed.
Publish the existing review status; do not interpret this as final policy approval.
GitHub documents branch/folder publishing here:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Live URLs — verified October 22, 2026

- https://razzo-lunare.github.io/roku-screensaver-sites/
- https://razzo-lunare.github.io/roku-screensaver-sites/universe/
- https://razzo-lunare.github.io/roku-screensaver-sites/universe/privacy.html
- https://razzo-lunare.github.io/roku-screensaver-sites/universe/terms.html
- https://razzo-lunare.github.io/roku-screensaver-sites/universe/support.html
- https://razzo-lunare.github.io/roku-screensaver-sites/universe/credits.html

The base URL follows the verified repository identity and GitHub's project URL
convention. `deploymentVerified` is true based on the checks recorded below.
Check the Pages deployment action and open every URL without authentication.
Confirm HTTP 200, correct content, public review banner, complete credits,
working navigation and narrow/wide layout. A 404 means hosting is not verified;
repository upload alone is not deployment. Do not use drafts as final Roku
policy/certification evidence.

Future website updates: edit canonical content, sync app credits when applicable,
run build/tests, and commit the allowlisted files including generated `docs/`.
Once the publishing source is configured, updates on `main` publish `docs/`.

GitHub Pages logs visitor IP addresses for security, including signed-out visits:
https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
Its independent privacy practices and retention remain governed by GitHub:
https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement

## Verification recorded October 19, 2026

- Website implementation uploaded through GitHub MCP to `main` at commit
  `5442e0859d8a70b5b6a94c69e4cf7765263ea179`; recursive remote tree verified
  all 24 allowlisted files, with no runtime app files.
- App read-only credit verification passed and exported 13 complete notices.
- `npm run build` passed; `npm test` passed all three checks.
- Final website preparation correctly rejects missing approvals/provider/date;
  support phone and unrelated store fields are not website blockers.
- Local browser: home and privacy pages rendered; server recorded HTTP 200 for
  both, and stylesheet loaded. Wide-screen home screenshot visually inspected.
  Narrow-screen rendering and every page's visual layout have not been browser
  verified; relative links and output contents were checked automatically.
- Public root address was opened in an unauthenticated in-app browser and showed
  **404 — There isn't a GitHub Pages site here.** GitHub MCP reported zero workflow
  runs. No live public page URLs are verified. Enable the Pages setting above.
- The current local folder began with unborn `main`. MCP upload changes GitHub
  directly; it does not update this folder's local Git object database or refs.
  Local files match the uploaded content; local Git history is not synchronized.

## Live verification — October 22, 2026

The owner updated Pages settings. GitHub MCP confirms the successful
[Pages build and deployment](https://github.com/razzo-lunare/roku-screensaver-sites/actions/runs/39851030490)
for commit `27ccb5f2224ab910e940d3cd3239bf9e3af9b1b3`.

All six HTML URLs listed above and `style.css` return HTTPS HTTP 200. Each
response matches its generated local file byte-for-byte. This also verifies
the full credits and provenance, public review banner, contact email and
relative navigation content are preserved in the deployment. The live home
and UNIVERSE overview were inspected in an unauthenticated browser; the
stylesheet and decorative illustration render correctly at desktop width.
Narrow-screen visual inspection remains unverified.

The October 19 hosting blocker is resolved. The site is publicly hosted as a
review draft; it is not final policy approval, trademark/asset clearance,
localized policy completion, or Roku certification evidence. Support email
provider confirmation, policy effective date and final policy approval remain
outstanding. No store availability or unrelated store fields were changed.
