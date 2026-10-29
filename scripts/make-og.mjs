/**
 * Regenerates public/og.png, the social card. One card for the whole site.
 *
 * Run by hand, not in CI, and commit the result:
 *
 *     npm run prebuild
 *     npm i --no-save @resvg/resvg-js fontkit
 *     node scripts/make-og.mjs
 *
 * Install both in one command: a second --no-save install prunes the first.
 * --no-save keeps them out of package.json. resvg is a native module and
 * nothing that only runs on a laptop belongs in the deploy path.
 *
 * Every letter is drawn as an outline taken from the site's own self-hosted
 * fonts, the way the talirezun.com design system draws its link previews. The
 * card used to hand resvg live text, and resvg never matched Playfair Display by
 * any name, so the masthead shipped in a fallback sans. Outlines cannot fall
 * back. fontkit reads the woff2 files directly and applies their kerning.
 *
 * Layout follows the design system's SocialKit: kicker in Plex Mono, the line
 * in Playfair Display Black Italic, a gold hairline, the tali režun_ logo
 * bottom left and the address bottom right. Colours are the Field Notes tokens.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import * as fontkit from 'fontkit';

const INK = '#100E0B';
const GOLD = '#A89372';
const GOLD_DIM = '#6B5C46';
const BONE = '#E9E4DA';
const BONE_DIM = '#9C958A';

const W = 1200;
const H = 630;
const LEFT = 72;
const RIGHT = W - 72;

const FONT_DIR = join(process.cwd(), 'public', 'fonts');

function load(name) {
  const path = join(FONT_DIR, `${name}.woff2`);
  if (!existsSync(path)) {
    console.error(`Missing ${path}. Run \`npm run prebuild\` first, it copies the fonts.`);
    process.exit(1);
  }
  return fontkit.create(readFileSync(path));
}

/** Each face is a latin subset plus a latin-ext subset. The caron lives in ext. */
const fonts = {
  display: [load('playfair-display-latin-900-italic'), load('playfair-display-latin-ext-900-italic')],
  sans: [load('ibm-plex-sans-latin-400-normal'), load('ibm-plex-sans-latin-ext-400-normal')],
  mono: [load('ibm-plex-mono-latin-400-normal'), load('ibm-plex-mono-latin-ext-400-normal')],
  monoMedium: [load('ibm-plex-mono-latin-500-normal'), load('ibm-plex-mono-latin-ext-500-normal')],
};

function pick(subsets, ch) {
  const cp = ch.codePointAt(0);
  const font = subsets.find((f) => f.hasGlyphForCodePoint(cp));
  if (!font) throw new Error(`No glyph for "${ch}". The card would be wrong.`);
  return font;
}

/** Splits a line into runs that each fit one subset, so the caron is never dropped. */
function runs(text, subsets) {
  const out = [];
  for (const ch of text) {
    const font = pick(subsets, ch);
    const last = out[out.length - 1];
    if (last && last.font === font) last.text += ch;
    else out.push({ font, text: ch });
  }
  return out;
}

/**
 * Shapes the line with the font's own kerning, then places every glyph outline.
 * Tracking is in em, added after each glyph.
 */
function shape(text, subsets, size, tracking = 0) {
  const placed = [];
  let x = 0;
  for (const run of runs(text, subsets)) {
    const s = size / run.font.unitsPerEm;
    const { glyphs, positions } = run.font.layout(run.text);
    glyphs.forEach((glyph, i) => {
      const p = positions[i];
      placed.push({ glyph, s, x: x + p.xOffset * s, y: p.yOffset * s });
      x += p.xAdvance * s + tracking * size;
    });
  }
  return { placed, width: x - tracking * size };
}

function draw(text, subsets, size, x, baseline, fill, { tracking = 0, anchor = 'start' } = {}) {
  const line = shape(text, subsets, size, tracking);
  const x0 = anchor === 'end' ? x - line.width : x;
  const d = line.placed
    .map(({ glyph, s, x: gx, y: gy }) =>
      glyph.path.scale(s, -s).translate(x0 + gx, baseline - gy).toSVG(),
    )
    .join('');
  if (d.includes('NaN')) throw new Error(`Bad outline in "${text}".`);
  return { svg: `<path d="${d}" fill="${fill}"/>`, width: line.width };
}

function wrap(text, subsets, size, max) {
  const lines = [];
  let current = '';
  for (const word of text.split(' ')) {
    const next = current ? `${current} ${word}` : word;
    if (current && shape(next, subsets, size).width > max) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  lines.push(current);
  return lines;
}

const parts = [];

// Kicker. The site's corpus headers already name the series this way.
parts.push(draw('FROM LAB TO LIFE · FIELD NOTES', fonts.mono, 22, LEFT, 90, GOLD, { tracking: 0.14 }).svg);

// The line. Playfair speaks.
parts.push(draw('Field Notes', fonts.display, 150, LEFT - 4, 268, BONE).svg);

// What it is, from SITE.description, in Plex Sans.
const sub = 'AI agents, context engineering and building production software as a non-developer.';
wrap(sub, fonts.sans, 32, 900).forEach((line, i) => {
  parts.push(draw(line, fonts.sans, 32, LEFT, 352 + i * 44, BONE_DIM).svg);
});

// The gold hairline that separates the voice from the signature.
parts.push(`<rect x="${LEFT}" y="488" width="${RIGHT - LEFT}" height="1.5" fill="${GOLD_DIM}"/>`);

// The logo: tali režun in Plex Mono Medium, cursor drawn with the same
// geometry as .tr-logo::after (0.5em wide, 0.11em tall, 0.05em gap, 0.06em drop).
const LOGO = 30;
const LOGO_BASE = 561;
const logo = draw('tali režun', fonts.monoMedium, LOGO, LEFT, LOGO_BASE, BONE);
parts.push(logo.svg);
parts.push(
  `<rect x="${(LEFT + logo.width + 0.05 * LOGO).toFixed(1)}" y="${(LOGO_BASE + 0.06 * LOGO - 0.11 * LOGO).toFixed(1)}" width="${(0.5 * LOGO).toFixed(1)}" height="${(0.11 * LOGO).toFixed(1)}" fill="${GOLD}"/>`,
);

// The address, in Plex Mono gold.
parts.push(draw('fieldnotes.talirezun.com', fonts.mono, 22, RIGHT, LOGO_BASE, GOLD, { anchor: 'end' }).svg);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${INK}"/>
${parts.join('\n')}
</svg>`;

const png = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { loadSystemFonts: false } })
  .render()
  .asPng();
writeFileSync(join(process.cwd(), 'public', 'og.png'), png);
console.log(`public/og.png  ${(png.byteLength / 1024).toFixed(1)} KB  ${W}x${H}`);
