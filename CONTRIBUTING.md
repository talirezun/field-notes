# Corrections

If something on [fieldnotes.talirezun.com](https://fieldnotes.talirezun.com) is
wrong, please tell me. I would much rather be corrected than quoted incorrectly,
and a permanent, machine-readable page makes a wrong claim worse than usual.

## Corrections are welcome

Open an issue, or open a pull request against the chapter file directly. Chapter
files live in [`content/chapters/`](content/chapters) and the file name matches
the URL: `/context-engineering` is
`content/chapters/01-context-engineering.md`.

A good correction says what is wrong, what it should say, and where you got
that. A link to a primary source is worth more than an argument.

Things that are always worth reporting:

- A factual error: a wrong number, price, date, benchmark, model name or
  version.
- A dead or wrong link, including a source citation that no longer resolves.
- A broken anchor. Anchors on this site are permanent by design, so if a link
  into a section stops working, that is a bug and not a content change.
- Something that was true when it was written and is not true now.

## Additions are my call

This is a distillation of my own published work and my own practice. If a
chapter is missing something, tell me and I will consider it, but I am not going
to merge content written by someone else into a corpus that is presented as
mine. That is not a judgement about the contribution. It is what makes the site
mean anything.

If you want to write your own version, the content is CC BY 4.0. Take it.

## What will not be published here

Two standing constraints, so nobody wastes their time:

- No architecture, infrastructure or security-posture material for products I
  run commercially.
- No compliance claims of any kind without my explicit written sign-off on the
  exact wording.

Pull requests that add either will be closed.

## Working on the site itself

Code contributions are welcome under the MIT licence in
[LICENSE-CODE](LICENSE-CODE). Before opening one, read
[CLAUDE.md](CLAUDE.md), which is the actual specification for how this repo
works, including the content schema and the rules the build enforces.

```bash
npm install && npm run dev
```

The build fails on a schema violation, on a source that cites a section anchor
that does not exist, and on a `related` entry pointing at a chapter that is not
there. Those failures are deliberate. Please do not soften them.
