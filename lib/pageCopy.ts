/**
 * Per-page copy resolver.
 *
 * `getPageContent(slug)` fetches the row from `pages.<slug>` (managed via
 * `/admin/pages`). The seed inserts the same shape that `content/static.ts`
 * uses for that page, so admin edits drop straight in.
 *
 * Pages call `await mergedPageCopy('home')` and pass the result to their
 * sections as the third argument to `t()` — values from the DB win,
 * untouched keys fall back to the bundled CONTENT.
 *
 * The merge is a deep merge with one rule: any object that looks like a
 * bilingual value (`{ en, ka }`) is replaced atomically — we never want
 * to merge across translations because that would orphan a half-edit.
 */

import { getPageContent } from './dbContent';

export type PageCopy = Record<string, unknown>;

export async function mergedPageCopy(slug: string): Promise<PageCopy | null> {
  const row = await getPageContent(slug);
  return row ?? null;
}

/** Helper exported for tests if we want them later. */
export function deepMergeContent<T>(base: T, overlay: unknown): T {
  if (overlay == null || typeof overlay !== 'object') return base;
  if (Array.isArray(overlay)) return overlay as unknown as T;
  if (isBilingual(overlay)) return overlay as unknown as T;

  const result: Record<string, unknown> = { ...(base as object) };
  for (const key of Object.keys(overlay as object)) {
    const o = (overlay as Record<string, unknown>)[key];
    const b = (base as unknown as Record<string, unknown>)[key];
    result[key] = deepMergeContent(b, o);
  }
  return result as unknown as T;
}

function isBilingual(v: unknown): boolean {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.en === 'string' ||
    typeof o.ka === 'string' ||
    Array.isArray(o.en) ||
    Array.isArray(o.ka)
  );
}
