/**
 * Explicit heading anchors, for the Sätteri markdown pipeline.
 *
 * Astro slugifies heading text into an id. That is fine until a heading gets
 * retitled, at which point every link into it breaks. Anchors on this site are
 * a permanent contract, so a heading may pin its own id:
 *
 *     ## How do you structure the first phase of a build? {#three-phase-build}
 *
 * Section ids are read back out of the rendered HTML everywhere else in the
 * build, so whatever this sets is what the rest of the site uses.
 */
import { defineHastPlugin } from 'satteri';

const PINNED = /\s*\{#([a-z0-9]+(?:-[a-z0-9]+)*)\}\s*$/;

export default defineHastPlugin({
  name: 'field-notes-anchor-ids',
  element: {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    visit(node, ctx) {
      const match = ctx.textContent(node).match(PINNED);
      if (!match) return;

      const children = node.children ?? [];
      const last = children[children.length - 1];
      if (!last || last.type !== 'text') return;

      ctx.replaceNode(last, { type: 'text', value: last.value.replace(PINNED, '') });
      ctx.setProperty(node, 'id', match[1]);
    },
  },
});
