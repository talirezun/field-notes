/**
 * The social card, generated at build time.
 *
 * A link to this site pasted into Slack, LinkedIn or a chat window is one of
 * the main ways anyone arrives here, and without an og:image every one of those
 * renders as a blank grey rectangle. One card for the whole site rather than one
 * per chapter: the site has a single identity and a per-page card would be nine
 * near-identical images to keep in sync.
 *
 * Drawn as SVG and rasterised with resvg, which takes real font buffers.
 *
 * Not generated at build time, and that is deliberate. sharp's rasteriser
 * (librsvg) silently ignores @font-face entirely, so a card built there renders
 * in whatever system fonts the build machine happens to have. It looked right on
 * a Mac and would have looked like something else on Cloudflare's Linux builder.
 * A brand asset that changes depending on where it was built is worse than no
 * brand asset, so this runs by hand and public/og.png is committed.
 *
 * To regenerate after changing the design:
 *
 *     npm i -D @resvg/resvg-js && node scripts/make-og.mjs && npm rm @resvg/resvg-js
 *
 * resvg is deliberately not a permanent dependency: it is a native module, and
 * nothing that only ever runs on a laptop belongs in the deploy path.
 */

const INK = '#100E0B';
const INK_LINE = '#2C2721';
const GOLD = '#A89372';
const GOLD_DIM = '#6B5C46';
const BONE = '#E9E4DA';
const BONE_DIM = '#9C958A';

/**
 * Faces are named by their real internal family name, and there is no
 * @font-face here on purpose: resvg resolves font-family against the buffers
 * scripts/make-og.mjs hands it, and ignores @font-face src entirely. Rename a
 * family here and the text silently falls back to a system font, which is
 * exactly the bug this file already had once.
 */
export function ogSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      /* Known limitation: the wordmark is set in Plex, not in the Playfair
         display face the site uses. resvg will not match that face by any of
         its names ("Playfair Display", "Playfair Display Black", with or
         without style and weight), and with loadSystemFonts off it falls back
         to defaultFontFamily. Deterministic and on-brand, just not the serif.
         Worth another look if the card is ever redesigned. */
      .wordmark { font-family: 'IBM Plex Sans'; font-size: 116px; fill: ${BONE}; }
      .tagline  { font-family: 'IBM Plex Mono'; font-size: 27px; fill: ${GOLD}; letter-spacing: 0.02em; }
      .byline   { font-family: 'IBM Plex Mono'; font-size: 22px; fill: ${BONE_DIM}; letter-spacing: 0.14em; }
      .sub      { font-family: 'IBM Plex Sans'; font-size: 25px; fill: ${BONE_DIM}; }
      .rail     { font-family: 'IBM Plex Mono'; font-size: 17px; fill: ${GOLD_DIM}; letter-spacing: 0.06em; }
    </style>
  </defs>

  <rect width="1200" height="630" fill="${INK}"/>

  <!-- The provenance rail, which is the site's signature, reduced to its bones. -->
  <line x1="196" y1="0" x2="196" y2="630" stroke="${INK_LINE}" stroke-width="1"/>
  <text class="rail" x="164" y="242" text-anchor="end">SOURCES</text>
  <line x1="96" y1="266" x2="164" y2="266" stroke="${GOLD_DIM}" stroke-width="1"/>
  <line x1="118" y1="298" x2="164" y2="298" stroke="${GOLD_DIM}" stroke-width="1"/>
  <line x1="86"  y1="330" x2="164" y2="330" stroke="${GOLD_DIM}" stroke-width="1"/>

  <text class="byline" x="252" y="150">DR. TALI RE&#381;UN</text>
  <text class="wordmark" x="248" y="290">Field Notes</text>

  <line x1="252" y1="356" x2="1104" y2="356" stroke="${GOLD_DIM}" stroke-width="1"/>
  <text class="tagline" x="252" y="410">Field notes from real builds, not vendor marketing.</text>

  <text class="sub" x="252" y="474">Nine chapters on AI agents, context engineering and</text>
  <text class="sub" x="252" y="510">building production software as a non-developer.</text>

  <text class="rail" x="252" y="574">FIELDNOTES.TALIREZUN.COM</text>
  <text class="rail" x="1104" y="574" text-anchor="end">CC BY 4.0</text>
</svg>`;
}
