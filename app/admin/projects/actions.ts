'use server';

import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth/next';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { authOptions } from '@/lib/auth';

async function requireSession() {
  const s = await getServerSession(authOptions);
  if (!s) throw new Error('unauthorized');
  return s;
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

export type ProjectInput = {
  id?: string;
  slug: string;
  title: { en: string; ka: string };
  category: string;
  year: number;
  client?: string | null;
  duration?: { en: string; ka: string } | null;
  scope?: { en: string; ka: string } | null;
  team?: string | null;
  summary?: { en: string; ka: string } | null;
  body?: { en: object; ka: object } | null;
  coverUrl?: string | null;
  accent?: string | null;
  coverStyle?: string | null;
  tags?: string[];
  featured: boolean;
  published: boolean;
  displayOrder?: number;
};

export async function saveProject(input: ProjectInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  await requireSession();

  if (!input.title?.en?.trim()) return { ok: false, error: 'title_en_required' };
  if (!input.category) return { ok: false, error: 'category_required' };
  if (!Number.isFinite(input.year)) return { ok: false, error: 'year_required' };

  const slug = (input.slug?.trim() || slugify(input.title.en));
  if (!slug) return { ok: false, error: 'slug_required' };

  const values = {
    slug,
    title: input.title,
    category: input.category,
    year: input.year,
    client: input.client ?? null,
    duration: input.duration ?? null,
    scope: input.scope ?? null,
    team: input.team ?? null,
    summary: input.summary ?? null,
    body: input.body ?? null,
    coverUrl: input.coverUrl ?? null,
    accent: input.accent ?? 'indigo',
    coverStyle: input.coverStyle ?? 'dashboard',
    tags: input.tags ?? [],
    featured: input.featured,
    published: input.published,
    displayOrder: input.displayOrder ?? 0,
    updatedAt: new Date(),
  };

  if (input.id) {
    await db.update(projects).set(values).where(eq(projects.id, input.id));
    revalidatePath('/admin/projects');
    revalidatePath(`/en/projects/${slug}`);
    revalidatePath(`/ka/projects/${slug}`);
    return { ok: true, id: input.id };
  }

  const [row] = await db.insert(projects).values(values).returning({ id: projects.id });
  revalidatePath('/admin/projects');
  revalidatePath(`/en/projects/${slug}`);
  revalidatePath(`/ka/projects/${slug}`);
  return { ok: true, id: row.id };
}

export async function deleteProject(id: string): Promise<{ ok: boolean }> {
  await requireSession();
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath('/admin/projects');
  return { ok: true };
}

export async function toggleProjectFeatured(id: string, value: boolean): Promise<{ ok: boolean }> {
  await requireSession();
  await db.update(projects).set({ featured: value, updatedAt: sql`now()` }).where(eq(projects.id, id));
  revalidatePath('/admin/projects');
  return { ok: true };
}
