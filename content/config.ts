import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Field Notes content schema.
 *
 * Hard rules from the build spec (§5.3) are enforced here, not documented and
 * hoped for. A schema violation fails the build. There are no silent fallbacks.
 */

const countWords = (value: string) =>
  value.trim().split(/\s+/).filter(Boolean).length;

/** A published source. Every chapter traces back to the owner's own work. */
const source = z.object({
  title: z.string().min(3),
  url: z.url(),
  /** Where it was published. Rendered in mono next to the citation. */
  publication: z.string().optional(),
  /** Publication date, if known. */
  date: z.coerce.date().optional(),
  /**
   * Section anchors this source actually backs, e.g. ["three-phase-build"].
   * This drives the provenance rail (§8.5). Omit it when the source informs the
   * whole chapter rather than one section.
   *
   * Anchors are validated against the rendered headings at build time by
   * src/lib/chapters.ts, so a typo here fails the build too.
   */
  sections: z.array(z.string()).optional(),
  /** True while this is a stand-in for a source the editorial pass will supply. */
  placeholder: z.boolean().default(false),
});

export type Source = {
  title: string;
  url: string;
  publication?: string;
  date?: Date;
  sections?: string[];
  placeholder: boolean;
};

const chapters = defineCollection({
  loader: glob({ base: './content/chapters', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(3),
    number: z.number().int().positive(),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case'),

    /**
     * The GEO hook (§6.1). A natural question a person would actually type or
     * say. Rendered as a visible subheading under the chapter title.
     */
    question: z
      .string()
      .refine((v) => v.trim().endsWith('?'), 'question must end with a question mark')
      .refine((v) => countWords(v) >= 4, 'question must read as a real question, not a label'),

    /** 25 to 50 words. Used for meta description, the index, and JSON-LD. */
    summary: z
      .string()
      .refine(
        (v) => countWords(v) >= 25 && countWords(v) <= 50,
        'summary must be 25 to 50 words: it is the meta description, the index entry and the JSON-LD abstract',
      ),

    updated: z.coerce.date(),
    sources: z.array(source).min(1, 'every chapter must cite at least one published source'),
    related: z.array(z.string()).default([]),
    tags: z.array(z.string()).min(1),

    /**
     * Anchors that used to point at a section on this page and must keep
     * working. Anchors are a permanent contract: retitle freely, never rename.
     * Format: { from: "old-anchor", to: "current-anchor" }
     */
    anchorAliases: z
      .array(z.object({ from: z.string(), to: z.string() }))
      .default([]),

    /** Editorial state. A scaffold chapter renders a visible notice. */
    status: z.enum(['scaffold', 'published']).default('published'),

    /** Set true to keep a chapter out of the build while it is being written. */
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ base: './content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(3),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().min(40).max(240),
    updated: z.coerce.date(),
    /** Order in the header nav. Omit to keep the page out of the nav. */
    navOrder: z.number().int().optional(),
  }),
});

export const collections = { chapters, pages };
