---
title: "Agent Memory and Second Brains"
number: 2
slug: "agent-memory"
status: "published"
question: "How do you give an AI agent memory that survives the session?"
summary: >
  An agent forgets everything when the window closes. A second brain is the
  durable half of the system: structured, linked notes the agent reads back on
  demand, so accumulated thinking outlives any single conversation.
updated: 2026-08-20
sources:
  - title: "The Agent Memory Problem, and Why It Matters"
    url: "https://talirezun.substack.com/p/the-agent-memory-problem-and-why"
    publication: "Substack"
    sections: ["the-problem", "four-layers"]
  - title: "Building Knowledge Immortality Through the Second Brain Architecture and The Curator App"
    url: "https://talirezun.substack.com/p/building-knowledge-immortality-through"
    publication: "Substack"
    sections: ["what-a-second-brain-is", "knowledge-immortality"]
  - title: "The Second Brain That Grows Smarter and Lives on Your Computer"
    url: "https://talirezun.substack.com/p/the-second-brain-that-grows-smarter"
    publication: "Substack"
    sections: ["what-a-second-brain-is"]
  - title: "From Graph to Intelligence: The My Curator MCP and the Art of Querying Your Second Brain"
    url: "https://talirezun.substack.com/p/from-graph-to-intelligence-the-my"
    publication: "Substack"
    sections: ["retrieval"]
  - title: "The Shared Brain: When Second Brains Start Thinking Together"
    url: "https://talirezun.substack.com/p/the-shared-brain-when-second-brains"
    publication: "Substack"
    sections: ["shared-brain"]
  - title: "Second Brain to Shared Brain: Building a Neural Network of Your Own Knowledge"
    url: "https://talirezun.substack.com/p/second-brain-to-shared-brain-building"
    publication: "Substack"
    date: 2026-07-03
    sections: ["four-layers", "retrieval", "shared-brain", "what-broke"]
  - title: "The Curator — Product Update"
    url: "https://talirezun.substack.com/p/the-curator-product-update"
    publication: "Substack"
    date: 2026-06-18
    sections: ["what-broke"]
  - title: "The Curator"
    url: "https://github.com/talirezun/the-curator"
    publication: "GitHub"
    sections: ["what-a-second-brain-is", "retrieval"]
  - title: "Context is the Code: The Complete Three-Phase Process for Building with AI Agents"
    url: "https://talirezun.substack.com/p/context-is-the-code-the-complete"
    publication: "Substack"
    date: 2026-06-03
    sections: ["the-problem"]
related: ["context-engineering", "coding-agents"]
tags: ["agent-memory", "second-brain", "knowledge-management", "mcp"]
---

## Why does an agent forget, and why is that hard to fix? {#the-problem}

Because by default every conversation starts from nothing. The model has no idea who you are, what you are building, or what was decided yesterday. For a single question that is fine. For a project that runs for months it is a structural problem, and the reason it is hard to fix is not storage. It is that an agent needs a different shape of memory than a chatbot does.

A chatbot answers a question. You ask, it retrieves something relevant, it responds, it is done. An agent runs a task. It opens a file, cross-references a policy, writes a summary, calls a tool, checks the result, and loops. What it needs at any given moment is almost never three semantically similar paragraphs. It is the whole package: the policy and the exception to the policy, the contract clause and the definition section that changes what that clause means. Miss one piece and the agent either fails, or does something worse and produces an answer that is plausible and wrong.

The obvious fix is a bigger window, and the obvious fix does not work. In eighteen months of running retrieval systems in production I documented hallucination rates above twenty percent on context-dependent queries. And even with a million-token window and a frontier model, quality degrades noticeably somewhere around eighty to ninety percent utilisation, in ways that are subtle enough that you will not notice them happening. Chroma's research on this is the clearest I have seen reported.

So capacity is not the answer. Structure is.

## What kinds of memory are there, and which one do you actually need? {#four-layers}

Four, and conflating them is where most of the confusion lives. **In-context memory** is whatever is sitting in the active session, and it evaporates when the session ends. **External memory** is the retrieval pattern: fast, stateless, re-derived on every single query. **Persistent memory** is plain files that survive between sessions but do not inherently connect to each other. **Semantic memory** is a compiled, cross-referenced structure that compounds, where each new source integrates with what is already there.

Most projects need three of the four and reach for the wrong one first.

I should be straight about the history of this framing, because it is a good example of how the practice moves. When I wrote about the agent memory problem in May 2026, I laid out the landscape of approaches the industry was trying and concluded that no single one was adequate. The clean four-layer split came later, in July, and it is me spelling out something I had described at length without ever naming properly. If you read the two pieces back to back the second one is not a correction. It is the shape finally becoming visible.

The layer that matters most for anyone building over months rather than days is the fourth, and the argument for it is about compounding rather than accuracy.

Retrieval treats your documents as a lookup table. Chunk everything, embed it, and at query time fetch whatever is mathematically closest. It works, and it starts from zero every single time. Nothing accumulates. The tenth question you ask gets no benefit whatsoever from the fact that you asked nine questions before it.

Curation is the opposite bet: read once, integrate permanently. The knowledge is compiled and kept current rather than re-derived on demand. Retrieval fetches. Curation remembers.

## What is a second brain, in concrete terms? {#what-a-second-brain-is}

A folder of markdown files on your own machine that an AI keeps organised. You drop in a PDF, an article or a text file, and it reads the source and writes an interlinked wiki out of it: entity pages for the people, tools and companies, concept pages for the ideas, and a summary page for the source itself. Roughly five to fifteen linked pages per source. Drop in something on the same subject a month later and it updates the existing pages rather than creating near-duplicates, so the wiki gets denser rather than just bigger.

The tool I built for this is The Curator. It is open source under MIT, it runs locally on `localhost:3333`, and the files it writes are ordinary markdown that Obsidian opens natively. Nothing about the format is proprietary and nothing is locked in. If the project disappeared tomorrow you would still have a folder of readable notes.

Two things about it that people get wrong, and I would rather state them plainly than let the marketing version stand.

**It needs an API key.** Either Google Gemini or Anthropic. There is no version of this that runs the ingestion pipeline on nothing. Gemini has a free tier, though Google tightened it substantially at the end of 2025 and a single batch of five to ten PDFs will usually exhaust a day's quota. On paid keys, moderate solo use lands around five euros a month. If you would rather nothing left your machine at all, it runs against a local model through LM Studio, and the trade is exactly what you would expect: full privacy, lower quality.

**The output is roughly ninety-five percent right, not a hundred.** An AI building a knowledge graph makes mistakes: links that point nowhere, pages that end up orphaned, the same concept written twice under slightly different names. That is why there is a health layer that scans for broken links, orphans and near-duplicates. Every scan is opt-in, priced before you run it, and gated behind a preview, so nothing destructive happens without you signing off on it.

## How does the model actually reach the notes? {#retrieval}

Through an MCP server that exposes the wiki to a frontier model as a set of tools. Seventeen of them, ten read and seven write. The model can list domains, pull an index, search across the wiki, read a specific page, and then, if you let it, write findings back. Once that bridge is connected, the model is not being handed a pile of documents. It is navigating a structure.

The graph-native tools are the ones that justify the whole architecture, because they answer questions a flat index cannot answer at all.

`get_backlinks` returns every page that links *to* the one you are looking at. A search index has no concept of this. `get_connected_nodes` walks the graph outward up to two hops and ranks what it finds by distance, which is how you surface a connection you never consciously made. `get_graph_overview` returns the shape of the whole thing: node and edge counts, a breakdown by page type, the top twenty hubs, the orphans, the most-used tags.

The working query pattern is boring and it is the right one: list the domains, pull the index, search, then read the specific nodes that matter. Cheap traversal first, expensive full reads last. It is the same just-in-time discipline from the previous chapter, applied to notes instead of code.

For scale, my own articles domain sits at roughly three thousand three hundred nodes and fifteen thousand edges as of mid-2026, built by ingesting sources over about six months. All seventeen tools work identically against a local model with no network, which matters if the material is sensitive.

What I cannot tell you is how this behaves at ten times that size. I have not tested it against tens of thousands of nodes, multiple active domains and years of ingestion. Traversal efficiency and token consumption at that scale are open questions, and writes through the MCP are already noticeably slow on large wikis. This is generation one of something.

## What changes once your thinking outlives the session? {#knowledge-immortality}

The economics of maintaining a knowledge base invert. Historically, keeping a structured, interlinked, current body of knowledge was a full-time job, which is why it was the preserve of institutions with librarians and archivists on staff. Nobody did it for themselves because the bookkeeping cost more than the knowledge was worth. That constraint is gone, and it is gone for individuals rather than just for organisations.

The tedious part was never the reading or the thinking. It was the filing.

What that buys, at the personal end, is expertise that does not evaporate. Thirty years of judgement about a domain currently lives in one head and leaves when that head does. Written down as an interlinked structure that a frontier model can traverse, it becomes something you can interrogate, hand over, or keep working with after the person who built it has moved on.

The durability bet is markdown, deliberately. Plain text has been readable for decades and will stay readable for decades more, which is not something you can say about any particular application's database format. The whole design follows from wanting the notes to outlive the tool that made them.

I would rather not oversell the personal version of this. Compounding is real and I feel it daily in my own work. But the claim I am making is about the mechanism, not about having proven that a lifetime of knowledge survives, because not enough time has passed for anyone to have proven that.

## What happens when more than one person contributes? {#shared-brain}

The same architecture works for a group, but only if you solve the privacy problem first, and the solution is that raw notes never leave anyone's machine. A model running locally on each contributor's own computer pre-processes their changed pages into compact delta summaries before anything is sent. The collective wiki receives structured knowledge, not a copy of somebody's private thinking.

That one design decision is what the entire feature rests on. Without it, a shared brain is just a folder everyone can read, and nobody sensible would put their working notes in it.

The rest follows from it. You opt in specific domains, not your whole wiki, so your journal and your unfinished thinking and your unrelated client work stay where they are. Synthesis reconciles contradictory formulations from different contributors, fixes links that break across the join, and attributes provenance to every fact it integrates. What comes back to you is a separate read-only mirror domain, queryable exactly like any of your own. The principle, stated as plainly as I can: private brains remain private, and shared intelligence is built only from explicit contributions.

Now the part that matters more than any of the above.

It has not been proven at the only scale that counts. Everything so far has been verified by tests, simulations, and solo or paired use between me and a handful of early testers. That tells me the software behaves correctly under everything we could think to simulate, including real concurrency against real storage and real network conditions. It does not tell me how it behaves when twenty actual people with actual inconsistent habits and actual half-finished contributions use it together for a full semester. That test cannot be simulated. It has to happen, and it has not happened yet.

So the feature is beta-labelled, the workflows may change, and anyone deploying it should keep independent backups. I would rather say that than discover it in public.

## What went wrong building this? {#what-broke}

Almost every real bug was silent. That is the honest summary of a year of building memory infrastructure, and it is the single most useful thing I can hand over. The failures that hurt were not the ones that threw errors. They were the ones that completed, reported success, and left something quietly broken behind them.

The worst of them surfaced during production battle-testing before wider release, and it is the reason that testing existed.

Removing a contributor from a shared brain is a routine administrative action. Delete their pages, rebuild the collective wiki from what remains. Under a particular timing condition, the rebuild read stale state, produced a completely empty wiki, and reported success. A green checkmark, no error anywhere, and a semester of collective work gone. Alongside it, a simpler race condition where two contributors' machines creating the same brand new page at the same instant produced an error for whoever lost. That one I am relaxed about, because it was visible. You would know something had gone wrong.

Neither bug was catchable offline. Both required testing against real storage, real network conditions and simulated multi-machine concurrency. If I had stopped at "the offline tests pass," a cohort's shared wiki could have been silently deleted on my watch.

That release ran on five hundred and forty-seven assertions, five hundred and nineteen of them offline and the remainder running against live services and live credentials. The offline suite was entirely green before the two bugs above were found. I do not think there is a stronger argument anywhere in my work for why offline test coverage is a floor rather than a finish line.

The earlier failures rhyme with it.

Synthesis could be permanently bricked by a single malformed contribution, so one person's bad page took down the whole run. Contribution tracking originally filtered by wall-clock time, which meant a contributor whose machine clock was skewed could have their work silently dropped from a synthesis. A push operation only ever covered one opted-in domain at a time, quietly, without saying so. Failed operations could render as a false success. The near-duplicate scanner became unreachable behind an interface regression and simply vanished from the screen for anyone whose wiki was structurally clean, which was precisely the people who most needed a semantic scan.

And one that belongs in this chapter because it is the most embarrassing: my own test suite was silently writing test data into real user knowledge folders, because the code that resolves which directory to use preferred the production configuration over the test override. Nobody lost anything and the stray data was cleaned up. It should never have been possible.

Earlier still, before any of the collaborative work, large wikis produced ghost files: the same entity spawning three slightly different pages because deduplication was not strict enough. That one is unglamorous and it took real work to fix, and it is the sort of thing that decides whether a knowledge graph is usable at size or just impressive at demo scale.

There is a pattern in all of it, and it is the same pattern as the last chapter. The failure mode of these systems is not a crash. It is a confident, successful-looking completion with something quietly missing underneath. Build your checks accordingly.
