/**
 * Runs before `astro build` (npm lifecycle) and before `astro dev`.
 *
 * Two jobs: copy the self-hosted fonts out of node_modules into public/fonts,
 * and generate the corpus bundles. Both outputs are gitignored, because both
 * are derived from things that are committed.
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildCorpus, formatBytes } from '../src/lib/build-corpus';

const FONT_FILES: Array<[pkg: string, file: string]> = [
  ['playfair-display', 'playfair-display-latin-900-italic.woff2'],
  ['playfair-display', 'playfair-display-latin-ext-900-italic.woff2'],
  ['ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff2'],
  ['ibm-plex-sans', 'ibm-plex-sans-latin-ext-400-normal.woff2'],
  ['ibm-plex-sans', 'ibm-plex-sans-latin-400-italic.woff2'],
  ['ibm-plex-sans', 'ibm-plex-sans-latin-ext-400-italic.woff2'],
  ['ibm-plex-sans', 'ibm-plex-sans-latin-600-normal.woff2'],
  ['ibm-plex-sans', 'ibm-plex-sans-latin-ext-600-normal.woff2'],
  ['ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2'],
  ['ibm-plex-mono', 'ibm-plex-mono-latin-ext-400-normal.woff2'],
  ['ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff2'],
  ['ibm-plex-mono', 'ibm-plex-mono-latin-ext-500-normal.woff2'],
];

function copyFonts(): void {
  const target = join(process.cwd(), 'public', 'fonts');
  mkdirSync(target, { recursive: true });

  for (const [pkg, file] of FONT_FILES) {
    const source = join(process.cwd(), 'node_modules', '@fontsource', pkg, 'files', file);
    if (!existsSync(source)) {
      throw new Error(
        `Missing font file ${file}. Run npm install. @fontsource packages are ` +
          `runtime dependencies precisely so this works on a clean CI checkout.`,
      );
    }
    copyFileSync(source, join(target, file));
  }

  console.log(`[prebuild] fonts: ${FONT_FILES.length} files copied to public/fonts`);
}

async function main(): Promise<void> {
  copyFonts();

  const builtOn = new Date().toISOString().slice(0, 10);
  const manifest = await buildCorpus(builtOn);

  console.log(
    `[prebuild] corpus: ${manifest.chapterCount} chapters, ` +
      manifest.downloads.map((d) => `${d.file} ${formatBytes(d.bytes)}`).join(', '),
  );

  if (manifest.placeholderSources > 0) {
    console.warn(
      `[prebuild] WARNING: ${manifest.placeholderSources} placeholder source(s) still in ` +
        `the corpus. Replace them with real citations during the editorial pass.`,
    );
  }
}

main().catch((error) => {
  console.error('[prebuild] failed:', error);
  process.exit(1);
});
