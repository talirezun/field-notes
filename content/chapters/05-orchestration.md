---
title: "Orchestration and Multi-Agent Work"
number: 5
slug: "orchestration"
status: "published"
question: "When is more than one agent worth the trouble?"
summary: >
  Rarely, and then decisively. Most tasks are faster with one agent and a clear
  brief. Fan-out earns its keep when the work is genuinely independent, or when
  you need several honest opinions before you commit.
updated: 2026-08-20
sources:
  - title: "From Writing Code to Directing Intelligence: Five Days Inside Augment Code's Intent"
    url: "https://talirezun.substack.com/p/from-writing-code-to-directing-intelligence"
    publication: "Substack"
    sections: ["when-to-fan-out", "the-orchestrator", "what-breaks"]
  - title: "From One Agent to Coding Agent Armies: My 15-Month Journey to AI Orchestration"
    url: "https://medium.com/@talirezun/from-one-agent-to-coding-agent-armies-my-15-month-journey-to-ai-orchestration-b9138675a075"
    publication: "Medium"
    sections: ["what-breaks", "when-not-to"]
  - title: "I Built Auto Loops Before They Had a Name"
    url: "https://talirezun.substack.com/p/i-built-auto-loops-before-they-had"
    publication: "Substack"
    date: 2026-06-22
    sections: ["loops", "verification"]
  - title: "I Built a 24/7 AI Email Support Agent"
    url: "https://talirezun.substack.com/p/i-built-a-247-ai-email-support-agent"
    publication: "Substack"
    sections: ["loops"]
  - title: "Blueprint of a Frontier Coding Agent"
    url: "https://talirezun.substack.com/p/blueprint-of-a-frontier-coding-agent"
    publication: "Substack"
    sections: ["the-orchestrator", "verification"]
  - title: "The Mixed Fleet"
    url: "https://talirezun.substack.com/p/the-mixed-fleet"
    publication: "Substack"
    date: 2026-08-17
    sections: ["the-orchestrator", "verification", "when-not-to"]
  - title: "Lumina: An AI Agent Your Business Can Stand Behind"
    url: "https://talirezun.substack.com/p/lumina-an-ai-agent-your-business"
    publication: "Substack"
    date: 2026-07-31
    sections: ["when-to-fan-out"]
  - title: "A Year in the Review"
    url: "https://talirezun.substack.com/p/a-year-in-the-review"
    publication: "Substack"
    date: 2026-06-23
    sections: ["what-breaks"]
  - title: "How I Built an AI Marketing Team That Actually Works"
    url: "https://medium.com/@talirezun/how-i-built-an-ai-marketing-team-that-actually-works-from-memes-to-technical-content-in-minutes-87f646608c60"
    publication: "Medium"
    sections: ["when-not-to"]
related: ["coding-agents", "context-engineering"]
tags: ["multi-agent", "orchestration", "workflow", "ai-agents"]
---

## When does running several agents beat running one? {#when-to-fan-out}

When the execution is genuinely separable from the judgement, and the judgement lives somewhere else. That is the whole rule. If you can hand out work that does not need to know what the other work is doing, and something other than the workers decides whether the result is good, fan-out pays. If you cannot, you are buying coordination overhead and calling it parallelism.

Look closely at the multi-agent setups that actually work and almost none of them are really arguments about doing more things at once. They are arguments about where the checking happens. An expensive model plans and judges while a cheap swarm executes. A verify engine sits outside the swarm and catches what the swarm produces. The parallelism is incidental. The separation of powers is the point.

The scale this reaches is real when it fits. I have run twenty-one agents coordinating on a single build, and a hundred and seventy-seven tasks inside one workspace. The second generation of Lumina took hundreds of sessions with hundreds of agents over roughly a month, producing around eight hundred and sixty commits. None of that was possible with one agent and a long afternoon.

And the counterweight, which is reported by another team rather than measured by me, is worth holding next to those numbers. Cursor's engineering team found that twenty agents of equal status produced roughly the throughput of two or three, because they spent their time holding and waiting on file locks. Their fix was not fewer agents. It was three distinct roles: planners, workers and judges. Same conclusion from the other direction. Structure, not headcount.

## What does the orchestrator actually do? {#the-orchestrator}

It holds the specification, decomposes the work, dispatches it, reviews what comes back, and does not write code itself. That last clause is not a stylistic preference. An orchestrator that starts implementing loses the overview that made it useful, and you end up with an expensive model doing a cheap model's job badly.

The most useful reframe I know for this: orchestration is a management skill, not a technical one. You are hiring, briefing, delegating, reviewing and, when it comes to it, firing. If you have ever run a team you already know most of it, and the parts that are unfamiliar are mechanical rather than conceptual.

The pieces that make it work in practice:

**A living specification, not the code, as the source of truth.** The orchestrator drafts it, updates it as work completes, and every downstream agent reads the current version rather than whatever it was told at dispatch time.

**Isolation per worker.** Separate branches or worktrees, so two agents editing adjacent things cannot collide in the working directory. Without this, parallelism turns into merge conflicts almost immediately.

**A verifier that is not the author.** Something checks the output against the specification before it reaches you.

**The role instruction carried forward.** When a session ends, the handoff says what happened and also restates the job: you are the orchestrator, you do not write code yourself, you delegate, you audit. Otherwise the next session quietly reverts to being a single agent with ambitions.

Model choice becomes staffing. Complex reasoning and decomposition go to the strongest model you have. Mechanical work goes to something cheaper. The audit goes to a model from a different vendor entirely. You are not picking a favourite. You are filling roles.

## Do autonomous loops work, or do they just spend money? {#loops}

They work, and they will absolutely spend money if you let them. An auto loop is an agent driving a running application through real user scenarios without a human in the seat: act, observe, diagnose, fix, verify, repeat. It belongs in the debugging and deployment phase, not the coding phase, and the thing that decides whether it earns its keep is not the loop. It is the verifier.

I was running these for over a year before anyone called it loop engineering, so what follows is mostly scar tissue.

**Prepare the context before you start it, not during.** Application architecture, a full feature inventory, the concrete scenarios you want walked, and explicit success criteria. A loop cannot ask you clarifying questions at three in the morning.

**Give it eyes and hands.** Browser automation through MCP, so it can navigate the interface, click things and see what happened.

**Run separate loops per role.** I mixed ordinary user scenarios and administrator scenarios in one loop and produced nothing but debugging confusion. Splitting them fixed it.

**Solve authentication in phase one, not when the loop hits a login wall.** This is the failure that cost me the most time. Sign-in flows break browser automation reliably. Authentication state gets lost between sessions, and bot detection starts throwing verification prompts at your agent. It is an architecture problem wearing a testing problem's clothes.

**Budget tokens and set an iteration cap before you walk away.** Every action and every screenshot analysis accumulates, and browser work burns context faster than almost anything else. My loops used to hit the ceiling mid-task and stop, without ever completing gracefully.

Then the part that matters more than all of it. The hard part is not the loop. It is the verifier. Without an independent check against objective criteria, the agent declares success and moves on. The sharpest version of this I have read is that a loop which cannot distinguish good output from bad does not save you work, it produces wrong answers faster. That is the correct way round to think about it: the danger is not that the loop stalls, it is that it accelerates.

I should own the obvious criticism here. My own early loops had no independent verifier in them. I was the verifier, by reading the output myself afterwards, which is exactly the personal review that objective criteria are supposed to replace. That was a shortcoming, not a design choice.

One more piece of vocabulary that clarified my thinking, and it is not mine. A **loop** repeats while your session is open. A **goal** runs until a verifiable condition is true and then stops. A **schedule** runs in the cloud with your laptop closed. Only the goal has a termination condition, and a termination condition is a verification claim in disguise. If you cannot write the stopping condition, you do not yet know what you are checking for.

The scheduled form is worth its own mention because it is the cheapest useful version of any of this. My support inbox runs as a headless agent on a cron job, hourly, on an always-on machine. It fetches unread mail, classifies by intent, and either answers or forwards to me with one sentence explaining why it did not feel able to answer. Roughly a fifth gets forwarded, and forwarding is the correct outcome rather than a failure, because a mediocre answer to a complicated question is worse than no answer at all. That took an afternoon to build and costs a few cents a run.

Its weakness is instructive too. It logs how many messages it processed, replied to and forwarded. It logs nothing about whether the replies were any good. I spot-checked the sent replies for the first few weeks and then stopped, which means the quality loop on that system is currently me remembering to look.

## How do you check work you did not watch happen? {#verification}

With a model that did not do the work. This is the highest-value habit in this entire chapter and it takes one extra step: write with one model, hand the output to a model from a different vendor, and ask it to audit.

The reason it works is not that the second model is smarter. An agent auditing its own code reads what it meant to write. A different model reads what is actually on the page. It is exactly like bringing in an external auditor, and the value is the same: they find things the internal team never will, because they are not invested in the story of how the thing got built.

Everything else about verification, the tests, the streaks, the staged deploys, the audits that found things I did not want to find, is the subject of chapter eight. It earned its own chapter.

## What goes wrong when you scale up? {#what-breaks}

Agents make incompatible assumptions about each other's work, and nobody tells you. My first parallel runs ended with a backend expecting data structures the frontend was not producing, discovered at integration time, and requiring a cleanup agent whose only job was reconciling two correct implementations of different ideas.

The failure list from running this at scale, roughly in order of how often it bites:

**Context does not propagate sideways.** Architectural decisions made by one coordinator did not automatically reach another. Agents spun up by a second coordinator lacked context the first one held, and had to be briefed manually. Every coordinator boundary is a place where context has to be carried deliberately.

**Commits collide.** Commit messages from different coordinators clashed and overlapped, which is cosmetic until you are trying to read the history to work out what happened.

**Wrong-target deploys.** One set of worker agents briefly attempted to deploy to an entirely different production project. My guardrails caught that one. An earlier version of the same mistake, before I had guardrails, overwrote an application, and everything was recoverable only because of the commit discipline.

**Your own hardware becomes the ceiling.** Running agents locally, I hit GPU and CPU strain at around five simultaneous agents. That number is specific to my machine and to that year, but the shape of the problem is not.

**The interface degrades before the work does.** Long coordinator threads made the tool itself lag noticeably, which is a small thing that makes a long session unpleasant.

**Cost is non-linear and arrives late.** A heavy fan-out day consumed roughly a quarter of a month's allocation on a two-hundred-dollar plan, so ten-hour days exhausted a month in two. On the avatar platform, peak burn ran close to three hundred dollars a day in credits. None of that was visible when I designed the workflow. It was visible at the end of the week.

None of these were catastrophic and everything was recoverable. But recoverable is doing real work in that sentence, and what makes it true is version control, isolation, and a human paying attention.

## When should you not orchestrate at all? {#when-not-to}

If you are new to this, do not orchestrate. Not yet, genuinely. Pick one harness, build one real thing end to end, break it, fix it, ship it. That is the whole curriculum and it transfers completely. Come back to this chapter in three months.

The reason is not that orchestration is difficult. It is that orchestration multiplies whatever you already have, and if what you already have is chaos, what you now have is parallel chaos. I watch people hurt themselves with this. They read about a hundred and seventy-seven agents and reach for the largest available structure before they have a specification worth decomposing.

Three habits that keep it from going wrong, once you do start:

**Start with one coordinator.** Resist adding a second until the first one is genuinely saturated.

**Keep the unit of work small.** Roughly the size of a pull request. Large units make failures expensive to unwind.

**Treat notes as infrastructure.** Architectural decisions and constraints belong in the specification, not in the chat thread where only the current session can see them.

And a piece of honesty about my own writing on this, because it is the most common way these systems get oversold. I once published a piece about building an AI marketing team. What I had actually built was one agent with two different tool configurations, plus two separate generation tools. It produced genuinely good work and I stand by the workflow. But the plurality was in the tooling, not in concurrent agents, and calling it a team was a description of how it felt rather than what it was.

That distinction matters, because a great deal of what is described as multi-agent is one agent with several sets of tools. That is often the right architecture. It is just not the same claim.

The last thing to be clear about: none of this is autonomous. You need to be present. It reduces the implementation burden enormously and it does not reduce the architectural judgement burden at all. That part is still yours.
