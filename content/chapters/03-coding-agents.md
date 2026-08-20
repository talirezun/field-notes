---
title: "Coding Agents and Harnesses"
number: 3
slug: "coding-agents"
status: "scaffold"
question: "What is the difference between a model and the harness you run it in?"
summary: >
  The model writes the code. The harness decides what it sees, what it may
  touch, and when it stops. Most of the difference between a good session
  and a wasted one comes from the harness, not from the model underneath it.
updated: 2026-08-20
sources:
  - title: "Substack archive"
    url: "https://talirezun.substack.com/archive"
    publication: "Substack"
    placeholder: true
    sections: ["what-a-harness-does"]
  - title: "Medium archive"
    url: "https://medium.com/@talirezun"
    publication: "Medium"
    placeholder: true
    sections: ["comparing-them"]
related: ["context-engineering", "orchestration"]
tags: ["coding-agents", "developer-tools", "harness", "claude-code"]
---

## What does a coding harness actually do? {#what-a-harness-does}

The finished section answers this in one paragraph: it is the whole apparatus around the model, and it is where the leverage is.

To write:

- File access, tool permissions and the stop condition
- Why the same model behaves differently in two harnesses
- The parts that matter to a non-developer specifically

## How do the harnesses I have used actually compare? {#comparing-them}

The finished section answers this in one paragraph, and names only tools I have run on real work.

To write:

- The ones I have used long enough to have an opinion about
- The ones I have only tried briefly, said as such
- What I would pick today and why that may not hold in six months

## How much should you let an agent do on its own? {#permissions}

The finished section answers this in one paragraph: autonomy is a function of how cheaply you can undo the work.

To write:

- The undo-cost heuristic
- Where I let it run and where I gate every step
- A mistake this rule was written to prevent
