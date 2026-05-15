/**
 * Runtime accessor for `pages.settings` (the JSON blob saved by /admin/settings).
 *
 * - Cached server-side via `unstable_cache` so we don't query the DB per request.
 * - Falls back to `DEFAULT_SETTINGS` if the DB is unreachable, so neither
 *   `next build` nor `pnpm dev` blow up before provisioning.
 *
 * Used by:
 *   - `lib/seo.ts`            for default title/description/OG image
 *   - `app/api/leads/route`   for sales notify-to address
 *   - `app/api/applications/route` for careers notify-to + From header
 */

import { unstable_cache as cache } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { pages } from '@/db/schema';
import { DEFAULT_SETTINGS, type SiteSettings } from '@/app/admin/settings/schema';

const IS_PRODUCTION_BUILD = process.env.NEXT_PHASE === 'phase-production-build';
const QUERY_DB_DURING_BUILD = process.env.SOFTGEN_QUERY_DB_DURING_BUILD === '1';

export const getSettings = cache(
  async (): Promise<SiteSettings> => {
    if (IS_PRODUCTION_BUILD && !QUERY_DB_DURING_BUILD) {
      return DEFAULT_SETTINGS;
    }

    try {
      const [row] = await db
        .select({ content: pages.content })
        .from(pages)
        .where(eq(pages.slug, 'settings'))
        .limit(1);
      if (!row) return DEFAULT_SETTINGS;
      // Shallow merge: overrides only the keys the admin saved.
      const stored = row.content as Partial<SiteSettings>;
      return {
        general: { ...DEFAULT_SETTINGS.general, ...stored.general },
        seo: { ...DEFAULT_SETTINGS.seo, ...stored.seo },
        integrations: { ...DEFAULT_SETTINGS.integrations, ...stored.integrations },
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },
  ['site-settings'],
  { revalidate: 60, tags: ['settings'] }
);
