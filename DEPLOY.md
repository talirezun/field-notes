# Deployment

Field Notes is served from Cloudflare as a **Worker with static assets**, not a
Pages project. If you go looking for it under Pages you will not find it.

- Worker name: `field-notes`
- Custom domain: `fieldnotes.talirezun.com`
- Config: [`wrangler.jsonc`](wrangler.jsonc), which owns the domain, the
  trailing-slash policy and the 404 page. That file is the source of truth, not
  the dashboard.
- `workers.dev` and preview URLs are **off** on purpose. One canonical host. A
  site whose whole claim is that it is stable enough to cite should not also be
  reachable at a second indexable URL.

## The loop

The repo is connected to Cloudflare Builds, so this is the whole deploy step:

```
edit a chapter, bump `updated`, add to `sources`
  → commit and push to main
  → Cloudflare runs `npm run build` then `npx wrangler deploy`
  → live in about a minute
```

`npm run build` runs `prebuild` first via the npm lifecycle, which copies the
fonts out of `node_modules` and regenerates the corpus bundles and `llms.txt`.
Those are gitignored and rebuilt on every deploy, so the downloads can never lag
behind the pages.

Build settings in the dashboard, for reference:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

There is no "build output directory" setting to fill in. `wrangler.jsonc` points
at `./dist` and that is where it is decided.

## Deploying by hand

Rarely needed, but if the Git build is stuck:

```bash
npm run deploy
```

That builds and deploys with the local wrangler, which is pinned in
`devDependencies` so it matches what CI runs.

## Web Analytics

Privacy-preserving, no cookies, so there is no consent banner to add. It is not
wired up yet. To turn it on:

1. Dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site** →
   `fieldnotes.talirezun.com`. Copy the site token.
2. Worker → **Settings** → **Build** → **Build variables** → add
   `PUBLIC_CF_BEACON_TOKEN` with that value.
3. Push anything, or retry the last build. The variable is read at build time,
   so it needs a rebuild to take effect.

Without that variable the site emits no beacon script at all, which is the right
default. Nothing breaks if you never do this.

## Checking a deploy

```bash
npm run check:links
```

Verifies every source URL in every chapter still resolves. A dead citation on a
site whose entire claim is traceability is a real defect. Medium returns 403 to
anything without a browser fingerprint, so those are reported and tolerated
rather than failed on.

Beyond that, after a deploy the things worth eyeballing:

- `/` renders and the fonts are the self-hosted ones, not fallbacks.
- `/context-engineering` shows the provenance rail in the left margin on a wide
  screen, with sources aligned to the section that draws on them.
- `/context-engineering.md` returns `text/markdown`, not HTML.
- `/llms.txt` lists all nine chapters.
- `/downloads/field-notes-chapters.zip` unzips to nine markdown files.
- `/nope-not-here` returns the styled 404, not a Cloudflare error page.
- `/about/` redirects to `/about`.

## If a build fails

The failure mode we already hit: `npx wrangler deploy` with no `wrangler.jsonc`
in the repo. Wrangler has nothing to deploy and no idea where the assets are.
The fix is that file existing, which it now does. Do not delete it.
