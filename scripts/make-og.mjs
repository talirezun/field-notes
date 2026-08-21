/**
 * Regenerates public/og.png, the social card.
 *
 * Run by hand, not in CI. See the comment at the top of src/lib/og-image.ts for
 * why, and for the install line. public/og.png is committed.
 *
 *     npm i -D @resvg/resvg-js wawoff2
 *     npx tsx scripts/make-og.mjs
 *     npm rm @resvg/resvg-js wawoff2
 *
 * wawoff2 is there because resvg's font database reads TTF and OTF but not
 * woff2, and @fontsource ships woff2 only. Hand it a woff2 and it does not
 * error, it just quietly renders in a fallback face, which is how this went
 * wrong twice before it went right.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { decompress } from 'wawoff2';

const FONT_DIR = join(process.cwd(), 'public', 'fonts');
const FACES = [
  'playfair-display-latin-900-italic.woff2',
  'playfair-display-latin-ext-900-italic.woff2',
  'ibm-plex-sans-latin-400-normal.woff2',
  'ibm-plex-sans-latin-ext-400-normal.woff2',
  'ibm-plex-mono-latin-400-normal.woff2',
  'ibm-plex-mono-latin-ext-400-normal.woff2',
];

if (!existsSync(join(FONT_DIR, FACES[0]))) {
  console.error('Fonts are missing. Run `npm run prebuild` first, it copies them into public/fonts.');
  process.exit(1);
}

// tsx is a dependency, so the TypeScript module can be imported directly.
const { ogSvg } = await import('../src/lib/og-image.ts');

const fontBuffers = await Promise.all(
  FACES.map(async (f) => Buffer.from(await decompress(readFileSync(join(FONT_DIR, f))))),
);

const resvg = new Resvg(ogSvg(), {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    fontBuffers,
    // Nothing should ever fall back. If a glyph is missing, the card is wrong
    // and it should look wrong here rather than quietly on someone's timeline.
    loadSystemFonts: false,
    defaultFontFamily: 'IBM Plex Sans',
  },
});

const png = resvg.render().asPng();
const target = join(process.cwd(), 'public', 'og.png');
writeFileSync(target, png);
console.log(`public/og.png  ${(png.byteLength / 1024).toFixed(1)} KB  1200x630`);
