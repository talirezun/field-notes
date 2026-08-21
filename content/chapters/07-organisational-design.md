---
title: "Organisational Design for the AI Era"
number: 7
slug: "organisational-design"
status: "published"
question: "How should a company reorganise itself around AI, if at all?"
summary: >
  Most AI initiatives fail on org design rather than on technology. The work
  lands in a team with no mandate, no budget for failure, and no route to the
  people whose processes would have to change for any of it to matter.
updated: 2026-08-20
sources:
  - title: "Building the Organization of Tommorow: An Open-Source Framework and Playbook for Partner-Run, AI-Augmented Organisations"
    url: "https://talirezun.com/download/building-the-organization-of-tommorow/"
    publication: "Research paper"
    sections: ["where-it-fails", "the-framework", "compensation"]
  - title: "The Fight for Intelligence"
    url: "https://talirezun.substack.com/p/the-fight-for-intelligence"
    publication: "Substack"
    date: 2026-07-08
    sections: ["the-framework", "the-klarna-test", "the-regulatory-clock"]
  - title: "The Great Reckoning: Vanguard Leadership in the Age of Intelligent Machines"
    url: "https://talirezun.com/download/the-great-reckoning-vanguard-leadership-in-the-age-of-intelligent-machines/"
    publication: "Research paper"
    sections: ["the-regulatory-clock"]
  - title: "AI as a Force Multiplier: Leaders for Industry 5.0"
    url: "https://talirezun.com/download/leaders-for-industry-50/"
    publication: "International Leadership Journal"
    sections: ["where-it-fails"]
  - title: "The ØØT Framework"
    url: "https://github.com/talirezun/oot-framework"
    publication: "GitHub"
    sections: ["the-framework", "the-klarna-test", "compensation"]
  - title: "The Shared Brain: When Second Brains Start Thinking Together"
    url: "https://talirezun.substack.com/p/the-shared-brain-when-second-brains"
    publication: "Substack"
    sections: ["the-framework"]
  - title: "Chasing Jarvis: The Bottleneck Was Never the Code"
    url: "https://talirezun.substack.com/p/chasing-jarvis-the-bottleneck-was"
    publication: "Substack"
    date: 2026-06-28
    sections: ["teaching-it"]
related: ["ai-sovereignty", "agent-memory"]
tags: ["organisational-design", "change", "leadership", "adoption"]
---

## Why do AI initiatives stall inside large organisations? {#where-it-fails}

Because the problem is organisational and the budget went to technology. The models are ready. The organisations are not, and no amount of model quality fixes a process that nobody has permission to change. The most commonly cited number here is that around ninety-five percent of enterprise generative AI pilots produce no measurable effect on profit and loss, with roughly five percent seeing genuine revenue acceleration. That gap is not a capability gap.

The most useful research finding I have come across on this is not about adoption at all. It is about perception.

A randomised controlled trial in 2025 put experienced open-source developers on real tasks in their own repositories with the AI coding tools available at the time. Measured, they were about nineteen percent slower. Asked afterwards, they reported being about twenty percent faster. That is a thirty-nine point swing between what happened and what it felt like, in the group you would most expect to judge it accurately.

Sit with that for a moment, because it invalidates the way most organisations currently evaluate this. If your rollout decision rests on how the pilot team says it went, you are measuring a feeling. Nobody can self-assess AI-assisted productivity without an external baseline, which means the baseline has to be captured before the rollout, and almost nobody does it.

The rest of the evidence points the same direction, at the organisation rather than the tool.

Around eighty-eight percent of organisations report using AI in at least one function, but the small minority that attribute meaningful profit to it are several times more likely to have redesigned workflows end to end rather than layering tools onto existing processes. Workflow redesign, not model selection, is what separates them. Meanwhile a large majority of leaders expect agents to be integrated across their organisation within twelve to eighteen months while under half are automating any workflow with agents today, which is the gap between intention and practice written as a statistic.

Two findings that get read as technophobia and are not.

Developers refuse AI assistance for specific things at high rates: around three quarters decline it for deployment and monitoring, around seven in ten for project planning. That is not fear. Those are precisely the tasks where an error is expensive, the context requirement is highest, and accountability is clearest. The refusal is rational and worth listening to rather than overriding.

And AI assistance improves delivery only where the surrounding engineering discipline already exists. With mature continuous integration, code review and observability, it lifts deployment frequency and lead time. Without them, it accelerates the production of bugs. The tool amplifies the system it lands in, which is a general principle disguised as an engineering finding.

The practical consequence for anyone running a programme: capture a baseline before you start, run a genuine pilot with a slice of the team rather than a mandate to everyone, and plan for a resistance plateau measured in a year or more rather than a quarter. My own reading of the ninety-five percent figure is that a large share of it is teams that gave up after the first disappointing pilot, which is a different failure from the one the number is usually used to describe.

## What structure actually holds up? {#the-framework}

A file-based one. Everything an organisation decides, records, or automates should live as plain text and ordinary spreadsheets in version control, because that is the only format that survives a change of vendor, a change of tool, and a change of staff. Whatever structure you choose on top of that, this is the part that determines whether it is still legible in three years.

The framework I built and publish for this is called ØØT, the Organisation of Tomorrow. It is a public repository rather than a methodology I sell, dual licensed with Apache 2.0 on the code and Creative Commons on the documentation. It ships twelve skill packs, nine spreadsheet templates, eight scheduled routines, four governance documents, and installer tooling. It is designed to be taken apart: adopt the compensation model without the rest, or the knowledge layer without the compensation model.

Three deployment tracks run identical governance: a cloud track, a privacy track running local models on your own hardware, and a community track for people with no budget at all. Agent-assisted installation takes an hour or two. Doing it by hand takes about sixteen hours across two weekends. A ten-partner firm on the cloud track runs at roughly four hundred and seventy euros a month in subscriptions; a five-partner privacy setup is around two and a half thousand euros of hardware once and about fifty-five euros a month after.

Now the part that matters more than the feature list.

**Five of the twelve skill packs are scaffolds rather than finished work**, and one of them is governance and compliance. I mention that first because it is the one an organisation would most want to be finished, and describing a framework as regulation-aware while its compliance module is incomplete is exactly the kind of overclaim this site exists to avoid. The finance and treasury layer is in the same state: the shape is there, the operational instructions are being filled in release by release.

**The knowledge architecture already failed once.** The original design had a single collective brain, and it leaked individual partners' private notes into company infrastructure. Nobody was harmed and it was caught internally, but it was a design error rather than a bug. The fix was to split it in three.

- A **personal second brain** on each individual's own machine, private by default, holding everything they read and decide.
- A **firm brain**, shared and version-controlled, containing synthesised summaries rather than raw notes, pseudonymous by default, with names surfacing only when both the firm and the individual opt in.
- A **ledger** that only automation writes to. Timestamped, signed, never hand-edited, which is what makes it worth anything as a record.

The separation solves a specific problem: institutional memory should survive somebody leaving, without their private thinking having been absorbed into the company along the way.

**Nobody outside my own reference organisations has published a deployment of this.** No adopter count, no independent case study, no third-party evaluation. The generation-three material in the repository is research-stage and I say in the documentation that some of it may simply not work. Treat the whole thing as a well-documented proposal that I run myself, not as a validated method.

## How do you decide whether to let AI replace a human role? {#the-klarna-test}

With a written test, scored before the decision rather than justified after it, reviewed by somebody whose pay does not go up if it passes. Ten questions, each scored zero, one or two, twenty available, and fourteen required to proceed. Below fourteen you hold, fix the gaps, and score it again.

I named it the Klarna Test after the company that publicly cut around seven hundred customer service roles in 2024 with AI credited for the change, saw service quality degrade, and was rehiring on a hybrid model by 2025. The honest version of that story includes a detail people leave out: headcount still fell by roughly forty percent over the period. So the replacement narrative collapsed and the reduction largely stuck. Both things happened, and a framework that only tells you the first half is selling you something.

The ten questions, compressed:

1. Has quality been measured against a human baseline, on real production traffic, for at least three months? Vendor benchmarks do not count.
2. Are you still measuring the original success metric, rather than a proxy like model confidence?
3. Is there a pre-committed reversal threshold, written down before go-live?
4. Is the reversal plan operational? People on standby, escalation paths live, capacity restorable inside two weeks.
5. Were the affected people consulted in writing, with a record of what they said and how it was addressed?
6. Do you have a real baseline from before the rollout?
7. Has a non-beneficiary reviewed it? Someone whose compensation does not increase if this goes ahead.
8. Is the public communication posture decided and owned? "We say nothing" is an acceptable answer only if it is a written decision with a review date.
9. Is a ninety-day post-deployment review scheduled and resourced, with a named owner and a decision framework?
10. Would you be willing to defend this decision in two years?

Two rules make it work rather than decorate. **Score zero if it is not defined now**, which stops the whole thing being gamed by promising to sort it out in phase two. And **the non-beneficiary reviewer is not optional**, which is the only question in the list that cannot be answered by the person who wants the answer to be yes.

The recheck is every ninety days, and proceed is a conditional verdict rather than a permanent one. In practice it runs as a blocking gate: a change labelled as replacing human work does not merge until it has been scored.

A worked example, from one of the reference firms. Handing routine customer onboarding emails to AI, with the original partner remaining as the escalation path, scored sixteen out of twenty. The two lost points were a pilot that ran four weeks rather than three months, and a ninety-day review that was scheduled but under-specified. Both were tightened rather than waived, and it went live with those gaps known and written down. That is the realistic outcome for most decisions, and it is more useful than a clean twenty would have been.

## Does the pay model have to change? {#compensation}

If the work changes shape and the pay does not, you have created an incentive against the tools. When somebody can do in two hours what used to take eight, paying for eight hours rewards them for pretending it still takes eight. Nobody will say that out loud, and it will still be true in the quiet parts of the organisation where adoption actually dies.

The direction I argue for is paying for output rather than attendance, and I want to be careful about how strong that claim is, because it is the most speculative material in this chapter.

What I actually ship is four layers. A small guaranteed base draw, so nobody is living on variance. Monthly variable pay against accepted output specifications. A quarterly long-tail entitlement, a share of the value an artefact actually generated over its operational life, which exists specifically to kill the incentive toward shipping features nobody uses. And a role-weighted annual bonus split roughly three ways between personal output, team, and company outcomes.

Three further layers are documented and deferred: subscription credits, dividends, and buying back units at a published price. Those need legal scoping and, usually, payment rails that are not settled yet, and rushing them would be irresponsible.

Alongside it sits something I would recommend to any partnership regardless of the rest: a written, signed declaration of which reward model each partner is actually on. Pure eat-what-you-kill, pure lockstep, or a declared hybrid with the weights written down. The point is not the choice. It is that the choice is recorded, renegotiable on a known cadence, and not something everyone quietly assumes differently.

Now the limits, which are real.

Output-based pay is reasonably well grounded for many roles and shaky for others. It handles work with a long gap between input and outcome badly: research, long-cycle sales, regulatory work. It handles hard-to-attribute contribution badly too: creative collaboration, mentorship, the person who makes everyone else better. The team and recognition components exist precisely because attribution alone is incomplete, and if that sounds like a patch, it is one.

The legal position varies materially by jurisdiction, and the framework does not solve that. It points at it and runs. Worker classification, the legality of variable pay, securities law around anything resembling an equity entitlement, data protection where an attribution agent is scoring people's output. Local counsel is not a suggestion here.

And one number I want to disown before someone quotes it at me. The idea of a firm being five percent humans guiding ninety-five percent agent operations is a design hypothesis, not a measured outcome. It is a limit case, useful as a direction to think in, and there is no evidence it describes a median organisation.

## How much should regulation drive the timeline? {#the-regulatory-clock}

Less than most European programmes currently let it. The clearest evidence I have is a deadline I was building against myself: the EU AI Act's high-risk obligations were due to take full effect on the second of August 2026, and via the Digital Omnibus package that moved to December 2027. Sixteen months, after two years of compliance planning across the union had been organised around the earlier date.

The detail I find most instructive is not the shift. It is that my own framework's governance documentation, refreshed three days before I wrote about it, had not caught up. I am one of the people tracking this closely, publishing about it, with a repository whose selling point includes regulatory awareness, and I was stale within days.

The design conclusion is straightforward once you have been caught by it. Do not build the programme around a date. Build it around a capability that would be worth having whether or not the date moves. Record-keeping, human oversight, transparency about what is automated, a risk process you actually run: all of those pay for themselves in operational terms and none of them become worthless if a deadline slips. A compliance programme that is only rational because of a specific date is a bet, and that bet just lost sixteen months.

There is a second-order argument here that I have made in co-authored work and that I would present as my position rather than an established finding. Roughly seven percent of European banking and financial services organisations have implemented AI at scale, against US firms that moved from experimentation to execution across the same period. I attribute the lag to three things that compound: genuine compliance overhead, employment law that makes rapid restructuring slow and costly, and, most dangerously, a cultural disposition to read regulatory friction as a competitive advantage rather than as a delay.

My reading is that Europe does not avoid the adjustment, it receives it compressed. A decade of deferred restructuring arriving in two years is not a softer landing. That is a projection rather than a measurement, it is contested by people who think European caution will look wise in hindsight, and I would rather state it as an argument than dress it as a finding.

## What do executives get wrong in the room? {#teaching-it}

They expect it to work out of the box, and then they conclude it does not work. That is the single most common failure in a workshop and it is almost always fatal within a fortnight, because the disappointment lands before the practice does. Everything else I could tell you about teaching this is downstream of getting people past the first hour.

I teach a five-module course to MBA cohorts and executives. It has run online with close to a hundred and fifty participants, drawn predominantly from across several African countries and partly supported by the UN, and as a condensed two-day edition in Belgrade with two cohorts from different generations of an MBA programme.

The measurable outcome from the Belgrade sessions is the one I trust most, and I want to be precise about what it does and does not show. By the end of day two, every group had shipped something real with a live URL: factory-floor optimisation tools, bank-regulation compliance dashboards, workflow automation systems. Many of those people had not touched a developer tool two days earlier.

What I do not have is a completion rate, a dropout number, or any follow-up on whether a single one of those artefacts survived the week. I know that people who had never built software shipped a working link in two days. I do not know that any of it mattered a month later, and I am not going to imply that I do.

Four mistakes I see repeatedly, in the order they usually appear:

**Treating context engineering as an advanced topic.** I originally put it in module four. Feedback made it obvious that was wrong, so it now appears in simple form from module one and deepens through the course. Everything else people struggle with turns out to be a context problem in a costume.

**Treating resistance as a communications problem.** It is not. It is a rational response to being asked to change how you work, without a mandate, by someone who has not measured whether the new way is better. The answer is a real pilot with a slice of the team, a baseline captured beforehand, and champions who earned the role rather than being appointed to it. Appointed champions consistently backfire.

**Skipping the vocabulary.** People try to direct an agent without knowing what a database is for or why deployment is its own discipline, and the agent fills the gap with assumptions. A week on the parts and what they do is the highest-return investment in the whole curriculum.

**Confusing speed with readiness.** The speed gain is real and it lands in the build phase. The discipline requirement in the phase after it has not decreased at all.

The claim I hold most loosely and believe most strongly is this. In almost every room I have taught, the technical barrier turned out to be psychological rather than real, and something changes permanently the moment somebody shares a link to a thing they built themselves. That is experience rather than evidence, and I do not have a way to measure it. But it is why I keep doing the two-day version rather than the lecture.
