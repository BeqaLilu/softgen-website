'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth/next';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { authOptions } from '@/lib/auth';

async function requireSession() {
  const s = await getServerSession(authOptions);
  if (!s) throw new Error('unauthorized');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80);
}

export type JobInput = {
  id?: string;
  slug: string;
  title: { en: string; ka: string };
  department: string;
  type: string;
  location: string;
  description?: { en: string; ka: string } | null;
  body?: { en: object; ka: object } | null;
  open: boolean;
};

export async function saveJob(input: JobInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  await requireSession();
  if (!input.title?.en?.trim()) return { ok: false, error: 'title_en_required' };
  const slug = (input.slug?.trim() || slugify(input.title.en));
  if (!slug) return { ok: false, error: 'slug_required' };

  const values = {
    slug,
    title: input.title,
    department: input.department,
    type: input.type,
    location: input.location,
    description: input.description ?? null,
    body: input.body ?? null,
    open: input.open,
  };

  if (input.id) {
    await db.update(jobs).set(values).where(eq(jobs.id, input.id));
  } else {
    const [row] = await db.insert(jobs).values(values).returning({ id: jobs.id });
    revalidatePath('/admin/jobs');
    revalidatePath('/en/careers');
    revalidatePath('/ka/careers');
    return { ok: true, id: row.id };
  }
  revalidatePath('/admin/jobs');
  revalidatePath(`/en/careers/${slug}`);
  revalidatePath(`/ka/careers/${slug}`);
  return { ok: true, id: input.id };
}

export async function deleteJob(id: string): Promise<{ ok: boolean }> {
  await requireSession();
  await db.delete(jobs).where(eq(jobs.id, id));
  revalidatePath('/admin/jobs');
  return { ok: true };
}
