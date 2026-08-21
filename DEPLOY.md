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

Cloudflare Web Analytics, wired up and running. No cookies, no localStorage, no
consent banner, verified in a browser rather than assumed.

The site token lives in `src/lib/site.ts` as `CF_BEACON_TOKEN`. It is not a
secret: the beacon only works by putting it in the page source where every
visitor can read it, so hiding it in a dashboard build variable would buy
nothing and cost a setting nobody remembers is there.

`PUBLIC_CF_BEACON_TOKEN` still overrides it if a build ever needs to report
somewhere else. Set the constant to an empty string to turn analytics off
entirely: no beacon script is emitted at all when there is no token.

Read the numbers at Dashboard → **Analytics & Logs** → **Web Analytics** →
`fieldnotes.talirezun.com`.

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

## Known issue: Cloudflare is overriding robots.txt

Fetch `https://fieldnotes.talirezun.com/robots.txt` and you get **two** files.
Cloudflare injects a managed block above ours containing:

```
User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference

User-agent: ClaudeBot
Disallow: /
User-agent: GPTBot
Disallow: /
User-agent: Google-Extended
Disallow: /
...
```

Our own `public/robots.txt` allows every one of those agents by name and has no
`Disallow` in it at all. The block is added at the edge, not by the build.

This inverts the site. Retrievability by models is a first-class requirement,
not a side effect, and `Content-Signal: ai-train=no` is an unambiguous
machine-readable reservation of rights against exactly the use this corpus was
built for.

**The fix is in the dashboard, not the repo:** Cloudflare → the `talirezun.com`
zone → **AI Crawl Control** → the managed `robots.txt` / content signals
settings. Turn the managed content off, or set the signals to allow.

Two things to know before you do it. It is a **zone-level** setting, so it
affects `talirezun.com` and every other hostname on that zone, not just Field
Notes. And it is a genuine rights decision about your own writing: the default
Cloudflare applied reserves your content against AI training. Field Notes is
CC BY 4.0 and exists to be ingested, so for this site the answer is clear, but
it is still your call to make and not a bug to silently fix.

## If a build fails

The failure mode we already hit: `npx wrangler deploy` with no `wrangler.jsonc`
in the repo. Wrangler has nothing to deploy and no idea where the assets are.
The fix is that file existing, which it now does. Do not delete it.
