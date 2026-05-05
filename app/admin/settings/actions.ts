'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth/next';
import { db } from '@/db';
import { pages } from '@/db/schema';
import { authOptions } from '@/lib/auth';
import { DEFAULT_SETTINGS, type SiteSettings } from './schema';

const SLUG = 'settings';

async function requireAdmin() {
  const s = await getServerSession(authOptions);
  if (!s) throw new Error('unauthorized');
  if (s.user.role !== 'admin') throw new Error('forbidden');
}

export async function loadSettings(): Promise<SiteSettings> {
  try {
    const [row] = await db.select().from(pages).where(eq(pages.slug, SLUG));
    if (!row) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(row.content as Partial<SiteSettings>) } as SiteSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: SiteSettings): Promise<{ ok: boolean }> {
  await requireAdmin();
  await db
    .insert(pages)
    .values({ slug: SLUG, content: settings })
    .onConflictDoUpdate({ target: pages.slug, set: { content: settings } });
  revalidatePath('/admin/settings');
  return { ok: true };
}
