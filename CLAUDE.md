# CLAUDE.md

Context for an agent working on this repo. Read it before editing anything. It
is the specification, not a summary of one.

This site is my own context-engineering practice applied to my own site, so
treat this file the way you would want your own to be treated: it is the thing
that stops you guessing.

## What this is

Field Notes is the published, edited surface of my personal knowledge graph. It
is not a blog. My narrative essays live on Substack, mirrored to Medium. Those
are chronological and first person. This site is topical, durable and built to
be extracted by models and agents.

Three audiences, in order of size. Humans first on the page, language models
first in the markup, agents first in the download. When they conflict, that is
the order.

Deploy target is `fieldnotes.talirezun.com` on Cloudflare Pages, production
branch `main`, build command `npm run build`, output `dist`.

## The update loop, which must stay two minutes long

```
I publish an article
  → I ingest it into The Curator
  → an agent extracts what is new into the relevant chapter file
  → the agent edits content/chapters/NN-*.md, bumps `updated`, adds to `sources`
  → commit and push
  → Cloudflare Pages rebuilds
```

No CMS, no deploy step, no manual regeneration of anything. The download bundles
and `llms.txt` are built from the chapter files on every deploy. If a change you
are making adds a manual step to this loop, it is the wrong change.

**The editorial rule for that loop lives in `content/PLAYBOOK.md`.** It decides
whether a new article becomes a source, a new section, or a new chapter, and it
walks the mechanical pass. Read it before editing a chapter. Most articles are a
citation and a paragraph, not a chapter. New chapters are rare by design.

Before you push, run both:

```bash
npm run validate   # every chapter, all errors at once, about a second
npm run build      # the real gate
```

`npm run validate` is dependency-free and checks everything the schema checks
plus the things it cannot: the anchor contract across time, the em dash rule,
and the four to seven section range.

## Content rules, which are not optional

### Sourcing

The corpus is distilled from three domains of my Curator wiki. The rules differ
per domain.

| Domain | Use | Constraint |
|--------|-----|-----------|
| `articles` | Primary source | Free use. It is distilled from my own published work |
| `posts` | Secondary | Mine the concept nodes. The summaries are campaign and engagement files, mostly operational. Ignore them |
| `projects` | **Restricted. Do not use directly.** | See below |

**The `projects` filter is mandatory.** Its largest hubs are internal build
documentation for Lumina, plus a cluster tagged `security` and `compliance`.

- **MUST NOT** publish architecture details, infrastructure topology, or any
  security posture material for Lumina.
- **MUST NOT** publish compliance claims of any kind without my explicit written
  sign-off on the exact wording. Not a paraphrase of one, the sentence itself.
  A permanent, machine-readable page makes every claim on it quotable, and there
  are open questions here that are mine to resolve rather than yours to
  interpret. If you find yourself weighing which of two sources to believe on a
  compliance point, stop there and ask me.
- **MAY** use material about The Curator freely. It is MIT licensed, public, and
  documented in its own repo.
- **MAY** describe products using only what is *already published* publicly: the
  Substack articles, the Lumina site, the Curator README.

When in doubt on a product claim, leave it out and flag it for me.

### Verification

Standing editorial discipline. It applies to every published claim.

- **Never state a specific number, price, benchmark, or version from memory.**
  Verify against at least two current sources before publishing.
- **Never hardcode a GitHub star count.** Use the live shields.io badge, which is
  already wired up on `/the-curator`.
- **Verify current AI model names before publishing.** Naming moves fast and a
  wrong version number undermines the practitioner positioning, which is the
  whole credibility engine.
- **Where a claim came from my spoken input and conflicts with project
  documentation, flag the conflict.** Do not silently pick one.

### Never republish

Never reproduce full Substack or Medium article text. Distil and link. A chapter
that reads like a reprint of an essay is a failed chapter.

## Voice

The content is mine. You will draft scaffolding, interface copy and the
`/the-curator` page. Match it.

- First person, specific, proof-led. Real numbers and real failures. "This broke
  twice before it worked" is on brand. "Unlock the power of AI" is not.
- Conversational and direct, slightly rough at the edges. Not listicle-shaped,
  not polished into blandness.
- **No em dashes.** Use commas, periods, or line breaks. This is a standing rule
  across everything I publish and it applies to code comments here too.
- Acknowledge what is untested. If I have not personally used something, the copy
  says so.
- **Do not use the word "signal" as a label anywhere in the interface.** It
  belongs to a different site and the borrowing would be visible.
- Interface copy: active voice, sentence case, name things by what the reader
  controls. "Download the corpus", not "Access resources".

## Anchors are a permanent contract

Once a section anchor is published it is never renamed. This is the strongest
rule in the repo, because the site's whole claim is that it is stable enough to
cite.

Two mechanisms, both enforced at build time:

1. **Pin the anchor in the heading.** A trailing `{#anchor}` sets the id, so the
   heading text can be rewritten freely without breaking links.

   ```markdown
   ## How do you structure the first phase of a build? {#three-phase-build}
   ```

   This is handled by `src/lib/satteri-anchor-ids.mjs`, a hast plugin on the
   Sätteri markdown pipeline. Every heading in every chapter pins its anchor.
   Keep it that way.

2. **`anchorAliases` in frontmatter**, for anchors that predate the pin or that
   have to be retired. Each alias renders as an empty target above the section it
   now points at.

   ```yaml
   anchorAliases:
     - from: "the-old-anchor"
       to: "three-phase-build"
   ```

   The build throws if an alias points at a section that does not exist.

Section ids are read out of the rendered HTML everywhere in the build, never out
of Astro's `headings` array, so the two cannot drift apart.

A third mechanism guards it across time. `content/anchors.lock.json` records
every anchor that has ever shipped, and `npm run validate` fails if one stops
resolving. The build cannot catch a rename on its own, because a renamed anchor
leaves the file perfectly self-consistent. After deliberately adding or aliasing
an anchor, run `npm run validate -- --update-lock`. The lock is a record of
promises, not a cache.

## Content schema

Defined in `content/config.ts` with Zod, re-exported from
`src/content.config.ts` because that is where Astro looks. **The build fails on a
schema violation. There are no silent fallbacks and you should not add any.**

Chapter frontmatter:

| Field | Rule |
|-------|------|
| `title` | String |
| `number` | Positive integer, drives ordering |
| `slug` | Lowercase kebab-case. This is the URL |
| `status` | `published` or `scaffold`. A scaffold chapter renders a visible notice saying the body is not written yet |
| `question` | **Must end in a question mark** and read as a real question. This is the GEO hook, rendered under the title |
| `summary` | **25 to 50 words.** Meta description, index page, and JSON-LD `description` |
| `updated` | ISO date. Shown on the page and in JSON-LD |
| `sources` | **At least one.** Every chapter traces to published work |
| `related` | Slugs of other chapters. An unknown slug fails the build |
| `tags` | At least one |
| `anchorAliases` | See above |
| `draft` | Keeps a chapter out of the build entirely |

A source is `{ title, url, publication?, date?, sections?, placeholder? }`.

- `sections` lists the section anchors that source actually backs. This drives
  the provenance rail. **An anchor that does not exist fails the build.** Omit
  `sections` for a source that informs the whole chapter.
- `placeholder: true` marks a stand-in citation. `prebuild` warns and prints a
  count. Every one of these must be gone before the corpus is presented as
  finished.

## Structure

Two levels: chapter, then section. No deeper nesting. Chapters are files,
sections are `##` headings. URLs stay one segment deep.

```
/                                        index, all chapters with section lists
/context-engineering                     chapter
/context-engineering#three-phase-build   section
/context-engineering.md                  raw markdown for models and agents
```

`src/pages/[slug].astro` serves both chapters and the markdown pages in
`content/pages/`. Static routes such as `/the-curator` take priority over it.

## GEO, which is a first-class requirement

- Every `##` heading should be a question or a direct declarative claim. Not
  "Methodology". Instead "How do you structure the first phase of a build?"
- **The first paragraph after every `##` must be a self-contained answer.** A
  model that extracts only that paragraph must get something correct and useful.
  This is also what feeds the `FAQPage` JSON-LD, which is emitted automatically
  for any chapter with two or more question-shaped sections.
- JSON-LD on every page. Chapter pages emit `Article` with `citation` for each
  source, plus `FAQPage` where it applies. Root emits `WebSite` and `Person`.
  The `Person` must keep `jobTitle`, `affiliation` and the full `sameAs` list.
  Retrieval trust depends on it.
- `robots.txt` allows AI crawlers **explicitly and by name**. GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended and the rest. Do not add a blocking policy. The
  whole site exists to be retrieved and cited.
- `llms.txt` is generated by `src/lib/corpus.ts`. Every chapter appears with its
  question and its markdown URL.

## Design

Tokens are in `src/styles/tokens.css`. Do not introduce a colour outside them.

- The dark is **warm and brown-shifted**, not neutral grey-black. It should read
  as aged ink and paper. A near-black background with one bright accent is a
  common default and landing there by accident would make the site generic.
- One accent, the khaki-gold carried over from `talirezun.com`. No secondary hue.
- **Gold is never body copy.** `--gold` on `--ink` passes AA for large text and
  UI only. Headings, rules, labels and links.
- Two structural devices are inherited from `talirezun.com` and are what make the
  two sites read as family: the centred hairline-with-label divider, and the
  offset block (a hairline box with a solid gold block behind it, shifted down
  and right). Use those rather than inventing new ones.
- Fonts are self-hosted, copied out of `@fontsource` by `prebuild`. No font CDN:
  it costs a round trip and leaks visitor data. `latin-ext` subsets are not
  optional, my name has a caron in it.
- Mono is doing real work, not decoration. Every date, slug, filename and source
  citation is set in mono, which makes the difference between a claim and a
  citation visible at a glance. Keep that distinction.

### The provenance rail

The one memorable thing on a chapter page, and the one place the design budget
goes. `src/layouts/Chapter.astro`.

`splitChapter()` in `src/lib/chapters.ts` cuts the rendered HTML at each `<h2>`
and binds each source to the sections it backs. Each section and its sources are
then siblings in one CSS grid row, so they line up without measuring anything in
the browser. The wrapper is `display: contents`, which is why hovering either
half highlights the pair with no JavaScript.

It is not decoration. It makes the corpus's traceability visible, which is
exactly the claim the site makes about itself and about The Curator. Keep
everything else quiet.

Below 62rem the rail collapses to a Sources block after each section.

## Quality floor

Do not announce these. Just do not break them.

- Responsive to 360px with no horizontal overflow.
- Visible keyboard focus in `--gold-bright`.
- `prefers-reduced-motion` respected. Motion here is minimal by design.
- Semantic HTML, real heading hierarchy, skip link.
- Server-rendered HTML only. **No content behind JavaScript.** The only scripts
  on the site are the copy buttons and the rail's in-view marker, and the page
  is complete without either.
- Lighthouse 95 or better on all four categories.

## Things that will fail the build, on purpose

- A frontmatter schema violation.
- A summary outside 25 to 50 words.
- A `question` that does not end in a question mark.
- A chapter with no sources.
- A source citing a section anchor that does not exist.
- An `anchorAlias` pointing at a section that does not exist.
- A `related` entry naming a chapter that is not there.
- Two chapters with the same slug.
- A missing font file in `node_modules`.

If one of these fires, fix the content. Do not soften the check.

## Deployment

Cloudflare, as a **Worker with static assets**, not a Pages project. The Worker
is `field-notes` and the repo is connected to Cloudflare Builds, so a push to
`main` builds and deploys.

`wrangler.jsonc` is the source of truth, not the dashboard. It owns the assets
directory, the trailing-slash policy, the 404 page and the custom domain.

- Build command `npm run build`, deploy command `npx wrangler deploy`. There is
  no build-output-directory setting: `wrangler.jsonc` points at `./dist`.
- `html_handling` is `drop-trailing-slash`, which matches Astro's
  `trailingSlash: "never"` and `build.format: "file"`. Change one and you have
  to change the other, or every page gets a second URL.
- `workers_dev` and `preview_urls` are **false** on purpose. One canonical host.
  Do not turn them back on without a reason: a second indexable copy of a site
  that exists to be cited is a real problem, not a cosmetic one.
- Cloudflare Web Analytics is on. The site token is `CF_BEACON_TOKEN` in
  `src/lib/site.ts`, committed on purpose: it is public by design, since the
  beacon only works by emitting it into the page. `PUBLIC_CF_BEACON_TOKEN`
  overrides it. Empty token means no beacon script at all. No cookies, so no
  consent banner, and it stays that way. Google Analytics would need one.
- `tsx`, `jszip` and the `@fontsource` packages are runtime `dependencies`, not
  devDependencies, so the build works on a clean CI install regardless of how
  `NODE_ENV` is set.

`npm run deploy` does the same thing locally, and `npm run check:links` verifies
every source URL in every chapter still resolves. See DEPLOY.md.

## Non-goals

Be explicit, because scope creep here is expensive.

- Not a CMS. Markdown in git, full stop.
- Not a newsletter. No email capture. A "work with me" link is in scope, a signup
  form is not.
- Not a republication of the essays.
- Not a product marketing site. Lumina and The Curator get honest, factual
  treatment as things I built. They do not get sales copy.
- Not a comment platform. No comments, no reactions, no analytics beyond
  Cloudflare Web Analytics.
