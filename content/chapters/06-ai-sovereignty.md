---
title: "AI Sovereignty and Open Weights"
number: 6
slug: "ai-sovereignty"
status: "published"
question: "What does it mean for a European organisation to control its own AI?"
summary: >
  Sovereignty is not a slogan about hosting location. It is a set of concrete
  answers about where the weights run, who can revoke your access, what leaves
  your network, and what you would do if a vendor changed terms tomorrow.
updated: 2026-08-20
sources:
  - title: "16x Cheaper, Open Weights, and the Model That Doesn't Disappear on Fridays"
    url: "https://talirezun.substack.com/p/16x-cheaper-open-weights-and-the"
    publication: "Substack"
    date: 2026-06-18
    sections: ["the-shutdown", "open-weights", "the-cost-case"]
  - title: "Anthropic Shipped Two Models This Week. I Only Wanted One Back."
    url: "https://talirezun.substack.com/p/anthropic-shipped-two-models-this"
    publication: "Substack"
    date: 2026-07-01
    sections: ["the-shutdown"]
  - title: "The Fight for Intelligence"
    url: "https://talirezun.substack.com/p/the-fight-for-intelligence"
    publication: "Substack"
    date: 2026-07-08
    sections: ["what-sovereignty-means", "the-shutdown"]
  - title: "The Brain Is Ready. The Body Is the Problem."
    url: "https://talirezun.substack.com/p/the-brain-is-ready-the-body-is-the"
    publication: "Substack"
    date: 2026-05-04
    sections: ["what-sovereignty-means", "open-weights", "the-tradeoff", "the-three-rings"]
  - title: "Data Sovereignty in the AI Age: Building Your Own Private ChatGPT"
    url: "https://medium.com/@talirezun/data-sovereignty-in-the-ai-age-building-your-own-private-chatgpt-a83c96e342a0"
    publication: "Medium"
    sections: ["what-sovereignty-means", "the-tradeoff"]
  - title: "The Mixed Fleet"
    url: "https://talirezun.substack.com/p/the-mixed-fleet"
    publication: "Substack"
    date: 2026-08-17
    sections: ["open-weights", "the-tradeoff"]
  - title: "The Energy and Water Footprint of Generative AI: A Vanguard Leadership Perspective"
    url: "https://talirezun.com/download/the-energy-and-water-footprint-of-generative-ai/"
    publication: "International Leadership Journal"
    sections: ["the-tradeoff"]
related: ["organisational-design", "coding-agents"]
tags: ["ai-sovereignty", "open-weights", "europe", "policy"]
---

## What does sovereignty actually mean here? {#what-sovereignty-means}

Four questions, none of which is about where the datacentre is. Do you possess the weights, or only permission to call them. Who can switch you off, and how much notice would you get. What actually leaves your network. And what would you do on Monday if the terms changed on Friday. Answer those and you know your position. Answer "our provider has an EU region" and you know almost nothing.

My own position on this moved, and it moved because of an event rather than an argument.

In 2025 I wrote about sovereignty as physical locality: bring it in-house, run it locally, keep the data on your own hardware. Vendor risk was in the piece, but as a bullet point. Changing terms of service, service limitations, lock-in. The sort of thing you list and then stop thinking about.

That is not where I would put the emphasis now. The version I would defend today is that sovereignty is continuity insurance, and the asset that provides it is a weights file you already have plus a work layer that is portable enough to move. Not a contract, not a jurisdiction, not a residency guarantee. Something on a disk that nobody can reach into and remove.

The operating rule that falls out of it is short: never let your ability to function depend on only one path existing.

I want to be careful about what that does and does not imply, because the sovereignty argument attracts purists and I am not one. I still run frontier cloud models for the hardest work, and I would recommend that to most people building today. The claim is not that you should avoid the good models. It is that you should be able to keep operating in a degraded but functional way if one of them becomes unavailable, and that you should know in advance which mode you would drop into.

## What did the export-control episode actually prove? {#the-shutdown}

That no bad actor is required. A model launched on the ninth of June 2026. Three days later, on Friday the twelfth, at twenty past five New York time, a US Department of Commerce export-control directive made it inaccessible to every non-US national worldwide, including the vendor's own employees. It stayed gone for nineteen days. Access began returning on the first of July.

I had it for three days. Then it was gone, and there was no process I could participate in, no notice, and no appeal.

The stated reason involved a reported technique for getting the model to identify software vulnerabilities. The vendor's own analysis, which they published, was that the technique was narrow, not universal, and reproducible on several other widely available models. Whether you find that reassuring is not really the point.

The point is what the episode reveals about the shape of the dependency. Nobody behaved badly here. The vendor did not deprecate a product to push an upgrade. There was no outage, no billing dispute, no acquisition. A government made a decision on a Friday evening on another continent, and a tool that a lot of people had built processes around stopped existing for them. An organisation does not need anyone to act in bad faith for a single-vendor intelligence dependency to become a real operating risk.

My reading is that this was the first time a national government applied export controls directly to a deployed model rather than to chips or hardware. I have not been able to verify that independently, so treat it as my reading rather than an established fact. If it is right, it is a category change, because chip controls take years to bite and a model switch-off takes minutes.

What I actually changed afterwards was not my model choice. It was making sure there was a second path that already worked, rather than a second path I could theoretically build.

## Are open-weight models good enough yet? {#open-weights}

For a large share of real work, yes, and the threshold that matters is not the trillion-parameter flagship. It is the mid-sized model that is genuinely good and fits on one consumer graphics card. That is the point at which "run it yourself" stops being a research project and becomes a Tuesday.

Two releases from the summer of 2026 illustrate where the line sits, and I am dating them deliberately because this moves fast enough that an undated claim here is worthless.

**Qwen3.8-27B**, released on the fourteenth of August 2026 under Apache 2.0. Roughly twenty-seven billion parameters, dense, with a 262,000-token native context window. At four-bit quantisation the community consensus is that this needs a 24GB card rather than a 16GB one. That is one high-end consumer GPU. Not a rack, not a datacentre, one card. I should be clear that the memory figure is community consensus rather than my own benchmark.

**DeepSeek V4 Flash**, in public beta from the thirty-first of July 2026 with MIT-licensed weights. Text only, and it wants 32GB and up to run locally.

Earlier in the year, **Kimi K2.7** landed with a modified MIT licence, a trillion total parameters with thirty-two billion active per token in a mixture-of-experts arrangement, and a 256,000-token context window. Its published benchmark score came from its own maker, independent scores were not available when I wrote about it, and practitioners were reporting that headline numbers did not replicate cleanly on real repositories. I said then to treat it as directional rather than definitive and I would say the same now.

Which brings me to the caveat that applies to this entire section. Nearly every benchmark number circulating about these models is vendor-published. In at least one comparison I looked into, the prompting was not symmetric: the vendor's model got one fixed prompt while the models it was measured against got the better of two attempts. Read headline scores as a direction of travel. Re-verify anything you would spend money on the strength of.

One distinction that gets collapsed constantly and should not be. Open weights and local execution are not the same thing. A model with published weights and six hundred billion parameters is still not running on your laptop. Open weights give you the right to run it and the ability to keep a copy. Whether you can actually run it is a separate question about your hardware.

## What does the cost difference look like in production? {#the-cost-case}

Roughly an order of magnitude, on the right kind of work. On a test of twenty-four generated landing pages across twelve prompts, an open-weight model came in at about a dollar fifty in total, against about twenty-four dollars for a frontier model on the same set. Per page, four to fifteen cents against seventy-five cents to a dollar twenty-six. That is sixteen times cheaper, and about seven and a half times cheaper than the mid-tier frontier option on the same task.

Two caveats, and the second one is the important one.

The outputs were comparable, not identical. On a task like this that is a reasonable basis for comparison, because the point is whether the result is fit for purpose rather than whether it is the same result. On complex multi-step engineering work I would not make that assumption at all, and the benchmark gap between these tiers was real and material.

And I could not run the frontier side of that comparison myself. Export controls meant I did not have access to that model when I wrote the piece, so those figures came from external research rather than from my own account. That is a meaningful weakness in a cost comparison and I would rather say so than let the ratio travel without it.

What the numbers support, stated conservatively: for high-volume, well-specified, relatively mechanical generation, the cheap open-weight option is not a compromise, it is the correct choice, and the saving is large enough to change what you can afford to attempt. For the hardest reasoning work, the frontier models were still ahead when I measured, and I would still route there.

That is the routing strategy in one line. Open weights for volume, frontier for judgement, and a self-hosted fallback that already works.

## What do you give up by running your own? {#the-tradeoff}

Capability, and more of it than the enthusiasts admit. The capability ceiling of what you can run on consumer hardware is still well below what the frontier cloud models do. Local deployment of a model good enough to be a genuine daily assistant remains a niche capability rather than a default, and I say that as someone who runs local models regularly and wants the other answer to be true.

There is a version of this argument that says the gap closes on its own, because what needed a server farm in 2023 runs on a laptop now. I think that is probably right and I also think "eventually" is not a useful answer for anyone who has to make an infrastructure decision this quarter.

The second thing you give up is cleaner economics, and this one surprised me.

The obvious move is a mixed fleet: a frontier orchestrator on your subscription, delegating mechanical work down to a local model. Mostly it does not work. Pointing a harness at a local endpoint is usually substitution rather than addition, session-wide, replacing the frontier model rather than letting it call a local worker. One harness genuinely routes different agents to different providers in the same session. And the vendor position is that subscription logins are for native use of their own products, with third-party tools expected to use metered API billing, which one open-source project acted on in March 2026 by removing its subscription integration after a legal request. So the mixed fleet works, and if a frontier model is in it, you pay API rates for that slice. There is currently no supported way to have both the subscription economics and the cross-provider orchestration.

I should also say that I established most of that against official documentation rather than by running every combination myself. I did not want to publish a wish list dressed up as a field test.

What you gain, beyond the two things already covered, is a smaller and more predictable surface. Nothing leaves the machine. Nothing is retained under a policy you did not write. And there is a modest environmental argument alongside it: in a comparison I co-authored, running a mid-sized open model locally used roughly a third less energy per task than a frontier cloud model on the same job. That figure comes from published literature and, in places, from vendor-reported data rather than from independent measurement, so I would treat it as an argument for the direction rather than a number to quote.

## How do you decide what an agent may touch? {#the-three-rings}

Three rings, decided in advance rather than in the moment. Ring one is what you connect freely. Ring two is what you connect with your eyes open. Ring three never goes near a cloud agent at all. Sorting your data into those three buckets before you wire anything up is the single most useful hour you can spend on this, and almost nobody does it.

**Ring one, connect freely.** Published work, public-facing material, generic research. The test is simple: data you would be comfortable with your employer or a contractor seeing.

**Ring two, connect with awareness.** Email, calendar, project management tools, working documents. Sensitive, but not personally identifying and not financially critical. This is where most useful agent work actually happens, and where you should be reading retention policies rather than assuming them.

**Ring three, local only or not at all.** Financial records, medical data, personal correspondence, legally privileged communications, client-confidential material. Do not route this through a cloud agent. If you need AI help with it, use a local model and accept the lower capability as the price.

The underlying tension is not going away, and it is worth naming plainly: the more context an agent can reach, the more useful it becomes, and the more of that context passes through infrastructure you do not control, the more of your position you have given up. Those are not independent variables you can optimise separately. Every increase in usefulness is an increase in exposure, and the rings are just a way of deciding where you are willing to make that trade before you are in a hurry.

Two practical notes from running this.

Use a dedicated machine and a dedicated identity for agent work where you can. If an agent has access to a contained environment with nothing sensitive in it, the risk is proportionate to the access. If it runs on your daily driver, it has access to everything by definition, whether or not you intended that.

And watch what vendors do rather than what they say. When one company's screen-capture feature launched unavailable in the EU, the UK and Switzerland, that was a product decision rather than an accident, and it told you more about how the feature handles data than any policy page would have.
