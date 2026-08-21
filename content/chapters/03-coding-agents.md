---
title: "Coding Agents and Harnesses"
number: 3
slug: "coding-agents"
status: "published"
question: "What is the difference between a model and the harness you run it in?"
summary: >
  The model writes the code. The harness decides what it sees, what it may
  touch, and when it stops. Most of the difference between a good session and
  a wasted one comes from the harness, not the model underneath it.
updated: 2026-08-20
sources:
  - title: "Blueprint of a Frontier Coding Agent"
    url: "https://talirezun.substack.com/p/blueprint-of-a-frontier-coding-agent"
    publication: "Substack"
    sections: ["what-a-harness-does", "the-twelve-parts", "model-or-harness", "permissions"]
  - title: "Exploring Early Indicators of AGI in Coding Agents: A Case Study on MCP-Powered Systems"
    url: "https://talirezun.com/download/exploring-early-indicators-of-agi-in-coding-agents/"
    publication: "Research paper"
    sections: ["model-or-harness"]
  - title: "Chasing Jarvis: Can Technically Sophisticated Non-Programmers Deploy SaaS Applications Using AI Coding Agents?"
    url: "https://talirezun.com/download/chasing-jarvis-can-technically-sophisticated-non-programmers-deploy-saas-applications-using-ai-coding-agents/"
    publication: "Research paper"
    sections: ["model-or-harness", "comparing-them"]
  - title: "From One Agent to Coding Agent Armies: My 15-Month Journey to AI Orchestration"
    url: "https://medium.com/@talirezun/from-one-agent-to-coding-agent-armies-my-15-month-journey-to-ai-orchestration-b9138675a075"
    publication: "Medium"
    sections: ["comparing-them"]
  - title: "The Claude Desktop Coding Agent Experiment: Early Results & Context Management Lessons"
    url: "https://medium.com/@talirezun/from-english-to-code-building-production-saas-with-claude-desktop-3ee9c787f5be"
    publication: "Medium"
    sections: ["comparing-them"]
  - title: "Three Philosophies, One Goal: A Practitioner's Comparison of Augment Code, Claude Code, and Codex CLI"
    url: "https://talirezun.substack.com/p/three-philosophies-one-goal-a-practitioners"
    publication: "Substack"
    sections: ["comparing-them", "permissions"]
  - title: "From Writing Code to Directing Intelligence: Five Days Inside Augment Code's Intent"
    url: "https://talirezun.substack.com/p/from-writing-code-to-directing-intelligence"
    publication: "Substack"
    sections: ["comparing-them", "permissions"]
  - title: "The Mixed Fleet"
    url: "https://talirezun.substack.com/p/the-mixed-fleet"
    publication: "Substack"
    date: 2026-08-17
    sections: ["comparing-them", "staying-current"]
  - title: "Anthropic Shipped Two Models This Week. I Only Wanted One Back."
    url: "https://talirezun.substack.com/p/anthropic-shipped-two-models-this"
    publication: "Substack"
    date: 2026-07-01
    sections: ["staying-current"]
  - title: "From 0 to Dev in One Day: What a Real Coding Harness Actually Looks Like"
    url: "https://talirezun.substack.com/p/from-0-to-dev-in-one-day-what-a-real"
    publication: "Substack"
    date: 2026-07-20
    sections: ["staying-current"]
related: ["context-engineering", "orchestration"]
tags: ["coding-agents", "developer-tools", "harness", "claude-code"]
---

## What does a coding harness actually do? {#what-a-harness-does}

Everything the model does not. The model is the brain: it reads and it writes text. The harness is the loop that keeps it running, the tools that let it touch your files and execute commands, the memory that stops it starting from zero every session, and the permission system that decides what it is allowed to do at all. Take a frontier model and strip the harness away and you have a very good text predictor that cannot open a file.

The term was only formalised in early 2026, which is late given how long the thing itself has existed.

The clearest framing I have come across is not mine. Beren Millidge wrote in 2023 that a raw language model is a CPU with no RAM, no disk and no input or output. The context window is the RAM. External storage is the disk. Tool integrations are the device drivers. The harness is the operating system. His line was that we had reinvented the Von Neumann architecture, and once you see it that way the whole field reorganises itself in your head. Vivek Trivedy at LangChain put the same idea more bluntly: if you are not the model, you are the harness.

I can read modern harnesses architecturally because I built a bad one first.

In late 2024 I assembled Claude Desktop, the Model Context Protocol, and a hand-picked set of servers: GitHub for version control, Playwright for browser automation, Sequential Thinking for multi-step work, Context7 for documentation retrieval. On top of that sat markdown I maintained by hand, architecture documents and blueprints and handoff notes. I did not know I was building a harness. There was no word for it. But every component that a frontier agent ships today, I was assembling manually, badly, and learning exactly why each one exists by living without it.

## What is a harness made of? {#the-twelve-parts}

Twelve components, which group into five roles. The **brain** is the orchestration loop and prompt construction. The **hands** are the tools. The **memory** is short-term memory, context management and state. The **safety layer** is output parsing, error handling and guardrails. The **team** is verification loops and sub-agent orchestration. Telemetry sits across all of it. You do not need to build any of these any more, but you need to know they exist, because when a session goes wrong it is almost always one of them.

Worth understanding about the loop itself: it is stupid on purpose. Anthropic describes their own runtime as a dumb loop. Assemble the prompt, send it, parse the response, run any tool calls, feed the results back, repeat. All the intelligence lives in the model. This is a deliberate architectural bet, and it is the reason the harness can stay thin while models get better.

Three of the twelve carry most of the weight in practice, and I would rank them in this order.

**Context management** is where most agents fail silently. It is also the component I have written about more than anything else, which is not a coincidence. The four strategies that matter are compaction, hiding old tool output while keeping the calls visible, just-in-time retrieval instead of preloading, and delegating exploration to sub-agents that come back with a summary of a thousand or two thousand tokens rather than everything they read.

**Verification loops** are what separate a production agent from a demo. Three shapes: rules-based checks the agent can run itself, like tests and linters and type checkers; visual checks, usually screenshots through a browser tool; and a separate model acting as judge. Give a model a way to check its own work and the quality of that work goes up sharply. That effect is reported by the people who build these tools rather than measured by me, but it matches everything I see.

**Error handling** is a design decision, not a feature you get for free. Four kinds of failure and each needs a different response: transient failures you retry, failures the model can fix itself if you show it the error message, failures that need a human, and failures where the right move is to stop. The arithmetic is unforgiving. A ten-step process that succeeds ninety-nine percent of the time at each step finishes correctly about ninety percent of the time.

The most underinvested component is telemetry, and the reason is the theme of this whole site. Agent failures are quiet. The agent did not crash. It took a wrong turn three steps ago and then built confidently in that direction for twenty minutes. Without a record of every tool call and every decision point, you find that out at the end.

## Does the model or the harness decide the outcome? {#model-or-harness}

The harness, far more often than the marketing around model releases would suggest. The strongest evidence I have for this is my own, and it is embarrassing in the right direction: a small cheap model with good tooling beat the same class of setup without tooling, decisively, on the same task.

In 2025 I ran Cline with Grok 3 Mini, a small and inexpensive model, and connected five MCP servers to it: documentation retrieval, sequential reasoning, a knowledge graph for memory, GitHub, and a database. That configuration took a retrieval-based SaaS application to about ninety percent complete in nine days, for roughly thirty dollars in API costs. The comparable setup without MCP servers failed within forty-eight hours. Same class of model. The difference was entirely the layer around it.

The finding held when I looked at it more systematically. Across two years of testing eight platforms for a case study, the pattern in my own development logs was that lower-capability models produced production-quality code when the context was comprehensive, while frontier models produced poor results when the context was inadequate. Failures attributable to insufficient context far exceeded failures attributable to the model not being clever enough. That is the single most useful thing I learned in two years, and it is also the least intuitive.

Two more data points, both second-hand and worth treating as reported rather than verified. LangChain moved from outside the top thirty to fifth place on a coding benchmark by changing only the infrastructure around their model, same weights, same training, more than twenty positions. And Manus, one of the more impressive agentic systems of the last two years, was rebuilt five times in six months, with every rewrite removing complexity rather than adding it. Complex tool definitions became general shell execution. Management agents became simple structured handoffs.

The practical consequence is that model choice becomes a staffing decision rather than a loyalty decision. Complex reasoning and orchestration go to the strongest model you can afford. Mechanical work goes to something cheaper. Audit goes to a model from a different vendor entirely, for reasons I will come back to. You are not picking a model. You are staffing a team.

## How do the harnesses I have used actually compare? {#comparing-them}

They compare badly, in the sense that any ranking I write here has a shelf life of about a quarter. So take everything below as dated observations rather than a recommendation, and note the dates, because at least one of these verdicts has already reversed itself.

**Cline, late 2024.** A VS Code extension where I learned context engineering the hard way. Roughly thirty minutes of useful working window before I needed to write a handoff, and no memory whatsoever between sessions unless I created it myself. Everything manual. It taught me more than any tool since, precisely because nothing was done for me.

**Claude Code, January 2025 beta.** Immediately and obviously better at reasoning across multiple files than anything I had used. Also, a single day of intensive development cost me over three hundred euros. I stopped using it, and the reason was not capability. Raw capability and practical viability are different things, and the second one is what determines whether you ship.

**Claude Desktop with a custom MCP stack, through 2025.** Not a coding agent product, a harness I assembled. Genuinely reliable for projects under about twenty files, and cheap. It took a legal document assistant to roughly seventy percent complete across more than fifty conversations. Where it fell down was complex debugging: database connection problems, integration failures, anything requiring broad visibility across an unfamiliar codebase. The loop became start a conversation, spend tokens loading context, explain the bug, spend more tokens on analysis, begin a fix, hit the conversation limit, start again. I migrated to VS Code and Augment Code.

That verdict is now wrong. Claude Code runs inside the Claude Desktop app, which means you can work this way without touching a terminal, and it is currently what I use most. I prefer it to the command line. Same product name, completely different answer, eighteen months apart. This is the clearest illustration I have of why you should distrust any tool comparison with a date on it, including this one.

**Augment Code, from summer 2025.** The thing that mattered was the Context Engine: it indexes the codebase into a graph of symbols, dependencies and call trees ahead of time, so a new session starts with structural understanding rather than starting cold. Handoffs stopped being painful. It stayed single-agent and sequential, which is what eventually pushed me on.

**Google Antigravity, late 2025.** My first genuine parallel multi-agent work, with a manager view for spawning and monitoring agents. Two things broke. Agents made incompatible assumptions about each other's work, so I would come back to a backend expecting data structures the frontend was not producing, and need a cleanup agent to reconcile them. And my own hardware became the ceiling at around five simultaneous agents.

**Augment Intent, early 2026.** A coordinator agent reads the codebase, drafts a living specification, decomposes it into tasks, and dispatches implementor agents that each work in an isolated git branch, with a verifier checking output against the spec before it surfaces. The spec, not the code, is the source of truth. I ran twenty-one agents on one build and a hundred and seventy-seven tasks on another. It is not a prototyping tool, it is expensive for exploration, and long coordinator threads made the interface lag.

**Codex, spring 2026.** A different philosophy: delegate and come back. A task runs in a sandboxed cloud environment for up to half an hour and returns a pull request with terminal logs and test citations. Apache-licensed and open source, which matters if you need auditability. Strongest at code review, where it reliably catches logic errors and race conditions. Weaker on frontend work. Its instruction file format is portable across tools, which is a quietly significant advantage.

**OpenCode, 2026.** Open source, ships with free models, and it is what I now recommend to anyone starting, partly because you can see how it works rather than being shielded from it. It is also the only harness I have found that genuinely routes different agents to different providers inside a single session.

One honesty note about that last point. The compatibility work behind it, which harness can mix local and cloud models and which cannot, I did against official documentation rather than by running every combination myself. I would rather tell you that than publish a wish list dressed as a field test.

## How much should you let an agent do on its own? {#permissions}

Quite a lot, if you separate two questions that people tend to merge. The model decides what to attempt. The tool system decides what is permitted. Keep those apart and you can give an agent real autonomy without giving it real reach, which is the only combination that works at production scale.

In practice that means scoped credentials, always. Project-specific service account tokens with the minimum permissions the job needs, never master admin access. Agents do exactly what they are configured to do, including the mistakes, so what you are controlling is not their intent but their blast radius. I learned this the way everyone learns it, by having a worker agent deploy an application over an entirely different project because a default in my CLI configuration was wrong.

The gates I actually keep:

- **A plan before execution.** Get the plan right and an agent can often execute it in a single pass. Argue with the plan while arguing is cheap.
- **Isolation per agent.** Separate branches or worktrees, so parallel work cannot collide in the working directory.
- **A verifier that is not the author.** Something checks the output against the specification before it reaches me.
- **Tests green before deploy.** On anything with real users, a full suite in CI gating the deployment, no exceptions.
- **My eyes on the final release.**

What I do not automate is the approval to go to production, and the final quality gate before release. Those stay human and I do not expect that to change soon.

One thing I want to be precise about, because it gets misreported as a safety position. I do not automate browser-based testing of authenticated flows, and the reason is economic rather than principled. It works. I have Playwright running through MCP and it does what it says. But token consumption on visual testing is high, login walls are awkward for agents to navigate repeatedly, and manual testing plus a specific written report to the agent is currently faster and cheaper. That is a judgement about price, and prices move.

The remaining gap has a name in my head: the open loop. An agent that can deploy, test the deployment on real infrastructure, observe what actually happened, and report back without a human in the middle. Nobody has closed it yet, mine included. Worker agents are eager. Until the loop closes, they need boundaries.

## How do you avoid betting on a tool that changes under you? {#staying-current}

By betting on the shape rather than the tool. The twelve components do not change. Roles, context and handoffs do not change. What changes, roughly quarterly, is which product implements them best, and if your working method is built around a specific product you will rebuild your method every time the market moves.

Look at what happened to my own verdicts. Claude Desktop went from "graduate away from it" to "my daily driver" in about a year. Every model version number in everything I have published is now stale, some of it within weeks of publication. A tool comparison is a photograph, not a map.

Two habits keep this from being a problem.

**Distrust benchmark numbers, including favourable ones.** Nearly every figure circulating about these tools is vendor-published. In at least one case I looked into, the comparison was not symmetric: the vendor's model got one fixed prompt while the models it was compared against got the better of two attempts. Treat headline scores as a direction of travel rather than a verdict, and re-verify anything you would make a purchasing decision on.

**Get good at one thing before you get clever.** Pick one harness. Build one real project end to end with it. Break it, fix it, ship it. That is the whole curriculum, and it transfers completely when you switch. Orchestration, multiple agents, mixed local and cloud fleets, all of that is worth doing and none of it is worth doing first. Orchestration multiplies whatever you already have, and if what you have is chaos, you now have parallel chaos.

The version-number discipline follows from the same logic. I stopped putting model version strings in anything durable, because the naming moves faster than the writing and a wrong version number costs more credibility than a vague one. Name the tier and the vendor. Let the reader look up what is current.
