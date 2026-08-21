---
title: "Building Without Being a Developer"
number: 4
slug: "building-without-being-a-developer"
status: "published"
question: "Can you ship production software without being able to write the code?"
summary: >
  Yes, with conditions, and the conditions are the interesting part. What you
  trade is line-level control. What you need in exchange is judgement about
  systems, an honest test loop, and the discipline to verify what you cannot
  read.
updated: 2026-08-20
sources:
  - title: "Chasing Jarvis: Can Technically Sophisticated Non-Programmers Deploy SaaS Applications Using AI Coding Agents?"
    url: "https://talirezun.com/download/chasing-jarvis-can-technically-sophisticated-non-programmers-deploy-saas-applications-using-ai-coding-agents/"
    publication: "Research paper"
    sections: ["who-this-is-for", "what-breaks", "how-you-verify", "what-it-costs"]
  - title: "Chasing Jarvis: The Bottleneck Was Never the Code"
    url: "https://talirezun.substack.com/p/chasing-jarvis-the-bottleneck-was"
    publication: "Substack"
    date: 2026-06-28
    sections: ["what-you-need", "the-centaur-model", "what-it-costs"]
  - title: "A Year in the Review"
    url: "https://talirezun.substack.com/p/a-year-in-the-review"
    publication: "Substack"
    date: 2026-06-23
    sections: ["what-breaks", "what-it-costs"]
  - title: "Six Months After I Shipped Lumina"
    url: "https://talirezun.substack.com/p/six-months-after-i-shipped-lumina"
    publication: "Substack"
    date: 2026-07-10
    sections: ["what-breaks"]
  - title: "I Could Tell You My AI Has Never Lied. I'm Not Going To."
    url: "https://talirezun.substack.com/p/i-could-tell-you-my-ai-has-never"
    publication: "Substack"
    date: 2026-08-06
    sections: ["who-this-is-for", "what-breaks", "how-you-verify"]
  - title: "From Prototype to Production: Building an AI Widget Platform in 30 Days"
    url: "https://medium.com/@talirezun/from-prototype-to-production-building-an-ai-widget-platform-in-30-days-23c603c91475"
    publication: "Medium"
    sections: ["what-it-costs"]
  - title: "The Year I Started Coding with AI: My Coding Agent Journey"
    url: "https://medium.com/@talirezun/the-year-i-started-coding-with-ai-my-coding-agent-journey-431f6f25afe1"
    publication: "Medium"
    sections: ["what-you-need", "who-this-is-for"]
  - title: "From 0 to Dev in One Day: What a Real Coding Harness Actually Looks Like"
    url: "https://talirezun.substack.com/p/from-0-to-dev-in-one-day-what-a-real"
    publication: "Substack"
    date: 2026-07-20
    sections: ["what-you-need"]
related: ["coding-agents", "context-engineering"]
tags: ["non-developer", "centaur", "product", "practice"]
---

## What do you actually need to know before you start? {#what-you-need}

Not programming. You need enough vocabulary to direct the work: what a database is for, what an API does, what authentication involves, and why deployment is its own discipline rather than a button at the end. That is about a week of deliberate learning. You are not learning to code. You are learning enough to say what you want in terms the agent can act on.

I tell students this on day one of every workshop, because the loudest voices online skip it and the skipping is why people bounce off.

It does not work out of the box. Nobody types a sentence and receives a business. What actually happens is that you describe an idea, the agent builds something roughly shaped like it, and then you spend the real time on the gap between roughly and actually. Closing that gap needs vocabulary. If you cannot tell the difference between a problem with the database and a problem with the way the front end is calling it, you cannot tell the agent anything useful, and it will guess.

Learn the bricks before you try to conduct the orchestra. A week on what the parts are and what they do buys you months of being able to direct rather than hope.

The mental shift underneath this is that the ceiling moved. It used to be whether you could write the code. It is now how well you can specify, structure, and supply context. Those are different skills, and thirty years of running businesses turns out to be better preparation for the second one than a computer science degree is.

The single most useful sentence I have found, and I use it constantly: sorry, I do not understand this, I am not a developer, please explain it simply. Treat the agent like a very capable colleague who has never met you and does not know what you know. It will not think less of you. Every time you use that sentence you are closing a gap between what it assumed and what is true.

## Who does this actually work for? {#who-this-is-for}

Domain experts with substantial technology experience but no programming background. That is a narrower group than "anyone," and I want to be precise about it, because I spent two years studying this question with myself as the subject and the answer that came back was bounded rather than universal.

The honest framing is a qualified yes with conditions. Six of them: you master context engineering rather than programming, you have deep domain expertise to compensate for the technical gaps, you scope realistically to what the tools can currently do, you invest serious time in learning and iteration and quality assurance, you can pay for the subscriptions, and you audit systematically for security. Remove any one and the picture changes.

I should be clear about my own position in that finding, because it is the main limitation of the research. I am a technologist rather than a developer. I understand systems, I can architect a solution, I have enough coding knowledge to reason about a complex application stack. What I could not do was sit down and write thousands of lines of production code. That sits precisely on the boundary the study was investigating, and it means my results probably overstate how accessible this is to someone starting from zero. The paper says so about itself, along with the fact that it is a single researcher studying a single deployed application, and that a meaningful share of its own citations are my own earlier articles.

Complete novices still face substantial barriers. There is a real possibility that these tools amplify existing skill gaps rather than closing them.

Which brings me to something I would rather state than bury. My own position on this has moved twice, in public, and it has moved in both directions.

In late 2025 I was telling non-technical founders to partner with someone technical for production deployment, because production deployment still required expertise. By mid-2026 I was writing that non-technical founders are not at a disadvantage, they are one context package away from shipping. And in August 2026, after seven months of running a product with real customers, I wrote that I now think the gap between people who work this way and people who do not is widening as models improve, not closing. I had assumed for years that better models would democratise this. I currently think the opposite is happening.

Those three positions are not compatible as slogans. What reconciles them is that they answer slightly different questions: can you build it, can you ship it, and does the ability to do so spread. My current answers are yes, yes with conditions, and probably not on its own.

The most useful move I made in two years of thinking about this was deciding the original question was the wrong one. "Can non-developers build production software" is not the interesting inquiry. The interesting one is what new forms of expertise make someone effective at collaborating with these tools, because that is the thing that is actually being distributed.

## Where does the human stay in the loop? {#the-centaur-model}

The human supplies the specification, the taste, the judgement, and everything that depends on context the model has never seen. The model supplies implementation at speed. Neither half is sufficient alone, and the interesting work is being specific about where exactly human judgement compounds rather than treating "human in the loop" as a reassuring phrase.

The evidence for the pattern is better than it usually gets credit for. A controlled field experiment run with Procter and Gamble, with 776 participants, found that individuals working with AI matched the performance of two-person teams working without it, and that AI broke down the silos between research and commercial roles. Karpathy's framing of the same division is the cleanest I have read: the specification is human, the implementation is the model's, the review is human again.

Now the caveat, which matters more than the evidence.

The word gets watered down. It becomes a slogan for keeping people in roles where they no longer add value, or a polite cover for automating everything and calling the leftover supervision "collaboration." Neither is the thing. The discipline is to identify precisely which decisions get better when a human makes them, and to stop defending the ones that do not.

And there is a counterweight in the research that I cite in my own work and should not leave out here. A separate industry study found that a twenty-five percent increase in AI adoption correlated with a seven point two percent decrease in delivery stability. Individual productivity gains do not automatically become better software delivery. Both findings can be true: the individual gets faster, and the system around them gets less stable, because the system was not redesigned around the new speed. That is a chapter of its own, further on.

## What goes wrong when you cannot read the code? {#what-breaks}

The first seventy percent goes fast and needs almost no expertise. The last thirty percent demands debugging skill, architectural understanding, and systematic problem solving, which is exactly the set of things a non-developer does not have, arriving at exactly the moment it is needed most. That asymmetry is the central difficulty of working this way, and no tool has removed it.

How far you get before you hit it depends heavily on the harness. In my own testing across eight platforms, the browser-based builders started struggling somewhere around fifteen to twenty components. IDE-integrated agents managed forty to fifty with proper context management. The stronger command-line agents reached seventy-five to a hundred. Tools that index the codebase ahead of time went past a hundred, and still needed a human to make the architectural decisions.

Then there is the ordinary mess, which nobody puts in a launch post.

Agents making conflicting commits. An agent deploying to the wrong production project entirely. My own test infrastructure silently writing test data into real user folders, which is genuinely embarrassing and which I found rather than being told about. The darkest green squares on my contribution graph are not triumph. They are Saturdays spent debugging.

The failure that taught me the most was none of those. It was a hair studio in Ljubljana whose assistant started telling real visitors, mid-conversation with real customers, that it was having trouble connecting. The cause was a two thousand character safety limit I had set months earlier and forgotten about, silently rejecting the owner's longer instructions. I traced and fixed it the same day, raised the limit four times over for everyone, and added a live counter so nobody hits an invisible wall again.

What that day actually taught me was about thresholds rather than character counts. There is a moment when a product stops being a project and becomes a business, and it is not funding or launch or a revenue number. It is the first time a real person's real customers feel it when something breaks.

Later, a bigger version of the same shape. A customer uploaded a document that met every stated requirement and was large enough on its own to consume well over the entire available context budget, and their assistant stopped answering anyone at all. The requirements were not wrong. They were incomplete, and incompleteness in a written rule is invisible until someone walks into it.

That points at the deepest failure mode in this way of working, and I only saw it clearly when I ran a multi-agent audit across my own product. Every single finding had the same shape: something asserted in a document had been mistaken for something enforced in the code. A rule written down, checked at runtime against a list nobody could ever have filled in, passing forever. Nothing failed. Nothing logged. The document said the property held and the code agreed, and neither of them was doing anything.

When you cannot read the code, written intent is most of what you have. So the gap between what a document claims and what the system does is the specific place your kind of build goes wrong.

## How do you check work you cannot read? {#how-you-verify}

By moving verification out of the code and into things you can observe: behaviour, staged deployment, adversarial review by a model that did not write the thing, and tests that fail. The governing rule I ended up with is one sentence long. A comment cannot fail. A test can.

That sentence is the whole method compressed. Any property you write down in a document, write down again as a test, so that when it stops being true something breaks loudly instead of quietly staying written.

The four checks I actually run:

**Use it yourself, exhaustively.** Every button, every screen, every error state, as a real user, including the empty form and the interrupted upload. When something breaks, never say it is broken. Say what you clicked, what you expected, what you got, and attach the screenshot. Specific reports get specific fixes.

**Deploy in stages and verify live between them.** On one recent release I shipped fourteen backend functions as five separate production deployments, each one checked against the live service before the next started. It is slower and it means a failure has one obvious cause instead of fourteen candidates.

**Audit with a model that did not write the code.** This is the highest-value habit in the whole chapter. An agent reviewing its own work reads what it meant to write. A model from a different vendor reads what is actually on the page. It is exactly like bringing in an external auditor, and it works for the same reason: not because they are smarter, but because they are not invested in the story of how the thing got built. I write with one model and audit with another as a matter of routine.

**Get someone who did not build it to use it.** They will find things you never will. This one has never stopped being true and I do not expect it to.

Now the limit, plainly. None of this lets me read a diff, and none of it is equivalent to being able to. My own research says exactly that: people without a programming background cannot reliably verify code correctness, and the mitigation it recommends is engaging actual security professionals for a pre-deployment audit, while conceding that even that does not eliminate the underlying risk.

There is also a circularity I have not solved. Using AI agents to help audit AI-generated code assumes you know enough to direct the audit. If you do not, you have added a step without adding assurance.

The published research on generated code is not comforting either. One large study across more than a hundred models and eighty tasks found only around fifty-five percent of generated code was secure. On my own thirty-day build, the security pass surfaced eighteen issues that needed fixing, which means eighteen vulnerabilities existed in code I had already decided looked finished.

I ship anyway, with tests, staged deploys, cross-vendor audits and residual risk I can name. That is not the same as safety. It is a set of defences I can actually operate, which is better than a standard I cannot meet.

## What does this actually cost, in time and money? {#what-it-costs}

Far less in money than people expect and far more in time than anyone admits. Lumina went from nothing to a deployed product in thirty days for under a hundred euros in model credits. It also took roughly two hundred hours of my own time inside those thirty days, evenings and weekends included, and about half of that was context engineering rather than building anything.

That second number is the one missing from every optimistic version of this story.

A few more, all from my own records rather than estimates. The avatar platform came to around seventeen thousand lines across more than three hundred agent sessions, reached a production MVP in about six weeks, and burned close to three hundred dollars a day in credits at peak. Across twelve months I logged 1,278 contributions, ninety-eight percent of them commits, spread across four products that shipped. The client on the avatar project did the counterfactual arithmetic themselves and put it at five developers and six to twelve months against one founder and six weeks. That is their number, not mine, and it is the kind of comparison worth being sceptical about, but they were the ones paying either way.

Two structural things about cost that took me too long to learn.

**Subscriptions beat metered API billing for development work.** Not because they are cheaper on any given day, but because on metered billing you start optimising for cost instead of quality. You skip the audit run. You do not re-verify. Once, on an early command-line agent billed by usage, a single intensive day cost me over three hundred euros, and the effect was that I worked more cautiously rather than better.

**The numbers everyone quotes exclude most of the cost.** Hosting, payment processing fees, domains, and the ongoing operational work of running a live product are not in the hundred euros. Neither is the two-year learning curve that made the thirty days possible, which is the largest cost of all and appears in nobody's accounting including, usually, my own.

The claim I will stand behind is narrower than the headline. Testing an idea used to cost a payroll and half a year. It now costs a weekend and a few hundred in credits. That changes who gets to try, which is a genuinely large change. It does not mean the thing you build in that weekend is a business, and it does not mean the last thirty percent got any easier.
