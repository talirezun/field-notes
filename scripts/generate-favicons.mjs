#!/usr/bin/env node
/**
 * Rasterises public/favicon.svg into the PNG fallbacks the site ships.
 *
 * The source SVG is transparent, so the mark sits on whatever the browser tab
 * is. The alpha channel is preserved here rather than flattened onto a colour.
 *
 * iOS is the exception: it ignores transparency on a touch icon and composites
 * onto its own background, so that one is flattened onto --ink deliberately.
 * Left transparent it would land on white, and gold on white is the one place
 * this mark stops being legible.
 *
 * Run `node scripts/generate-favicons.mjs` after editing favicon.svg.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const svgPath = path.join(root, 'public', 'favicon.svg');
const svg = readFileSync(svgPath);

const INK = '#100E0B';

const targets = [
  { file: 'favicon-32x32.png', size: 32, background: null },
  { file: 'apple-touch-icon.png', size: 180, background: INK },
];

for (const { file, size, background } of targets) {
  const outPath = path.join(root, 'public', file);
  let image = sharp(svg, { density: 384 }).resize(size, size);
  if (background) image = image.flatten({ background });
  await image.png().toFile(outPath);
  console.log(`wrote ${file} (${size}x${size}) ${background ? `on ${background}` : 'transparent'}`);
}
