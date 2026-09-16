---
title: "Every Product Needs a Home"
number: 10
slug: "product-websites"
status: "published"
question: "How should a product's website be built now that agents are both the builders and the readers?"
summary: >
  A product website is where a stranger decides in twenty seconds whether your
  work deserves twenty minutes. Built right in 2026 it is static files on the
  edge, legible to machines, with the conversation woven into the page rather
  than parked in a corner.
updated: 2026-09-16
sources:
  - title: "Every Product Needs a Home"
    url: "https://talirezun.substack.com/p/every-product-needs-a-home"
    publication: "Substack"
    date: 2026-09-16
    sections: ["why-a-home", "static-again", "legible-to-machines", "answer-aware-navigation", "hosting-and-cost", "the-brief"]
  - title: "Lumina: An AI Agent Your Business Can Stand Behind"
    url: "https://talirezun.substack.com/p/lumina-an-ai-agent-your-business"
    publication: "Substack"
    date: 2026-07-31
    sections: ["answer-aware-navigation"]
  - title: "Six Months After I Shipped Lumina"
    url: "https://talirezun.substack.com/p/six-months-after-i-shipped-lumina"
    publication: "Substack"
    date: 2026-07-10
    sections: ["answer-aware-navigation"]
  - title: "From Prototype to Production: Building an AI Widget Platform in 30 Days"
    url: "https://medium.com/@talirezun/from-prototype-to-production-building-an-ai-widget-platform-in-30-days-23c603c91475"
    publication: "Medium"
    sections: ["static-again"]
  - title: "The Curator, product site"
    url: "https://mycurator.xyz"
    publication: "Product site"
    sections: ["answer-aware-navigation", "hosting-and-cost"]
  - title: "Field Notes, source repository"
    url: "https://github.com/talirezun/field-notes"
    publication: "GitHub"
    sections: ["static-again", "legible-to-machines"]
related: ["what-i-shipped", "coding-agents", "building-without-being-a-developer"]
tags: ["product-websites", "static-sites", "geo", "lumina", "cloudflare"]
---

## Why does a product still need a website when anyone can build an app? {#why-a-home}

Because the first thing anyone asks when you have finished building something is where they can see it, and the answer is still a URL. A website is the home of a digital product. It is the place where a stranger decides in about twenty seconds whether your work deserves twenty minutes, and no amount of app, agent or protocol changes that.

In the agent era everything else got exciting. Models, context windows, MCP servers, multi-agent pipelines. A website is not exciting, which is exactly why it gets neglected, and why I decided to spend real time on The Curator's site and write the process up as a manual rather than a product update.

The argument I make, and I know it sounds odd, is that websites are entering a renaissance rather than dying. Three things changed at once, and each of the next sections is one of them. The hosting became free. Google stopped being the sales channel. And people, given the choice, would rather talk than read.

I have built product homes since 2002, first by hand in HTML uploaded over FTP, then in WordPress with a database and a plugin ecosystem behind it. The 2026 version looks, from the outside, like the 2002 version. It is a folder of files a server hands out. That is not a return. It is the old architecture with every one of its weaknesses removed, and the rest of this chapter is about what got added.

## What does "static" mean now, and why is it the secure default? {#static-again}

Static means the server hands out files and runs nothing. No database to inject into, no login page to brute-force, no server-side code to exploit. The attack surface shrinks to almost nothing, which is the same reason it was true in 2002. What is different now is that a static page can do almost everything a dynamic one could, without giving that up.

The differences are concrete enough to brief an agent with. The pages are still files, but they carry their own JavaScript, so they animate, respond to scrolling and remember state; the browser does the work PHP used to do on a server. Anything that genuinely needs a backend is delegated to an API: contact forms, chat, analytics, payments, authentication all run on someone else's service and the page calls them. The files are served from a content delivery network, copied to hundreds of edge locations and served from the nearest one, which is why these sites load in a fraction of a second everywhere. Deployment is a push, not an upload: commit to a repository, and a pipeline puts the whole new version live at once, with any previous version a rollback away. And with a small manifest and a service worker, the site installs on a phone like an app.

The industry name for this shape is JAMstack, coined around 2015 for sites built from JavaScript, APIs and markup. Whether you use the word or not, this is what you are building. The one sentence that matters when you brief a coding agent is: build a static site, plain files, no server-side code, no database, deployable to a CDN, with any dynamic features handled by external APIs. A good agent knows exactly what that means.

The site you are reading is built this way, and so is The Curator's. Lumina, the conversation layer in chapter nine, was designed from the start to fit this architecture: it is delivered as a small script, so the page stays plain files and the intelligence lives behind an API. That was a deliberate constraint rather than a limitation, because a product that broke the static architecture to add conversation would be trading away the thing that makes the architecture worth having.

## Who is the site for, if Google stopped being the sales channel? {#legible-to-machines}

For the agents that now read the web on behalf of people, and for the people who arrive through them. Being found and correctly described by a language model is becoming more valuable than being ranked by a search engine, and a product site in 2026 has to be legible to machines as a first-class requirement rather than an afterthought.

This is the sad part of the story for anyone who remembers the early web, where a good site with the right words could win on Google by itself. That advantage is gone. The results page fills with the search engine's own answers, and the search box is increasingly a prompt to a model rather than a query to an index. You still optimise for search. It would be foolish not to. But an army of crawlers now reads the web for ChatGPT, Claude, Gemini, Perplexity and the rest, and the question that decides your visibility is whether your site is open to them and explains the product in a way a model can ingest and cite. Some people call this answer engine optimisation or generative engine optimisation. I call it being legible to machines, because that is all it is.

Concretely, it is a short list, and every item is something an agent can build in an afternoon. Static head tags for crawlers and link previews: title, description, canonical URL, Open Graph and social cards with a generated preview image. Structured data in JSON-LD describing the product, with author, licence and download URL. A robots.txt that welcomes AI crawlers by name rather than blocking them by default, which is what most hosting platforms now do unless you tell them otherwise. A sitemap. A real 404 rather than the home page served under every unknown address.

And an llms.txt. This is an emerging convention, proposed in 2024, for a plain text file at the root of a site that tells language models where the most useful, machine-readable version of your content lives. It is the robots.txt of the agent era. If you do only one thing for AI discoverability, do this one. The Curator's site points agents at four compact markdown knowledge files first; this site points them at the raw markdown of every chapter. Same idea, and it costs one file.

I learned the blocking point the hard way on this very site. The hosting platform had quietly injected a managed robots.txt above mine that told ClaudeBot, GPTBot and the others to go away, on a site whose entire purpose is to be read by them. Nothing in the repository showed it. Check the live file, not the one you wrote.

## What does integrated conversation look like, as opposed to a chat widget? {#answer-aware-navigation}

The assistant knows the page's table of contents, and the page knows what the assistant just talked about. That is the whole difference. A chat bubble in the corner is a separate product sitting on top of your site. Integrated conversation is the site and the assistant merged into one experience, and it is built from two techniques that each do half the job.

The first is grounded deep linking, on the knowledge side. The assistant is not left to guess where things are on the page. Alongside the product documentation it holds a small page map: a table of the page's sections, what each contains, and its anchor URL. The instruction is that whenever a section of the page answers the question, the reply includes that link. So when a visitor asks how to install, the assistant cites the Quick start section the same way a retrieval assistant would cite a document. It is grounded because the assistant can only emit anchors that exist in the map.

The second is intent-to-section mapping, on the page side, and it exists because a model will sometimes answer without linking. When an answer finishes, a small scoring routine in the page's own code compares the question and the answer against a keyword map of the same sections. A keyword in the visitor's question scores three, one in the answer scores one, a section link the assistant emitted itself scores six, and anything under two is dropped as noise. At most three chips, never one for a section that does not exist. The result is a row of buttons under each answer that scroll you to the section and outline it briefly. The URL does not change and no tab opens. This is ordinary client-side routing to page fragments, driven by the conversation instead of a menu.

Why both: the assistant's citations are precise but not guaranteed, and the keyword scoring is guaranteed but less precise. Together, someone who asks about installation gets the answer, the assistant's own link inside it, and a button to the section where the download and the setup steps actually sit.

On The Curator's site this runs on Lumina, grounded in four compact markdown files of product knowledge written to a specification: every fact stated once, headings phrased as the questions visitors actually type. The hero section is designed around the conversation, so the first thing a visitor meets is an invitation to ask, and the prompt detaches and floats as you scroll. You chat with The Curator about The Curator. More accurately, you chat with Lumina about The Curator. Lumina is a commercial product and chapter nine says what I am willing to say about it publicly; the site is where to see it working.

One rule I consider non-negotiable on the page side. A single prefers-reduced-motion rule switches off every animation, the floating prompt included. Respecting that setting is an accessibility requirement, not a nicety, and it is one line to ask your agent for.

## What does it cost, and where does it run? {#hosting-and-cost}

Nothing, at the scale a product website will ever reach. A whole industry has grown up around hosting static sites, and every serious host offers a free tier generous enough for real traffic: connect a repository and the site is live worldwide in seconds. The economics are absurd compared to 2002.

I use Cloudflare, for the unglamorous reason that all my domains already route through it, and the specific service is Workers with static assets. Vercel, Netlify, Firebase and GitHub Pages follow the same pattern and any of them would do. What you are paying for, in every case, is nothing, up to a scale most product sites never see.

For a sense of what the result weighs, The Curator's site is one HTML page and a standalone 404, twenty-three files in the repository, about a hundred and fifty kilobytes of markup and a runtime under seventy. Screenshots ship as WebP with a PNG fallback at twice the displayed width for retina screens, which cut image weight by about three quarters. A response headers file sets security headers on everything, caches images for a day, and revalidates HTML and scripts on every load so a deploy is visible on the next reload. A desktop Lighthouse run scored a hundred for SEO and ninety-six for performance, accessibility and best practices. Those are the numbers I would set as the bar for any product website this year.

The deploy is the part that changes how you work. Source in a repository, an automated workflow that deploys on every push to main and smoke-checks the live page, custom domain and certificate attached by the deploy itself. From that moment the loop is edit with your agent, push, live within a minute. No FTP, no forgotten image, and a rollback is a previous commit. That is the discipline professional teams use, available to one person for free.

## How do you brief a coding agent to build one? {#the-brief}

By doing the part the agent cannot do, which is deciding what the product is, what it looks like and what it should say, and then handing that over cleanly. The build itself is a static site and any frontier coding agent will produce it. Everything in the brief is context, and the quality of the site is the quality of the context you prepared.

The order that worked for me. Buy the domain and point it at your host on day one, because DNS takes hours and you do not want to wait for it on launch day. Then the design system before anything else: logo, palette, type, spacing, the visual identity from which everything derives. A couple of hours if you are detailed, a day if you are very detailed, and worth it because once it exists you are designing a brand rather than a page, and a one-pager or a social card can be derived from the same source later. Then the copy, and here the second brain from chapter two earns its keep: I asked a model connected to The Curator to write the whole site section by section, sourcing every claim from my own notes rather than from what I could remember to type. Then high-resolution screenshots on a clean state of the app, which are the single most underrated input if the product is software. Then the conversation, integrated from the start rather than added at the end, so it can be exercised inside the design preview. Then iterate in conversation, referencing sites and sections you like, until the export is a zip any coding agent can take to a repository and a host.

The constraints that produced The Curator's site, in the form you can paste into a brief: static, plain files, no server code, no database, no build step without a reason. CDN-backed host, custom domain, HTTPS with HTTP redirected. Source in git, deploy on every push to main, a smoke check of the live page afterwards. Security headers on every response, images cached long, HTML and scripts revalidated. Responsive everywhere, images in WebP with fallbacks at retina resolution. Full metadata, structured data, robots.txt, sitemap, llms.txt, a real 404. Integrated conversation grounded in the product's own documentation, with the assistant able to deep-link into the page and the page able to surface related sections after each answer. Animations that explain the product, no dependencies, all off under prefers-reduced-motion. Lighthouse in the high nineties across the board.

The recipe fits in a weekend and costs almost nothing. But the recipe is not the lesson. The lesson is the one that runs through everything on this site: agents build exactly what you want if, and only if, you give them the context to know what that is. The design system is context. The copy from a second brain is context. The screenshots, the page map, the four knowledge files behind the assistant are context, prepared in advance and handed over cleanly. In 2002 I built a product's home by hand. In 2026 I describe it and a team of agents builds it, deploys it and keeps it running. The house is the same idea. Only the builders changed.
