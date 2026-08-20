/**
 * Generates the download bundles into public/downloads/, plus /llms.txt.
 *
 * These are derived artefacts. They are gitignored and rebuilt on every deploy,
 * so a chapter edit updates the corpus with no extra step. That is the whole
 * point of the update loop: edit markdown, push, done.
 */
import { mkdirSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import JSZip from 'jszip';
import {
  loadChapterFiles,
  renderChapterMarkdown,
  renderCompleteCorpus,
  renderLlmsTxt,
  type ChapterFile,
} from './corpus';

const PUBLIC_DIR = join(process.cwd(), 'public');
const DOWNLOADS_DIR = join(PUBLIC_DIR, 'downloads');
const GENERATED_DIR = join(process.cwd(), 'src', 'generated');

export type DownloadEntry = {
  file: string;
  href: string;
  label: string;
  description: string;
  bytes: number;
  size: string;
};

export type CorpusManifest = {
  builtOn: string;
  chapterCount: number;
  placeholderSources: number;
  downloads: DownloadEntry[];
  chapters: Array<{ slug: string; title: string; bytes: number; size: string }>;
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function write(path: string, contents: string | Uint8Array): number {
  writeFileSync(path, contents);
  return statSync(path).size;
}

export async function buildCorpus(builtOn: string): Promise<CorpusManifest> {
  const chapters: ChapterFile[] = loadChapterFiles();
  if (chapters.length === 0) {
    throw new Error('No chapters found in content/chapters. Refusing to build an empty corpus.');
  }

  rmSync(DOWNLOADS_DIR, { recursive: true, force: true });
  mkdirSync(DOWNLOADS_DIR, { recursive: true });
  mkdirSync(GENERATED_DIR, { recursive: true });

  // 1. One markdown file per chapter.
  const zip = new JSZip();
  const perChapter = chapters.map((chapter) => {
    const markdown = renderChapterMarkdown(chapter, builtOn);
    // A fixed timestamp keeps the archive byte-stable between builds.
    zip.file(`field-notes/${chapter.file}`, markdown, {
      date: new Date(`${builtOn}T00:00:00Z`),
    });
    const bytes = write(join(DOWNLOADS_DIR, `${chapter.slug}.md`), markdown);
    return { slug: chapter.slug, title: chapter.title, bytes, size: formatBytes(bytes) };
  });

  // 2. The whole corpus in one file.
  const completeBytes = write(
    join(DOWNLOADS_DIR, 'field-notes-complete.md'),
    renderCompleteCorpus(chapters, builtOn),
  );

  // 3. The zip, better for per-document ingestion.
  const zipBuffer = await zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
  });
  const zipBytes = write(join(DOWNLOADS_DIR, 'field-notes-chapters.zip'), zipBuffer);

  // 4. llms.txt at the site root.
  write(join(PUBLIC_DIR, 'llms.txt'), renderLlmsTxt(chapters));

  const downloads: DownloadEntry[] = [
    {
      file: 'field-notes-complete.md',
      href: '/downloads/field-notes-complete.md',
      label: 'Complete corpus, one markdown file',
      description:
        'Every chapter in order, with a provenance header. Best for reading, or for pasting into a model with a long context window.',
      bytes: completeBytes,
      size: formatBytes(completeBytes),
    },
    {
      file: 'field-notes-chapters.zip',
      href: '/downloads/field-notes-chapters.zip',
      label: 'Chapters as separate files, zipped',
      description:
        'One markdown file per chapter, frontmatter intact. This is the one to use for ingestion, because each chapter becomes its own document.',
      bytes: zipBytes,
      size: formatBytes(zipBytes),
    },
  ];

  const manifest: CorpusManifest = {
    builtOn,
    chapterCount: chapters.length,
    placeholderSources: chapters.reduce((total, c) => total + c.placeholderSources, 0),
    downloads,
    chapters: perChapter,
  };

  write(join(DOWNLOADS_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  write(join(GENERATED_DIR, 'corpus-manifest.json'), JSON.stringify(manifest, null, 2));

  return manifest;
}
