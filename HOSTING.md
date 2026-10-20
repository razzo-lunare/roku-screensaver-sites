# GitHub Pages hosting

Repository: https://github.com/razzo-lunare/roku-screensaver-sites

The initial repository was verified public and empty using GitHub MCP. Files
are uploaded through MCP; no GitHub CLI, SSH push or browser login is required
for that upload. The available MCP tools cannot read or change Pages settings.
The attempted Pages GET was rejected by the connector's endpoint allowlist.

## One minimal human setting if Pages is not already enabled

Open the repository **Settings → Pages → Build and deployment**. Set:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/docs**
- Click **Save**

Direct settings page:
https://github.com/razzo-lunare/roku-screensaver-sites/settings/pages

This is the only required hosting operation left to a repository administrator.
No custom domain, paid hosting, app upload or license-picker selection is needed.
Publish the existing review status; do not interpret this as final policy approval.
GitHub documents branch/folder publishing here:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Expected URLs — not evidence of a live deployment

- https://razzo-lunare.github.io/roku-screensaver-sites/
- https://razzo-lunare.github.io/roku-screensaver-sites/universe/
- https://razzo-lunare.github.io/roku-screensaver-sites/universe/privacy.html
- https://razzo-lunare.github.io/roku-screensaver-sites/universe/terms.html
- https://razzo-lunare.github.io/roku-screensaver-sites/universe/support.html
- https://razzo-lunare.github.io/roku-screensaver-sites/universe/credits.html

The base URL follows the verified repository identity and GitHub's project URL
convention. `deploymentVerified` stays false until live verification.
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
