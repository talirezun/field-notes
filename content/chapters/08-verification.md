---
title: "Verification"
number: 8
slug: "verification"
status: "published"
question: "How do you know an agent's work was right if you did not watch it happen?"
summary: >
  Agent failures are quiet. The work completes, reports success, and leaves
  something broken underneath. Verification is the discipline of making that
  gap loud, and it is where most of my own worst findings came from.
updated: 2026-08-20
sources:
  - title: "I Built Auto Loops Before They Had a Name"
    url: "https://talirezun.substack.com/p/i-built-auto-loops-before-they-had"
    publication: "Substack"
    date: 2026-06-22
    sections: ["why-it-matters", "automated-testing"]
  - title: "Behind the Curtain: The Three-Phase Process I Use to Build Every AI-Coded Product"
    url: "https://talirezun.substack.com/p/behind-the-curtain-the-three-phase"
    publication: "Substack"
    date: 2026-03-16
    sections: ["the-audit"]
  - title: "Context is the Code: The Complete Three-Phase Process for Building with AI Agents"
    url: "https://talirezun.substack.com/p/context-is-the-code-the-complete"
    publication: "Substack"
    date: 2026-06-03
    sections: ["the-audit", "automated-testing"]
  - title: "The Mixed Fleet"
    url: "https://talirezun.substack.com/p/the-mixed-fleet"
    publication: "Substack"
    date: 2026-08-17
    sections: ["the-audit", "tests-not-comments"]
  - title: "I Could Tell You My AI Has Never Lied. I'm Not Going To."
    url: "https://talirezun.substack.com/p/i-could-tell-you-my-ai-has-never"
    publication: "Substack"
    date: 2026-08-06
    sections: ["tests-not-comments", "what-audits-find", "what-you-cannot-check"]
  - title: "Second Brain to Shared Brain: Building a Neural Network of Your Own Knowledge"
    url: "https://talirezun.substack.com/p/second-brain-to-shared-brain-building"
    publication: "Substack"
    date: 2026-07-03
    sections: ["why-it-matters", "tests-not-comments"]
  - title: "Six Months After I Shipped Lumina"
    url: "https://talirezun.substack.com/p/six-months-after-i-shipped-lumina"
    publication: "Substack"
    date: 2026-07-10
    sections: ["tests-not-comments"]
  - title: "Chasing Jarvis: Can Technically Sophisticated Non-Programmers Deploy SaaS Applications Using AI Coding Agents?"
    url: "https://talirezun.com/download/chasing-jarvis-can-technically-sophisticated-non-programmers-deploy-saas-applications-using-ai-coding-agents/"
    publication: "Research paper"
    sections: ["what-audits-find", "what-you-cannot-check"]
  - title: "From 0 to Dev in One Day: What a Real Coding Harness Actually Looks Like"
    url: "https://talirezun.substack.com/p/from-0-to-dev-in-one-day-what-a-real"
    publication: "Substack"
    date: 2026-07-20
    sections: ["automated-testing"]
  - title: "Blueprint of a Frontier Coding Agent"
    url: "https://talirezun.substack.com/p/blueprint-of-a-frontier-coding-agent"
    publication: "Substack"
    sections: ["why-it-matters"]
related: ["orchestration", "building-without-being-a-developer"]
tags: ["verification", "testing", "audit", "quality"]
---

## Why is verification the hard part? {#why-it-matters}

Because agent failures do not announce themselves. Software you wrote yourself tends to fail loudly: it throws, it crashes, it returns an error. Work produced by an agent tends to fail quietly. It finishes, it reports success, and something underneath is wrong in a way nothing surfaces. The question you have to answer is therefore not whether the task completed. It is whether what it produced is actually true.

Three of my own, from three different systems, all with the same shape.

A tool call failed and the agent carried on as though nothing had happened. Nothing in the transcript said otherwise.

Two of five deployments finished with no success message at all. I found out because I checked whether the services were live rather than trusting the deploy log.

And the one that still bothers me: removing a contributor from a shared knowledge base triggered a rebuild that read stale state, produced a completely empty wiki, and reported success. A green checkmark, no error anywhere, and a semester of collective work gone. The offline test suite was entirely green at the time.

The arithmetic makes this worse than it looks. A ten-step process that succeeds ninety-nine percent of the time at each individual step finishes correctly only about ninety percent of the time end to end. Agent work is many steps, most of them unwatched, and the failures compound silently until something visible finally breaks.

The counterweight is the most encouraging finding in the field: give a model a way to check its own work and the quality of that work improves substantially. That is reported by the people who build these harnesses rather than measured by me, but everything I have seen is consistent with it, and it means the verification layer is not overhead. It is a capability multiplier.

## Who checks the agent's work? {#the-audit}

Not the agent that did it. That is the entire principle and everything else in this chapter is an implementation detail. An agent reviewing its own output reads what it meant to write. A model from a different vendor reads what is actually on the page.

The analogy that makes it click is the external auditor. An outside auditor finds things the internal team never will, and it is not because they are smarter. It is because they are not invested in the story of how the thing got built. They have no memory of the constraint that made a compromise reasonable in March, so they see the compromise rather than the reason for it.

In practice I write a defined segment with one model and hand that segment to a model from a different vendor with instructions to audit it. Different training, different emphases, different blind spots. The findings are never identical, which is the whole point of running more than one.

For a security pass before anything goes live, I run three models from three different vendors over the same codebase, each asked to look specifically at authentication, data validation, exposed credentials, injection paths, unprotected endpoints and performance bottlenecks. I compile what comes back, sort by severity, and have my coding agent fix everything material before deployment. It has surfaced real issues every single time I have run it. Not once has it been wasted effort.

I should be honest about one thing, because a reader comparing my published work will notice it. The way I have described this audit stack has changed. In some pieces it is three frontier models running in parallel. In others it is one model writing and a different one auditing. In others again it is review and verifier agents living inside an orchestration workflow. Those are three implementations of the same rule rather than one stable practice I have run for two years, and I would rather say that than pretend at a consistency I did not have.

The rule that has been stable is short. The reviewer must not be the author.

## What do you write down, and where? {#tests-not-comments}

In a test, not a comment. A comment cannot fail. A test can. Any property you assert in a document, assert again as an automated check, so that the day it stops being true something breaks loudly instead of quietly remaining written.

This matters more the less code you read yourself. When written intent is most of what you have, the gap between what a document claims and what the system does is invisible to you by definition, and it will not close on its own.

What that looks like in numbers, on my own systems.

One product went from a couple of hundred automated tests gating production to a suite carrying several thousand assertions, with almost a thousand new tests added in under a week during one hardening push. Those are different units and I am not going to pretend they are the same metric, but the direction is the point: the ratio of asserted-in-prose to asserted-in-code moved a long way.

On the open-source side, one release ran on five hundred and forty-seven battle-test assertions. Five hundred and nineteen of those ran offline. The remainder ran against live storage, live network conditions and live credentials. The offline suite was completely green when the live suite found two serious bugs, one of which could have silently destroyed a shared knowledge base. Offline coverage is a floor. It is not a finish line, and I would not have believed how far apart those two things are if I had not watched it happen.

Three habits underneath the tests:

**Require a streak, not a pass.** One green run is not evidence. A loop library I looked at requires ten consecutive clean runs before it will call something working, and that scepticism is correct. Systems that fail intermittently pass intermittently.

**Deploy in stages and verify live between them.** On one release I shipped fourteen backend functions as five separate production deployments, checking the live service between each. Slower, and a failure has one obvious cause instead of fourteen candidates.

**Gate deployment on the pipeline, not on judgement.** Everything pushed runs the full suite. When everything is green, the deployment agent can go to production. When it is not, nothing goes anywhere, including when I am impatient.

## Does automated testing pay for itself? {#automated-testing}

It depends on the scale, and the honest answer splits three ways rather than one. On a first small build it usually does not. On a production system with real users it always does. In between, use automation for the repetitive coverage and keep your own hands on the parts where a human eye is still faster.

I have experimented properly with letting agents test their own work through browser automation, and I want to be precise about why I do not lean on it more, because it gets misread as a safety position and it is not.

It works. The mechanics are fine. The problem is cost and friction. Browser-driven testing burns tokens at a surprisingly high rate, because every interaction and every screenshot analysis accumulates in the context. It is slow. Sign-in flows break it reliably, authentication state gets lost between sessions, and bot detection starts throwing verification prompts at your agent. And there remain whole classes of interface bug that a person catches in a second and an agent misses entirely.

So on a small project, your own eyes are still the fastest debugging tool you own. Go through every button, every screen, every error state as a real user would. When something breaks, do not report that it is broken. Report what you clicked, what you expected, what you got, and attach a screenshot. Specific reports get specific fixes.

Two traps worth knowing before you try it.

**Agents default to synthetic responses.** If you do not explicitly authorise real credentials and real API calls, many will quietly simulate the responses instead, and simulated responses do not reveal real failures. Say out loud that the key is in the environment file and that you want live calls.

**Solve authentication in the architecture phase.** The moment a loop hits a login wall is far too late to start thinking about how an automated agent will get past it.

None of this is a permanent verdict. It is a judgement about the current price of tokens and the current state of browser tooling, and both of those move. When the economics change I will change my answer.

## What does an audit actually turn up? {#what-audits-find}

Not bad code. That is the finding that reorganised how I think about this. When I ran a six-agent audit across my own product, covering security, data handling and stated commitments, every single finding had the same shape: something asserted in a document had been mistaken for something enforced in the code.

The pattern, over and over:

A restriction that was written down as policy, implemented as a runtime check against a configuration list, and shipped with that list empty. Nobody, including me, had a way to fill it in. So it checked an empty list, passed, and had been passing that way for its entire life.

A retention rule stated clearly in writing with no mechanism anywhere that would ever act on it. The first record due to be affected was still months away, so nothing had surfaced.

A contract document still describing a piece of tooling as nonexistent, three days after that tooling shipped.

And my favourite, in the sense that it is the one I tell against myself. I corrected a statement in the code and did not carry the correction into the documentation. That documentation is what my product's own assistant reads. So for a while, my product was answering prospective customers with the version I had already fixed.

Across that audit I logged twenty-one gaps between what was claimed and what was evidenced, and almost none of them were in the code. The code mostly did what it was supposed to do. The gap was between the writing and the code, in both directions, and that is precisely the gap you cannot see if the writing is your main instrument.

An earlier and simpler version of the same lesson: on a thirty-day build, the pre-launch security pass surfaced eighteen issues that had to be fixed. Eighteen vulnerabilities in code I had already looked at and decided was finished.

For context on how normal that is rather than how careless I am, the published research on generated code is not comforting. One large study across more than a hundred models and eighty tasks found only around fifty-five percent of the generated code was secure. If you ship agent-written code without an audit, you are shipping something in roughly that condition.

## What can you still not verify? {#what-you-cannot-check}

Whether the thing is telling the truth. That is the honest end of this chapter. I run a product that answers questions from a customer's own documents, and I am not going to tell you it has never hallucinated, because I cannot know that.

What I have is an absence of complaints. No client has reported one. That is a floor, not a number, and the two sentences "no client reported a hallucination" and "the system does not hallucinate" are not the same sentence.

The reason it is unknowable in production is the structure of the error. The failures that get reported are the ones that look wrong. The failures that matter are the ones that look right: fluent, plausible, confidently sourced, and false. Human detection of that category is far from reliable, and the automated detectors that score well on benchmarks lose a substantial part of that accuracy under real conditions. So the number I would need to make the claim does not exist, and building a system that produces it is a research project rather than a feature.

The second thing I cannot verify is code correctness by reading, because I do not read code. My own research says exactly that about people in my position, and the mitigation it recommends is engaging actual security professionals for a pre-deployment audit, while conceding that even that does not eliminate the underlying risk.

There is a circularity in the middle of my own method that I have not solved either. Using AI agents to audit AI-generated code assumes you know enough to direct the audit. If you do not, you have added a step without adding assurance, and it will feel like rigour either way.

Which brings the chapter back to where the orchestration one left it. The hard part was never the loop. It is the verifier. Without an independent check against criteria that exist outside the thing being checked, an agent will declare success and move on, and you will have built a machine that produces wrong answers faster than you could have produced them yourself.

Everything in this chapter is an attempt to put something outside the loop. A different vendor's model. A failing test. A live service that either responds or does not. A person who did not build it. None of them are complete. Together they are the difference between residual risk you can name and risk you simply cannot see.
