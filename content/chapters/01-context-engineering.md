---
title: "Context Engineering"
number: 1
slug: "context-engineering"
status: "published"
question: "How do you give an AI agent the context it actually needs?"
summary: >
  Context engineering is the continuous work of deciding what an agent sees,
  and when. It runs through every phase of a build rather than just the first
  one, and it is where most agent work quietly fails.
updated: 2026-08-20
sources:
  - title: "Behind the Curtain: The Three-Phase Process I Use to Build Every AI-Coded Product"
    url: "https://talirezun.substack.com/p/behind-the-curtain-the-three-phase"
    publication: "Substack"
    date: 2026-03-16
    sections: ["three-phase-build", "how-it-fails"]
  - title: "Context is the Code: The Complete Three-Phase Process for Building with AI Agents"
    url: "https://talirezun.substack.com/p/context-is-the-code-the-complete"
    publication: "Substack"
    date: 2026-06-03
    sections: ["what-it-is", "three-phase-build", "the-opening-prompt", "what-to-load", "how-it-fails", "continuity"]
  - title: "Blueprint of a Frontier Coding Agent"
    url: "https://talirezun.substack.com/p/blueprint-of-a-frontier-coding-agent"
    publication: "Substack"
    sections: ["what-it-is", "what-to-load", "how-it-fails"]
  - title: "From Prompts to Precision: The Art & Science of Context Engineering"
    url: "https://medium.com/@talirezun/from-prompts-to-precision-the-art-science-of-context-engineering-cebd47462b1c"
    publication: "Medium"
    sections: ["what-it-is", "the-opening-prompt"]
  - title: "Why I Ditched RAG Pipelines for 1M Token Context Windows"
    url: "https://medium.com/@talirezun/why-i-ditched-rag-pipelines-for-1m-token-context-windows-d5a2982f7cce"
    publication: "Medium"
    sections: ["what-to-load"]
  - title: "The Mixed Fleet"
    url: "https://talirezun.substack.com/p/the-mixed-fleet"
    publication: "Substack"
    date: 2026-08-17
    sections: ["how-it-fails", "continuity"]
  - title: "Lumina: An AI Agent Your Business Can Stand Behind"
    url: "https://talirezun.substack.com/p/lumina-an-ai-agent-your-business"
    publication: "Substack"
    date: 2026-07-31
    sections: ["how-it-fails", "continuity"]
  - title: "From 0 to Dev in One Day: What a Real Coding Harness Actually Looks Like"
    url: "https://talirezun.substack.com/p/from-0-to-dev-in-one-day-what-a-real"
    publication: "Substack"
    date: 2026-07-20
    sections: ["the-opening-prompt", "for-non-developers"]
  - title: "Context as Architecture: Full-Corpus Grounding, Orchestrated Agentic Development, and Compliance-by-Design"
    url: "https://talirezun.com/download/context-as-architecture/"
    publication: "Research paper"
    date: 2026-08-01
    sections: ["what-to-load", "continuity"]
related: ["agent-memory", "coding-agents"]
tags: ["context-engineering", "ai-agents", "methodology"]
---

## What is context engineering, and how is it different from prompting? {#what-it-is}

Prompt engineering is what you say in one message. Context engineering is everything else the model can see when it reads that message, and how you manage that across hours, sessions and days: what gets loaded, what gets summarised, what gets dropped, what gets carried forward. Andrej Karpathy called it the delicate art and science of filling the context window with just the right information for the next step, and that is still the cleanest definition I have found. Harness engineering sits one ring further out again, the machinery that does the loading and decides what the agent is allowed to touch. Three concentric levels, each containing the one inside it.

I got the framing wrong the first time I published it.

In March 2026 I wrote up the three-phase process I use to build every product, and I named the first phase "Context Engineering." Three months later I ran a live workshop with MBA students in the Chasing Jarvis programme at COTRUGLI. I expected tool questions. Which agent, which model, Cursor or Claude Code. What I got instead was a student who put her hand up after I finished walking through the phases and asked what happens to context in phase two and phase three.

I did not have a good answer, because there was not one. By calling phase one "context engineering" I had implied it was a thing you do once and then leave behind. Students read the phases as sequential and cleanly separated: do the context work, then build, then deploy. That reading produces real failures, and it was my fault for teaching it that way.

Context engineering is not a phase. It is the practice that makes phase one worth doing, keeps phase two coherent, and lets you trust what comes out of phase three. The useful analogy is not giving someone an instruction. It is preparing their workspace before they arrive: the tools, the background, the examples, the constraints, everything they need to do the job without having to guess at any of it.

## How do you structure the first phase of a build? {#three-phase-build}

Phase one produces documents, not code. No repository, no environment, nothing committed. The output is a small set of markdown files that become the shared brief for every agent that touches the project afterwards. For a real product it takes three to seven days, and it cannot be compressed, because the slow part is thinking rather than typing.

After the workshop I renamed the phases to stop implying otherwise. They are now Research, Design and Foundations, then The Build Phase, then Debug, Audit and Deploy.

Phase one starts before the documents, and it does not start with a spec. I open a project with whatever model I am using as my daily driver and I talk, using voice-to-text rather than typing, because I explain an idea more fully out loud than I do on a keyboard. What I ask for first is a foundational concept document: does this idea make sense in the world, what already exists, what would users actually want, and what have I not thought to ask yet. That step exists because the idea on the napkin is almost never the idea you should build, and phase one is the process of finding out what you are actually building.

Then four files.

- **architecture.md** decides the stack and says why. Services, databases, external APIs, hosting, which model powers which capability. Not a full specification, a set of chosen building blocks with the reasoning attached.
- **blueprint.md** is the feature specification split into components, with the boundary between front end and back end made explicit. It also carries the economics. An agent directed by an incoherent business model builds an incoherent product.
- **ui_ux.md** describes how a real person moves through the application. Onboarding, navigation, what each screen shows, what each interaction does. Not pixels. Enough that an agent can make sensible decisions without me specifying every layout choice.
- **security.md** is the one people skip and it is the one whose absence costs most. Which regulations apply, what authentication is used, what has to be encrypted, what the rate limits are. Written here, the agent builds it in. Left out, you retrofit it after an audit finds the gaps.

If the thing you are building is itself an AI system, a reasoning layer or a retrieval pipeline or a multi-agent workflow, add a fifth. An orchestration document that says how the AI components connect, which models power which step, and what data moves between them. Agents are noticeably worse at inferring this than they are at inferring ordinary application structure.

The research pays for itself in decisions you do not have to unwind. On an AI avatar assistant I built for a niche platform, phase one surfaced almost immediately that I should be evaluating ElevenLabs and HeyGen for the video avatar streaming rather than building that capability myself. That is weeks of misdirected development that never happened.

My rule of thumb is that every hour in phase one saves five in phase two. I should be honest that this is a rule of thumb rather than a measurement. What I can say with more confidence is the inverse, and I have watched it play out on every project where I rushed the front end of the work: chaos in phase two is almost always a phase one failure, and not a failure of effort. A failure of clarity.

One thing worth saying plainly, because it changes how you write these files. They are not for you. They are for the agent.

## How do you hand the context over when the build starts? {#the-opening-prompt}

With an opening prompt that does four things at once: points the agent at the documents, invites it to find the gaps in them, asks for a plan before any code, and sets the standing rules that will govern the whole build. The quality of that prompt is a direct reflection of the quality of phase one. If the documents are thorough it writes itself. If they are thin you will be able to feel it while typing.

Before the prompt, the setup. Project folder named after the project, a `docs` subfolder inside it holding every phase one file, and a GitHub repository connected to the agent. Most frontier harnesses connect over OAuth in one click. This is not optional. Version control here is not tidiness, it is the recovery mechanism for the times an agent does something you disagree with, and you will need it more often than you would like to admit.

The prompt itself looks roughly like this, and the shape matters more than the wording:

```
I'm building [what it is, in one sentence].
I've prepared detailed project documentation: @architecture.md,
@blueprint.md, @ui_ux.md, @security.md

Please read this documentation first. Identify any gaps or improvements
you see, and then prepare a detailed build plan.

Rules:
(1) Push all substantial development milestones to GitHub
(2) Maintain and update documentation in parallel with development,
    including both user guides and technical guides
(3) Update the standing context file after every major build milestone
```

Notice what it does not do. It does not say "build me a second brain app." It hands over context, asks the agent to argue with that context before acting on it, and separates planning from execution so you can disagree with the plan while disagreeing is still cheap.

The `@` is doing real work. It is how you point an agent at a specific file so it reads that file before doing anything else, rather than inferring what you meant from the folder around it.

The three standing rules are the ones I keep on every project, and each one exists because of something that went wrong without it. Push milestones, so there is always a state to roll back to. Maintain the documentation in parallel, because documentation written afterwards never gets written. Update the standing file at every milestone, because the agent that starts tomorrow only knows what that file tells it.

## What belongs in an agent's context, and what does not? {#what-to-load}

Load the smallest payload that answers the step in front of you, and load it when that step arrives rather than at the start. What earns its place: architectural decisions, unresolved bugs, the standing rules of the project, and the specific documents the current task actually touches. What does not: redundant tool output, whole files when you need three lines, and tools the agent will not call in this step.

More context is not better context, and this took me a while to accept.

The frontier harnesses have already worked this out. They read with grep, glob, head and tail rather than loading complete files. When they compact a session they keep architectural decisions and unresolved bugs and throw away redundant tool results. On the tooling side, the effect is counterintuitive enough that it is worth stating: the Vercel v0 team reportedly removed around eighty percent of their available tools and got better results. More tools often means worse performance, because every tool definition is context the model has to hold and reason about.

The same principle showed up in a completely different shape when I rebuilt Moj AI, a legal document assistant for Slovenian building regulation. I spent about a year on a conventional retrieval pipeline: chunk the documents, embed the chunks, store the vectors, retrieve the closest matches. It shipped at eighty percent accuracy and nothing I tried got it past eighty-five percent on complex table data. I tried smaller chunks, larger chunks, overlapping chunks, three embedding models, metadata on chunks, hybrid search, multiple retrieval passes, reranking. I even built a second model to check the first one's answers.

The failures were specific and they were the same failure each time. A table saying maximum coverage forty percent, maximum height twelve metres, minimum parking one and a half spaces per unit came back as "coverage and height restrictions apply, parking is required." The structure was destroyed and the numbers, which were the entire point, were lost. Cross references broke, because section 10.3 pointing at section 4.2.1 does not survive the two sections landing in different chunks. Worst of all, a query about Ljubljana could come back with rules from Maribor, because the chunks did not know which municipality they belonged to. In a legal application, eighty percent might as well be zero.

What fixed it was giving the model more context, not less: a lightweight router that matches a query against structured metadata rather than vector similarity, picks at most three documents, and injects them whole. Every table, every footnote, every cross reference intact. A five hundred page municipal plan converts to roughly four hundred to six hundred thousand tokens, which fits.

That sits awkwardly next to everything I have just said about loading less, so let me name the distinction rather than pretend it is not there. A curated payload you hand a model once, for one question, is not the same thing as a session that accumulates. The first can be enormous and stay coherent. The second degrades as it fills with tool output, half-finished attempts and your own messages. Volume is not the problem. Clutter is.

## Why does an agent drift, and where does it start? {#how-it-fails}

Drift starts as a context problem and arrives looking like a reasoning problem, and it is almost always silent. The agent does not crash and it does not tell you it has lost the thread. It keeps going, gets more confident, and by the time the output is obviously wrong you have three commits built on a misunderstanding.

Silence is the thing to internalise. Early on I watched a tool call fail and the agent carry on as though nothing had happened. Nothing in the transcript said anything was wrong.

Four sources of drift, in the order I hit them most often.

**The window fills.** Code accumulates, documentation accumulates, your own messages accumulate. A two hundred thousand token window sounds generous until you spend a focused afternoon in one, and then it is gone. My working rule is that I start planning the handover at around eighty percent, because past that the quality degrades before you notice it degrading. I watch the context indicator the way a pilot watches the fuel gauge.

**Position, not just volume.** The research I have seen reported on this says model performance drops by more than thirty percent when the important content sits in the middle of the window rather than at either end. I have not run that test myself, so take it as reported rather than verified here, but it matches what I feel in long sessions and it produces a simple rule: important context goes at the beginning or the end, never buried in the middle.

**Stale context, which is worse than no context.** This is the one that got me most recently. During the Lumina Gen 2 build I corrected a security statement in the code and did not carry the correction into the documentation. Lumina's own assistant reads that documentation. So for a while, my product was answering prospective customers from the version I had already fixed. Nobody flagged it. I found it while wiring up something else entirely.

**Vague input.** Specificity is context, and this is the cheapest fix on the list. Do not tell an agent that something is broken. Tell it that the submit button on the profile screen stops responding after the first file upload and the console shows a 403 from the storage endpoint. Vague bug reports produce vague fixes, reliably, every time.

A related trap sits next to that one. If you ask an agent to test something and you do not explicitly authorise it to use live credentials, many will quietly fall back to synthetic responses, and synthetic responses do not reveal real failures. Say out loud that the key is in the environment file and that you want real calls.

The pattern under all four is the same: the failure does not announce itself. Two of five enterprise access deploys on that same Lumina build finished with no success message at all, and I only caught it because I checked whether the services were actually live rather than trusting the deploy log. Further back, a worker agent once deployed one of my applications over an entirely different project because the default in my CLI configuration was wrong. Everything was recoverable from GitHub, which is the whole argument for the commit discipline, and the structural fix is to stop handing agents master credentials at all. Scoped, project-specific service account tokens with the minimum permissions the job needs. Agents do exactly what they are configured to do, including the mistakes, so the thing to control is not their intent but their blast radius.

Rich context in means coherent output out. Stale context means contradictions in the code. Missing context means the agent assumes, and its assumptions will not be yours.

## How do you carry context across sessions and across agents? {#continuity}

With files, not with the model. The model starts from nothing every time and no amount of window size fixes that. Four artefacts do the work: a documentation library kept in sync, a live spec file recording decisions and the reasons behind them, a handoff file written at the end of every session, and the operational rules of the project so a fresh agent knows the house rules before it touches anything.

None of it is clever. That is rather the point.

The standing file goes first. Claude Code loads CLAUDE.md, OpenCode loads AGENTS.md, Cursor has its own. Whatever the name, it is your agent's permanent brief: architecture decisions, conventions, the rules that should govern every action. Instruct the agent to update it after every meaningful milestone. An unmaintained standing file becomes stale context, and stale context is worse than none.

The handoff file does the heavy lifting. Written by the orchestrator at the end of a session, it says what happened, which agent did what, what is still open, and where the relevant documentation is. Crucially, it carries the role instruction forward too: you are the orchestrator, you do not write code yourself, you delegate, you audit. It is the same job you would do for a person joining the team on a Monday.

Underneath that there are three layers of memory, and knowing which one a piece of knowledge belongs in is most of the skill.

**Markdown files** hold active project context: the current sprint, the current codebase, the current session. Lightweight, readable, native to models. Every project gets this layer, no exceptions. The cost is discipline, because they go stale if you let them.

**Retrieval pipelines** are the older paradigm and they still have a place, but a narrow one. Reach for one when you have a genuinely large and heterogeneous corpus, thousands of documents, that cannot be handled any other way. Do not reach for one because it sounds sophisticated. It is meaningful infrastructure and it is not free.

**A compiled wiki** is the long-term layer: sources read once and written into an interlinked structure of entities, concepts and summaries, updated rather than duplicated when something new arrives. This is the layer that compounds across projects and across years rather than across a sprint. It is the subject of the next chapter.

The scale this has to survive is the argument for taking any of it seriously. Lumina Gen 2 took hundreds of sessions with hundreds of agents over roughly a month, and around eight hundred and sixty commits. The whole system exists so that agent number forty-seven starts with the same understanding of the project that agent number three finished with.

I want to be honest about how automated this is not. I still manually remind the agents, every single session, that all documentation must be in sync before we close. Manually. Every time. Some of this is a discipline problem that better tooling should solve and has not solved yet.

## Does any of this change if you cannot read the code? {#for-non-developers}

The practice is identical. The verification is different. You still write the brief, still keep the standing file current, still write the handoff at eighty percent. What changes is that you cannot check the work by reading the diff, so you check it by using the thing.

I do not write the code. I have not for two years. So this is the version of the practice I actually run.

For a small project, one page of markdown is plenty for the brief. What it is, who it is for, what it should look and feel like, and where it will eventually be deployed, so the agent knows the destination on day one. Bigger ideas need the four files from phase one, but do not start there.

The single most useful sentence I have found for working with an agent is this: sorry, I do not understand this, I am not a developer, please explain it simply. Use it constantly. No serious agent will think less of you, and every time you use it you are correcting a mismatch between what the agent assumed you knew and what you actually know. That is context engineering too.

Watch the window. If you are on a free model the window is smaller than the frontier ones, so keep the scope of a first build small and finish something rather than overreaching and stalling.

Then verification, which is where the difference actually bites.

What you can check without reading code: everything a user touches. Go through every button, every screen, every feature yourself, the way a real person would, including the error states and the empty form and the interrupted upload. When something breaks, do not tell the agent it is broken. Tell it what you clicked, what you expected, what you got, and hand it a screenshot.

What you cannot check: whether the implementation underneath is sound. For that you need something other than your own eyes, and there are two answers depending on scale. On a small build, get someone who did not build it to use it and tell you honestly what happened. They will find things you never will. On a production system, put a real test suite behind a CI pipeline and gate deployment on it going green, which is what Lumina runs now.

The honest limit is in between those two. I have experimented with letting agents test themselves, and it works, but it is slow and genuinely expensive in tokens, especially on anything visual. There are still classes of interface bug that a human eye catches instantly and an agent misses completely. So the loop I actually run is hybrid: automated coverage where it is cheap and repetitive, my own hands where it is not. Do not remove yourself from the testing loop yet.
