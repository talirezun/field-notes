# Playbook: what happens when I publish something new

`CLAUDE.md` is the specification for this repo. This file is the editorial rule
for keeping it current: what to do with a new article, who decides, and what the
mechanical pass looks like.

Read this before touching a chapter. Read `CLAUDE.md` before touching anything
else.

---

## The one thing to understand first

Field Notes is not an archive of my articles. It is a different cut of the same
material.

My Substack essays run on a narrative axis. Here is what happened to me, in
order, with the mess included. The chapters run on a topical axis. Here is how
this works, and here is what it cost to find out.

That distinction is load-bearing. If chapters become summaries of articles they
compete with the articles and slowly kill them. Because they are a different
cut, each chapter sends people to the essays instead.

So the default answer to "should this new article go in Field Notes" is **not a
new chapter**. It is usually a citation and a paragraph.

---

## Three outcomes, in order of frequency

### 1. It becomes a source. Most articles, roughly eight in ten.

The article adds a fact, a number, a failure, or a reversal to something a
chapter already covers.

Do this:

- Add it to that chapter's `sources` array.
- Set `sections` to the anchors it actually backs. Not the whole chapter unless
  it really informs the whole chapter.
- Edit the prose wherever the article changed something. If nothing in the body
  needs to change, ask whether the citation is earning its place.
- Bump `updated`.

### 2. It earns a new section. Occasionally.

The article answers a question the chapter does not currently answer, but the
question clearly belongs to that chapter.

A new anchor is cheap and permanent. This is the right answer more often than
people expect, and it is the step most likely to be skipped in favour of
something bigger.

**Capacity matters here.** Four sections is the floor, seven is the ceiling, and
the validator enforces both. As of August 2026, chapters 01 and 02 are full at
seven. The other seven have exactly one slot each. When a chapter is full, the
choice is to replace a weak section, merge two, or split the chapter. Never
just add an eighth.

### 3. It earns a new chapter. Once or twice a year, at most.

Only when both of these are true:

- It answers a question none of the nine answer, and
- **at least three separate published pieces** support it.

The test: can you write four to seven question-shaped sections, each opening
with a self-contained answer, drawing on three or more sources?

If you get to two sections and stall, it is a section, not a chapter. If you
only have one article, it is a source. A chapter built from a single article is
a summary of that article, which is the failure mode this whole site is
designed to avoid.

---

## What never goes in

These are Substack's job. They stay there.

- Model release reactions and news commentary.
- Product announcements and launch posts.
- Campaign and engagement material.
- Event write-ups and personal reflection essays.

One exception. If a piece like this contains a durable fact that a chapter
needs, cite it as a source. Do not let it change the chapter's shape.

---

## The mechanical pass

About twenty minutes, once you know which chapter.

**1. Read the target chapter first.** Not the summary. The chapter.

**2. Decide the outcome.** Source, section, or chapter, using the rules above.
If it is a chapter, stop and confirm with me before writing.

**3. Add the source.** Newest last, so the array reads chronologically.

```yaml
sources:
  - title: "The exact published title"
    url: "https://talirezun.substack.com/p/the-real-slug"
    publication: "Substack"
    date: 2026-08-17
    sections: ["how-it-fails", "continuity"]
```

`url` must resolve. `title` must be the title on the page, not the one in the
catalogue, when the two disagree. `sections` entries must be anchors that exist
in that file, or the build fails.

**4. Edit the prose.** Distil, never reproduce. See the never-republish rule in
`CLAUDE.md`. If a number changed, change it and say what it changed from where
it matters.

**5. If you added a section**, pin its anchor and choose it carefully, because
you are choosing a permanent URL.

```markdown
## How do you hand the context over when the build starts? {#the-opening-prompt}
```

The first paragraph after the heading must stand alone. Someone extracting only
that paragraph must get something correct and useful.

**6. Bump `updated`** to today.

**7. Validate.**

```bash
npm run validate       # every chapter, all errors at once, about a second
npm run build          # the real gate
```

**8. If you added anchors**, record them:

```bash
npm run validate -- --update-lock
```

**9. Commit and push to `main`.** Cloudflare Pages rebuilds. Nothing else to do.

---

## Anchors, restated because it is the strongest rule here

Once published, an anchor is never renamed and never removed. `CLAUDE.md` has
the mechanics. What this file adds is the enforcement:

`content/anchors.lock.json` records every anchor that has ever shipped.
`npm run validate` fails if one stops resolving. The build cannot catch this on
its own, because a renamed anchor leaves a file perfectly self-consistent.

If a section genuinely has to go, do not delete the anchor. Alias it:

```yaml
anchorAliases:
  - from: "the-old-anchor"
    to: "the-section-that-replaced-it"
```

Then update the lock. The lock is a record of promises, not a cache. Only run
`--update-lock` when you have deliberately added or aliased something.

---

## The reverse flow, which is the part people skip

**Before publishing a new article, read the chapter that covers it.**

Two useful things happen.

Either the chapter already says it well, and the article gets sharper by linking
to the anchor instead of re-explaining from scratch.

Or the article contradicts the chapter, which means my position has moved. That
is a decision to make deliberately rather than discover a year later. Every
contradiction found during the first authoring pass existed because there was
nowhere to notice it.

When you find one, do not silently pick a side. Record it in `content/NOTES.md`
and ask me.

---

## Stop and ask when

- The material touches product compliance, security posture, or infrastructure.
  That is the standing rule in `CLAUDE.md` and it has no exceptions.
- Two sources conflict on a fact, a number, or a date.
- A chapter is coming out thin and padding it is tempting.
- A new chapter is being proposed.
- An anchor would have to change.

A chapter that is honestly short is fine. A chapter with invented connective
tissue is not.

---

## Files

| File | What it is |
|------|-----------|
| `CLAUDE.md` | Repo specification. Schema, voice, sourcing rules, anchor mechanics |
| `content/PLAYBOOK.md` | This file. The editorial rule for updates |
| `content/config.ts` | The schema itself. The build fails on violation |
| `content/anchors.lock.json` | Every anchor ever published. Enforces the contract |
| `content/NOTES.md` | Audit trail. Contradictions and open questions. **Gitignored, private** |
| `scripts/validate-chapters.mjs` | Fast validator. Run it while editing |
