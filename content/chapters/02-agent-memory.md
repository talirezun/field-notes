---
title: "Agent Memory and Second Brains"
number: 2
slug: "agent-memory"
status: "scaffold"
question: "How do you give an AI agent memory that survives the session?"
summary: >
  An agent forgets everything when the window closes. A second brain is the
  durable half of the system: structured, linked notes that the agent reads
  back on demand, so the accumulated thinking outlives any single
  conversation.
updated: 2026-08-20
sources:
  - title: "Substack archive"
    url: "https://talirezun.substack.com/archive"
    publication: "Substack"
    placeholder: true
    sections: ["the-problem"]
  - title: "The Curator"
    url: "https://github.com/talirezun/the-curator"
    publication: "GitHub"
    sections: ["what-a-second-brain-is", "retrieval"]
related: ["context-engineering", "coding-agents"]
tags: ["agent-memory", "second-brain", "knowledge-management", "mcp"]
---

## Why does an agent forget, and why is that hard to fix? {#the-problem}

The finished section answers this in one paragraph: the context window is working memory, and nothing about it was designed to be durable.

To write:

- The difference between a long context window and memory
- Why chat history is not a knowledge base
- What I tried first and why it did not hold up

## What is a second brain, in concrete terms? {#what-a-second-brain-is}

The finished section answers this in one paragraph: an interlinked set of markdown notes about entities, concepts and sources, kept on your own machine.

To write:

- Atomic notes, and why the granularity matters
- Entities, concepts and summaries as three different node types
- Why markdown on disk rather than a database

## How does the model actually reach the notes? {#retrieval}

The finished section answers this in one paragraph: over MCP, as a tool the model calls, not as text you paste.

To write:

- What the MCP bridge exposes and what it deliberately does not
- Search behaviour that works versus search behaviour that looks clever
- The cost profile, honestly stated

## What changes once your thinking outlives the session? {#knowledge-immortality}

The finished section answers this in one paragraph: the compounding effect is the point, and it takes months to show up.

To write:

- What accumulated well for me and what did not
- The maintenance cost nobody mentions
- Where this is still unproven
