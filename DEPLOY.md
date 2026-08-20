# Deploying to Cloudflare Pages

Do this once, in the Cloudflare dashboard. It takes about three minutes. After
that every push to `main` rebuilds the site and regenerates the download
bundles automatically.

This file is a checklist for the initial setup. It is not part of the site.

## 1. Create the Pages project

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. Authorise GitHub if you have not already, then pick `talirezun/field-notes`.
3. Set up the build:

   | Field | Value |
   |-------|-------|
   | Project name | `field-notes` |
   | Production branch | `main` |
   | Framework preset | Astro (or None, it makes no difference here) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | leave empty |

4. **Save and Deploy.** The first build takes a minute or two.

Node version comes from `.nvmrc` (22.14.0). You do not need to set
`NODE_VERSION` by hand.

When it finishes you get a `*.pages.dev` URL. Open it and check the site works
before adding the domain.

## 2. Add the custom domain

Do this **from inside the Pages project**, not from the DNS tab.

1. Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter `fieldnotes.talirezun.com` and confirm.

Cloudflare writes the CNAME and provisions the certificate itself. **Do not
create the DNS record manually first.** If you do, it conflicts and the domain
will not attach.

`talirezun.com` needs to already be on Cloudflare DNS for this to be one click.
If it is not, Cloudflare will show you the CNAME to add at your current DNS
provider instead.

Certificate issuance is usually a couple of minutes and occasionally up to
fifteen. The site is live on the `.pages.dev` URL the whole time.

## 3. Turn on Web Analytics

Privacy-preserving, no cookies, so there is no consent banner to add.

1. Dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site**.
2. Enter `fieldnotes.talirezun.com`.
3. Copy the **site token** it gives you.
4. Back in the Pages project → **Settings** → **Environment variables** →
   Production → add:

   ```
   PUBLIC_CF_BEACON_TOKEN = <the token>
   ```

5. Redeploy (Deployments → the latest one → **Retry deployment**), because
   environment variables are read at build time.

Without that variable the site emits no beacon script at all, which is the
right default. Nothing breaks if you skip this step.

## 4. Check it

Once the domain resolves:

- `https://fieldnotes.talirezun.com` loads and the fonts are the self-hosted
  ones, not fallbacks.
- `https://fieldnotes.talirezun.com/context-engineering` renders with the
  provenance rail in the left margin on a wide screen.
- `https://fieldnotes.talirezun.com/context-engineering.md` returns raw
  markdown, not HTML.
- `https://fieldnotes.talirezun.com/llms.txt` lists all nine chapters.
- `https://fieldnotes.talirezun.com/robots.txt` allows GPTBot and ClaudeBot.
- `https://fieldnotes.talirezun.com/downloads/field-notes-chapters.zip`
  downloads and unzips to nine markdown files.
- `https://fieldnotes.talirezun.com/sitemap-index.xml` exists.

Then run the structured data through
[Google's Rich Results test](https://search.google.com/test/rich-results) and
submit the sitemap in Search Console.

## Free tier

500 builds a month, unlimited bandwidth and requests, 20,000 files per site.
This site is about 40 files. There is no limit here worth thinking about.

## After that

The loop is: edit a chapter file, bump `updated`, add to `sources`, push.
Cloudflare rebuilds in about a minute and the download bundles regenerate
themselves. There is no deploy step and nothing to remember.
