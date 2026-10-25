# Website maintenance

This is the public GitHub Pages website source, separate from the Roku runtime
repository. Node.js 22 or later and Git are required; Node24 on macOS arm64 was
verified. Use the existing Node installation or an official supported release
from https://nodejs.org/ . No npm dependency install, credentials, new OS
permission, external asset download or app deployment is needed to build/tests.

1. Clone `https://github.com/razzo-lunare/roku-screensaver-sites.git` and open a
   terminal in that checkout. Edit `content/`, not generated `docs/`.
2. Maintain EARTH pages in `content/earth/site/`. Product-specific publisher,
   hosting/support facts, review mode and approval state belong in
   `content/earth/publication.json`. Animated Solar System has its own configuration.
   Record only confirmed facts; a website edit does not approve final policies.
3. When the app changes, deliberately copy its reviewed public notices and
   provenance into the corresponding `content/earth/` snapshots: image notices,
   asset provenance, EARTH notices, ISS orbit metadata and full software notices.
   Never copy runtime source, device logs, private configuration or app ZIPs.
   Replace `content/assets/earth-preview.jpg` only with a reviewed, privacy-safe
   native screenshot, and update the overview caption with version/date.
4. Run from this website checkout:

   ```sh
   npm run build
   npm test
   ```

   Expect five passing tests: static allowlist/links/fragments, complete credits,
   final-policy gate, current EARTH claims/links, independent product configuration.
   `npm run check:release` deliberately fails until final facts and approvals are
   actually recorded. Public review updates keep both products in review mode.
5. For optional local preview:

   ```sh
   python3 -m http.server 8088 --bind 127.0.0.1 --directory docs
   ```

   Open `http://127.0.0.1:8088/earth/`. Python3 is optional and uses its standard
   library only (verified macOS Python3.9). Stop the server with Control-C.
6. Review `git diff --check` and `git diff --stat`, then commit source plus
   generated `docs/`. An authorized normal push to main triggers the existing
   Pages deployment from `/docs`. Check the deployment action and public URLs.
   Failed validation must be fixed before pushing; retain the prior commit for
   recovery via a normal corrective/revert commit rather than rewriting history.

No tools were installed or upgraded for the October24 EARTH update. Do not alter
Pages visibility, domain, deployment settings or policy approval to bypass a check.
