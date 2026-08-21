#!/usr/bin/env node
/**
 * Rasterises public/favicon.svg into the PNG fallbacks the site ships.
 *
 * The source SVG already bakes in the --ink background field, so every
 * raster produced here is opaque without any extra compositing step. Run
 * with `node scripts/generate-favicons.mjs` after editing favicon.svg.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const svgPath = path.join(root, 'public', 'favicon.svg');
const svg = readFileSync(svgPath);

const targets = [
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 },
];

for (const { file, size } of targets) {
  const outPath = path.join(root, 'public', file);
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(outPath);
  console.log(`wrote ${file} (${size}x${size})`);
}
