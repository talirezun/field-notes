---
title: "What I Shipped and What It Cost"
number: 9
slug: "what-i-shipped"
status: "published"
question: "What have you actually built, and what did it take?"
summary: >
  The products I built and run, described in terms of what they do and what
  building them cost me. No architecture diagrams and no capability claims I
  cannot point at a published source for. Just the account.
updated: 2026-08-20
sources:
  - title: "The Curator"
    url: "https://github.com/talirezun/the-curator"
    publication: "GitHub"
    sections: ["the-curator"]
  - title: "Second Brain to Shared Brain: Building a Neural Network of Your Own Knowledge"
    url: "https://talirezun.substack.com/p/second-brain-to-shared-brain-building"
    publication: "Substack"
    date: 2026-07-03
    sections: ["the-curator"]
  - title: "Lumina"
    url: "https://luminawidget.xyz"
    publication: "Product site"
    sections: ["lumina"]
  - title: "Lumina: An AI Agent Your Business Can Stand Behind"
    url: "https://talirezun.substack.com/p/lumina-an-ai-agent-your-business"
    publication: "Substack"
    date: 2026-07-31
    sections: ["lumina", "what-it-cost"]
  - title: "Six Months After I Shipped Lumina"
    url: "https://talirezun.substack.com/p/six-months-after-i-shipped-lumina"
    publication: "Substack"
    date: 2026-07-10
    sections: ["lumina"]
  - title: "I Could Tell You My AI Has Never Lied. I'm Not Going To."
    url: "https://talirezun.substack.com/p/i-could-tell-you-my-ai-has-never"
    publication: "Substack"
    date: 2026-08-06
    sections: ["lumina", "what-i-would-do-differently"]
  - title: "Why I Ditched RAG Pipelines for 1M Token Context Windows"
    url: "https://medium.com/@talirezun/why-i-ditched-rag-pipelines-for-1m-token-context-windows-d5a2982f7cce"
    publication: "Medium"
    sections: ["moj-ai"]
  - title: "How I Built an AI-Powered Vacation MCP Search Tool in 14 Days"
    url: "https://medium.com/@talirezun/how-i-built-an-ai-powered-vacation-mcp-search-tool-in-14-days-and-why-you-should-care-128e09bf6bd0"
    publication: "Medium"
    sections: ["the-smaller-ones"]
  - title: "Conduit"
    url: "https://github.com/talirezun/conduit-agent"
    publication: "GitHub"
    sections: ["the-smaller-ones"]
  - title: "A Year in the Review"
    url: "https://talirezun.substack.com/p/a-year-in-the-review"
    publication: "Substack"
    date: 2026-06-23
    sections: ["the-smaller-ones", "what-it-cost"]
  - title: "From Prototype to Production: Building an AI Widget Platform in 30 Days"
    url: "https://medium.com/@talirezun/from-prototype-to-production-building-an-ai-widget-platform-in-30-days-23c603c91475"
    publication: "Medium"
    sections: ["what-it-cost"]
related: ["building-without-being-a-developer", "agent-memory"]
tags: ["projects", "the-curator", "lumina", "build-log"]
---

## What is The Curator and why did I build it? {#the-curator}

A local, open-source second brain. You drop a PDF, an article or a note into it, and it reads the source and writes an interlinked wiki out of it: entity pages, concept pages, and a summary page for the source. Everything stays as plain markdown on your own machine, and an MCP server exposes the whole graph to a frontier model as a set of seventeen tools, so the model can traverse it and write findings back during a live session.

I did not build it as a product. I built it because I had a memory problem in my own work and nothing available solved it the way I wanted it solved.

Practical facts, and the ones people most often get wrong about it:

**It is MIT licensed.** Free to use, fork and modify.

**It needs an API key.** Either Google Gemini or Anthropic. There is no version of this that does the ingestion on nothing, and I would rather say that plainly than let a "runs entirely locally" impression stand. Gemini has a free tier, though it was tightened substantially at the end of 2025 and one batch of PDFs will usually exhaust a day of it. On a paid key, moderate solo use runs around five euros a month. If you want nothing to leave the machine at all, it works against a local model, with the quality trade you would expect.

**Installation is a one-line script on macOS, or clone and `npm install` elsewhere, on Node 18 or newer.** It runs on `localhost:3333`. Obsidian opens the same folder natively, so the graph view comes free.

It is live and actively developed. The collaborative Shared Brain layer is still beta and I would not describe it otherwise.

What went wrong is in chapter two in detail, so briefly here: early versions produced duplicate ghost pages once a wiki got large, the same entity spawning three near-identical files. A shared-brain release nearly shipped a bug that could have silently emptied a collective wiki while reporting success. And my own test suite was, for a while, writing test data into real user knowledge folders because a directory resolver preferred the production configuration over the test override. That last one is the most embarrassing thing in this chapter and it belongs here rather than buried.

## What is Lumina? {#lumina}

A business uploads its own documents and gets a chat agent that answers from them. When the documents do not cover something, it says so rather than inventing an answer. It deploys as a website widget and across several messaging channels from one engine, with a shared inbox where staff can see every conversation, take over a thread from the AI mid-conversation, and search across channels.

The design choice underneath it, which I have written about publicly and which shapes everything else, is that the whole document set goes into the model's context rather than being chunked, embedded and retrieved. That decision came out of the year I spent failing to make retrieval work well enough on a different product, which is the next section.

It went live at the start of 2026, built over thirty days in December 2025. A second generation rebuilt substantially more of it in about a month, across roughly eight hundred and sixty commits. It is in production and serving businesses.

The story I would keep if I could only keep one is not a technical one.

A hair studio in Ljubljana used it daily. Their assistant began telling real visitors, mid-conversation with real customers, that it was having trouble connecting. The cause was a two thousand character limit on personality instructions that I had set months earlier as a safety measure and then completely forgotten about. The owner had written longer instructions; the system silently rejected them. I traced it and fixed it the same day, raised the limit fourfold for everyone rather than just for them, and added a live character counter so nobody walks into an invisible wall again.

What that taught me was not about character limits. There is a moment when a project becomes a business, and it is not funding or launch or revenue. It is the first time a real person's real customers feel it when something breaks. I have started calling that the responsibility threshold and it arrived earlier than I expected it to.

A later version of the same shape, at a larger scale: a customer uploaded a document that met every stated requirement and was, on its own, far larger than the entire available context budget. Their assistant stopped answering anyone. The requirements were not wrong. They were incomplete, and an incomplete written rule is invisible until somebody walks into it. The behaviour I chose afterwards is that the system refuses rather than degrades, because an assistant that stops is recoverable and an assistant that quietly gets worse is not.

And the claim I decline to make. I will not tell you Lumina has never hallucinated. No customer has reported one, and "no customer reported a hallucination" and "the system does not hallucinate" are different sentences. What I have is an absence of complaints, which is a floor rather than a number.

## What is Moj AI, and what did three rewrites teach me? {#moj-ai}

A Slovenian-language assistant for building regulation. You ask a question about what you can build on a particular plot in a particular municipality, and it answers from the actual construction acts and the municipal spatial plans, with article numbers and page citations. It is live and openly labelled as early beta.

It took a year and three complete architectural rewrites, and it is the project that taught me the most per hour spent.

The technical arc is in chapter one, so I will not repeat it: a conventional retrieval pipeline that plateaued at eighty percent accuracy, could not get past eighty-five on complex tables, and destroyed exactly the data that mattered. What replaced it reads whole documents rather than fragments.

What I want to record here is the part that was not technical. The hardest thing in that year was not writing anything. It was working out when to throw the current version away and start again. Three times, as it turned out, and I resisted each one for longer than I should have because there was working software in front of me.

Some numbers from the version that did not survive, because the cost of being wrong is worth writing down. Around three hundred dollars a month in infrastructure for development and testing alone, before a single customer existed. Eight to ten minutes for every deployment cycle, which sounds trivial until you multiply it by how many times you iterate. And a deployment numbered in the hundreds still failing.

One thing that did survive from that period is a method rather than a system. Over that project I did more than a hundred successful handovers between agent sessions using written handoff documents, and that discipline is the reason the work accumulated at all rather than restarting every time a context window filled.

## What else is out there? {#the-smaller-ones}

Four smaller things, three of them open source. None of them are businesses. They exist because a specific problem annoyed me enough to fix, and the reason they are worth listing is that the failure modes are more legible on small projects than on large ones.

**MountVacation MCP** is an open-source MCP server, MIT licensed, that lets any MCP-compatible assistant search a European mountain accommodation database and hand back real results with booking links. Ten tools. It needs the provider's API key. I built it in fourteen days without writing a line of the TypeScript myself.

The day one version worked and was wrong. It returned the first batch of results and stopped, because the underlying API pages results in groups of thirty while a search in a busy region has hundreds. Fixing that took three separate strategies, retry logic with backoff, and partial-result handling so that a failure on the fourth page returns the ninety results already collected rather than an error. Then an automated testing loop found the rest: searches in one country returning nothing at all, children's ages parsed incorrectly, currency conversion failures, and location lookups failing for particular regions. It remains a proof-of-concept rather than a production-grade commercial service, and I say so in the repository.

**ARIA**, an avatar platform, is a client project and the largest single thing on this list: around seventeen thousand lines, close to four hundred commits, roughly three hundred distinct agent sessions, about six weeks to a production MVP. I have never published its feature set and I am not going to here, because it is not mine to describe.

**Conduit** is an Apache-licensed framework for setting up a governed personal agent that lives in a folder on your own machine, with the setup done by pasting prompts rather than typing terminal commands. It is explicitly aimed at people who are not developers, and it uses The Curator as its memory layer. It is the earliest-stage thing I have published. Its documentation currently lists no known limitations, which at this age means they have not been found yet rather than that they do not exist.

**ØØT** is the organisational framework, and it has its own chapter.

## What did building these actually cost? {#what-it-cost}

Far less money than anyone expects and far more time than anyone admits. The first generation of Lumina cost under a hundred euros in model credits across thirty days. It also cost around two hundred hours of my own time inside those thirty days, evenings and weekends included, and roughly half of that was context engineering rather than building anything.

I need to flag something about that first figure before it travels any further. I have published it as both under a hundred and under a thousand, in different pieces, for the same build. The lower number is the one I believe and the one I have repeated most often since, but I would rather point at the discrepancy than quietly pick the more impressive version and hope nobody checks.

The rest of the ledger, all from my own records:

Across twelve months I logged 1,278 contributions, ninety-eight percent of them commits, spread across four products that shipped.

The avatar platform burned close to three hundred dollars a day in credits at peak. That is by some distance the most expensive thing on this page, and it was expensive because a client deadline made parallelism worth paying for.

Moj AI cost about three hundred dollars a month in infrastructure during development, before any customer existed.

One intensive day on an early command-line agent, back when it was billed by usage, cost me over three hundred euros. That is the day I stopped using that tool, and the reason was economics rather than capability.

Those three hundreds are three unrelated things at three different scales, which is a good illustration of how easy it is to build a misleading story out of true numbers.

Two structural points about cost that took me too long to learn.

**Subscriptions beat metered billing for development work.** Not because the monthly total is lower, but because on metered billing you start optimising for cost instead of quality. You skip the audit run. You do not re-verify. You stop asking for the second opinion. The bill goes down and the work gets worse.

**Every figure above excludes most of the actual cost.** Hosting, payment processing, domains, and the ongoing operational work of keeping a live product alive are not in any of these numbers. Nor is the two-year learning curve that made a thirty-day build possible, which is the largest cost in this chapter and appears in nobody's accounting, including, usually, mine.

## What would I do differently? {#what-i-would-do-differently}

Write the test at the same time as the document, rather than discovering months later that the document was the only thing enforcing anything. Almost every serious problem in this chapter traces back to something that was written down and never checked, and the fix is mechanical and boring and I did not do it early enough.

The rest of the list, in rough order of how much it would have saved me:

**Never let the documentation lag the code.** My own product reads my own documentation. When I corrected something in code and did not carry it across, my assistant kept answering prospective customers from the version I had already fixed. That is a very specific consequence of a very general sloppiness.

**Test against live services earlier.** A completely green offline suite told me nothing about the two most serious bugs I have shipped, both of which needed real storage, real network conditions and simulated concurrency to surface.

**Solve authentication in the architecture phase.** Every automated testing effort I have run has eventually broken on a login wall, and every time it was foreseeable.

**Do not build the second thing until the first one has real users.** Real users find failures you cannot imagine. The forgotten character limit was not going to be caught by any amount of me testing my own product.

Then two changes of mind, which are harder to write.

I assumed for years that better models would democratise this. Having now run a product with real customers for the better part of a year, I think the opposite is happening: the gap between people who work this way and people who do not is widening as the models improve, not closing. The tools reward people who already know how to specify, structure and verify, and those people pull further ahead.

And I contradicted myself in public. I said for a year that the bottleneck was never the model. Then, writing up a rebuild, I said that attempting it a few months earlier would have been close to impossible, not hard, impossible. Those two statements cannot both be true in their strong form. What reconciles them is that they are about different work: for a well-specified build, the bottleneck really is context and always was. For a hard orchestration problem at the edge of what the tools could do, the model was the constraint, and it lifted.

I would rather leave both statements standing with that note attached than tidy one of them away. The tidy version would be more quotable and less true.
