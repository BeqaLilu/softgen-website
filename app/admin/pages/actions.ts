'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth/next';
import { db } from '@/db';
import { pages } from '@/db/schema';
import { authOptions } from '@/lib/auth';

async function requireSession() {
  const s = await getServerSession(authOptions);
  if (!s) throw new Error('unauthorized');
}

export async function savePage(slug: string, content: object): Promise<{ ok: boolean; error?: string }> {
  await requireSession();
  if (!slug) return { ok: false, error: 'slug_required' };
  await db
    .insert(pages)
    .values({ slug, content })
    .onConflictDoUpdate({ target: pages.slug, set: { content } });
  revalidatePath('/admin/pages');
  // Conservative: revalidate the matching public locale paths too.
  if (slug === 'home') {
    revalidatePath('/en');
    revalidatePath('/ka');
  } else {
    revalidatePath(`/en/${slug}`);
    revalidatePath(`/ka/${slug}`);
  }
  return { ok: true };
}
