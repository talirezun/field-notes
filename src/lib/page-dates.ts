/**
 * Resolves the "Updated" date shown on a standalone page (content/pages/*.md).
 *
 * Unlike chapters, these pages carry no editorial `updated` discipline: the
 * PLAYBOOK.md bump-on-publish rule is a chapter thing. So the frontmatter
 * `updated` field on a page goes stale the moment the file is edited without
 * anyone remembering to touch it by hand, which is exactly the bug this file
 * fixes: derive the date from the file's own git history instead.
 *
 * The one thing this cannot tolerate is a wrong answer shipped silently. A
 * shallow clone (Cloudflare's build environment may hand us one) returns the
 * single commit it has for every file when asked for that file's history, so
 * every page would get the same date: a different wrong answer, not a fix.
 * `git` may also be entirely absent. Both cases are detected up front, and
 * when detected, every page falls back to its frontmatter `updated` value,
 * which is why that field stays in the schema rather than being removed.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import matter from 'gray-matter';

export const PAGES_DIR = join(process.cwd(), 'content', 'pages');

export type PageDateSource = 'git' | 'frontmatter';

export type PageDateEntry = {
  date: string;
  source: PageDateSource;
};

export type PageDatesResult = {
  dates: Record<string, PageDateEntry>;
  /** Human-readable lines, one per page, for the prebuild log. */
  log: string[];
  /** Set when git history was not trusted for any page, with the reason. */
  gitDisabledReason: string | null;
};

function git(args: string[], cwd: string): string | null {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

/**
 * True only when git is present, the working directory is a git work tree,
 * and that work tree has full history. Any doubt returns false, because the
 * fallback (a stale-but-honest frontmatter date) is safer than a wrong one.
 */
function gitHistoryIsTrustworthy(cwd: string): { ok: boolean; reason: string | null } {
  if (git(['--version'], cwd) === null) {
    return { ok: false, reason: 'git is not available on PATH' };
  }
  if (git(['rev-parse', '--is-inside-work-tree'], cwd) !== 'true') {
    return { ok: false, reason: 'not running inside a git work tree' };
  }
  if (git(['rev-parse', '--is-shallow-repository'], cwd) !== 'false') {
    return {
      ok: false,
      reason:
        'repository is a shallow clone: `git log -1 -- <file>` would return the same ' +
        'single commit for every file instead of each file\'s real last-touched date',
    };
  }
  return { ok: true, reason: null };
}

/** The commit date (author-independent, committer date) of the last commit touching this file, or null if git has no history for it (e.g. a new, uncommitted file). */
function lastCommitDate(filePath: string, cwd: string): string | null {
  const out = git(['log', '-1', '--format=%cI', '--', filePath], cwd);
  return out ? out : null;
}

/**
 * Builds the slug -> date map for every page in content/pages. `cwd` is the
 * repo root to run git in; it is a parameter (rather than always
 * process.cwd()) so the fallback path can be exercised in tests against a
 * directory with no git history.
 */
export function resolvePageDates(cwd: string = process.cwd()): PageDatesResult {
  const pagesDir = join(cwd, 'content', 'pages');
  const files = readdirSync(pagesDir).filter((name) => name.endsWith('.md'));

  const { ok: gitOk, reason } = gitHistoryIsTrustworthy(cwd);

  const dates: Record<string, PageDateEntry> = {};
  const log: string[] = [];

  for (const file of files) {
    const absPath = join(pagesDir, file);
    const raw = readFileSync(absPath, 'utf8');
    const parsed = matter(raw);
    const data = parsed.data as Record<string, unknown>;
    const slug = String(data.slug ?? file.replace(/\.md$/, ''));
    const frontmatterUpdated = data.updated;
    const frontmatterIso =
      frontmatterUpdated instanceof Date
        ? frontmatterUpdated.toISOString()
        : new Date(String(frontmatterUpdated)).toISOString();

    let entry: PageDateEntry;

    if (gitOk) {
      const relPath = relative(cwd, absPath);
      const commitDate = lastCommitDate(relPath, cwd);
      if (commitDate) {
        entry = { date: commitDate, source: 'git' };
      } else {
        // Tracked-repo case, but this particular file has no commits yet
        // (freshly added, not committed). Frontmatter is the only date we have.
        entry = { date: frontmatterIso, source: 'frontmatter' };
      }
    } else {
      entry = { date: frontmatterIso, source: 'frontmatter' };
    }

    dates[slug] = entry;
    log.push(`${slug} -> ${entry.source} ${entry.date}`);
  }

  return { dates, log, gitDisabledReason: gitOk ? null : reason };
}
