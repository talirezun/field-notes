/** Single source of truth for identity, links and licensing. */

export const SITE_URL = 'https://fieldnotes.talirezun.com';

export const SITE = {
  name: 'Field Notes',
  /** The existing brand line for "From Lab to Life". Not a new brand. */
  tagline: 'Field notes from real builds, not vendor marketing.',
  description:
    'Distilled practice notes on AI agents, context engineering, and building production software as a non-developer. Sourced from published articles and production build logs.',
  url: SITE_URL,
  locale: 'en',
} as const;

export const AUTHOR = {
  name: 'Dr. Tali Režun',
  /** Plain-ASCII form, for places that mangle the caron. */
  asciiName: 'Dr. Tali Rezun',
  jobTitle: 'AI advisor, lecturer and builder',
  affiliation: 'COTRUGLI Business School',
  homepage: 'https://talirezun.com',
  /** sameAs for the JSON-LD Person. Retrieval trust depends on these. */
  sameAs: [
    'https://talirezun.com',
    'https://x.com/talirezun',
    'https://www.linkedin.com/in/talirezun/',
    'https://talirezun.substack.com',
    'https://medium.com/@talirezun',
    'https://github.com/talirezun',
    'https://www.researchgate.net/profile/Tali-Rezun',
  ],
} as const;

export type SocialLink = {
  label: string;
  href: string;
  /** Key into src/components/SocialIcon.astro */
  icon: 'x' | 'linkedin' | 'substack' | 'medium' | 'github';
};

export const SOCIALS: SocialLink[] = [
  { label: 'X', href: 'https://x.com/talirezun', icon: 'x' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/talirezun/', icon: 'linkedin' },
  { label: 'Substack', href: 'https://talirezun.substack.com', icon: 'substack' },
  { label: 'Medium', href: 'https://medium.com/@talirezun', icon: 'medium' },
  { label: 'GitHub', href: 'https://github.com/talirezun', icon: 'github' },
];

export const LINKS = {
  curatorRepo: 'https://github.com/talirezun/the-curator',
  curatorManualSetup:
    'https://github.com/talirezun/the-curator#option-b--manual-setup-windows--linux--mac',
  curatorAgentInstall: 'https://github.com/talirezun/the-curator/blob/main/USER-GUIDE.md',
  /** Core domain only. Never link app.luminawidget.xyz. */
  lumina: 'https://luminawidget.xyz',
  personalSite: 'https://talirezun.com',
  repo: 'https://github.com/talirezun/field-notes',
  corrections: 'https://github.com/talirezun/field-notes/blob/main/CONTRIBUTING.md',
} as const;

export const LICENSES = {
  content: { name: 'CC BY 4.0', href: 'https://creativecommons.org/licenses/by/4.0/' },
  code: { name: 'MIT', href: 'https://github.com/talirezun/field-notes/blob/main/LICENSE-CODE' },
} as const;

/**
 * Cloudflare Web Analytics site token.
 *
 * Not a secret. The beacon only works by putting it in the page source, where
 * every visitor can read it, so hiding it in a build variable would buy nothing
 * and cost a setting nobody remembers is there. It lives here, versioned with
 * everything else. PUBLIC_CF_BEACON_TOKEN still overrides it if a build ever
 * needs to report somewhere else.
 *
 * No cookies, so no consent banner. That is why this and not Google Analytics.
 */
export const CF_BEACON_TOKEN = '42cdeabdcd2c4dd9b340a69c93864ce8';

/** ISO date, formatted the one way the whole site formats dates. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
