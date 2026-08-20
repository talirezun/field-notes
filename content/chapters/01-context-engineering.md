---
title: "Context Engineering"
number: 1
slug: "context-engineering"
status: "scaffold"
question: "How do you give an AI agent the context it actually needs?"
summary: >
  Context engineering is the practice of structuring what an agent knows
  before it acts. Done well, it is the difference between an agent that
  ships working software and one that drifts for an afternoon and produces
  nothing you can use.
updated: 2026-08-20
sources:
  - title: "Substack archive"
    url: "https://talirezun.substack.com/archive"
    publication: "Substack"
    placeholder: true
    sections: ["what-to-load"]
  - title: "Medium archive"
    url: "https://medium.com/@talirezun"
    publication: "Medium"
    placeholder: true
    sections: ["how-it-fails"]
related: ["agent-memory", "coding-agents"]
tags: ["context-engineering", "ai-agents", "methodology"]
---

## What belongs in an agent's context, and what does not? {#what-to-load}

The finished section answers this in one paragraph: which artefacts an agent needs loaded before it starts, and which ones cost more than they return.

To write:

- The distinction between reference material and working state
- Why more context is not better context, with the failure I hit repeatedly
- What I load by default now, and the order I load it in

## How do you structure the first phase of a build? {#three-phase-build}

The finished section answers this in one paragraph: what phase one produces, and why it is not code.

To write:

- The three-phase shape as I actually run it
- What a phase one artefact looks like, with a real example
- The hand-off between phases, which is where most of the value sits

## Why does an agent drift, and where does it start? {#how-it-fails}

The finished section answers this in one paragraph: drift is almost always a context problem showing up as a reasoning problem.

To write:

- The specific point in a session where drift begins
- How to notice it early rather than at the end
- The recovery move, and when to start over instead

## Does any of this change if you cannot read the code? {#for-non-developers}

The finished section answers this in one paragraph: the practice is the same, the verification is different.

To write:

- What you can verify without reading code
- What you genuinely cannot, and how I work around it
- Where I have been wrong about this
