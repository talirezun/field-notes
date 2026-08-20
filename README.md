# Field Notes

**Field notes from real builds, not vendor marketing.**

The source for [fieldnotes.talirezun.com](https://fieldnotes.talirezun.com), a
public, structured distillation of what I have written, taught and shipped.

I publish narrative essays on [Substack](https://talirezun.substack.com),
mirrored to [Medium](https://medium.com/@talirezun). Those are chronological and
first person. They answer what happened to me. This is the other axis: topical,
durable, and built to be extracted. It answers how something works.

Nothing here is republished from those essays. It is distilled across them and
links back.

## Take the corpus

The whole thing is a download, and that is deliberate.

| File | What it is |
|------|-----------|
| [`/downloads/field-notes-complete.md`](https://fieldnotes.talirezun.com/downloads/field-notes-complete.md) | Every chapter in one markdown file, with a provenance header |
| [`/downloads/field-notes-chapters.zip`](https://fieldnotes.talirezun.com/downloads/field-notes-chapters.zip) | One markdown file per chapter. Use this one for ingestion |
| `/<slug>.md` | Any single chapter as raw markdown, e.g. `/context-engineering.md` |
| [`/llms.txt`](https://fieldnotes.talirezun.com/llms.txt) | A structured map of the site for models |

These are generated at build time from `content/chapters/`, so they never lag
behind the pages. They are gitignored, because a derived artefact in git is a
merge conflict waiting to happen.

### Into your own second brain

The corpus was written and is maintained in
[The Curator](https://github.com/talirezun/the-curator), my open-source local
second brain. It reads documents, writes an interlinked wiki of entities and
concepts, and serves that wiki to a frontier model over MCP.

Download the zip, drop the nine files into the Ingest tab, and query your own
copy. Full instructions are at
[/the-curator](https://fieldnotes.talirezun.com/the-curator).

It needs a Google Gemini or an Anthropic API key for ingestion. Gemini has a
free tier that covers a one-off run of this size.

⭐ [Star The Curator on GitHub](https://github.com/talirezun/the-curator)

## Two licences, because this repo holds two things

- **Content** (`content/**`, and everything generated from it):
  [CC BY 4.0](LICENSE). Reuse it, adapt it, feed it to a model, put it in your
  own second brain. Attribution is the only condition. This is deliberate. The
  point is for the corpus to spread, and a restrictive licence would fight that.
- **Code** (`src/**`, `scripts/**`, config): [MIT](LICENSE-CODE).

Attribution, if you want the short form:

> Dr. Tali Režun, Field Notes (https://fieldnotes.talirezun.com), CC BY 4.0

## Corrections

Found an error? [Open an issue or a PR](CONTRIBUTING.md). Corrections are
welcome and go straight into the chapter file. Additions are my call.

## Running it

Static [Astro](https://astro.build) site. No CMS, no database, no cookies.

```bash
npm install
npm run dev
```

`npm run build` runs `prebuild` first (npm lifecycle), which copies the
self-hosted fonts out of `node_modules` and generates the download bundles, then
builds to `dist/`.

```
content/
  config.ts          Zod schema. The build fails on a violation, by design
  chapters/          One markdown file per chapter, numbered
  pages/             Standalone pages
src/
  lib/               Corpus assembly, chapter splitting, site constants
  layouts/           Base and Chapter, including the provenance rail
  components/
  styles/tokens.css  The palette and the type scale
scripts/prebuild.ts  Fonts and download bundles
```

If you are an agent working on this repo, read [CLAUDE.md](CLAUDE.md) first. It
is the specification, not a summary.

## Elsewhere

[talirezun.com](https://talirezun.com) ·
[Substack](https://talirezun.substack.com) ·
[Medium](https://medium.com/@talirezun) ·
[LinkedIn](https://www.linkedin.com/in/talirezun/) ·
[X](https://x.com/talirezun) ·
[GitHub](https://github.com/talirezun)
