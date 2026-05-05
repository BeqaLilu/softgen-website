'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth/next';
import { db } from '@/db';
import { articles } from '@/db/schema';
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

export type ArticleInput = {
  id?: string;
  slug: string;
  category: string;
  title: { en: string; ka: string };
  excerpt?: { en: string; ka: string } | null;
  body?: { en: object; ka: object } | null;
  authorName?: string | null;
  readTime?: number | null;
  date?: string | null;
  coverUrl?: string | null;
  accent?: string | null;
  featured: boolean;
  published: boolean;
};

export async function saveArticle(input: ArticleInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  await requireSession();

  if (!input.title?.en?.trim()) return { ok: false, error: 'title_en_required' };
  if (!input.category) return { ok: false, error: 'category_required' };
  const slug = (input.slug?.trim() || slugify(input.title.en));
  if (!slug) return { ok: false, error: 'slug_required' };

  const values = {
    slug,
    category: input.category,
    title: input.title,
    excerpt: input.excerpt ?? null,
    body: input.body ?? null,
    authorName: input.authorName ?? null,
    readTime: input.readTime ?? null,
    date: input.date ?? null,
    coverUrl: input.coverUrl ?? null,
    accent: input.accent ?? 'indigo',
    featured: input.featured,
    published: input.published,
    updatedAt: new Date(),
  };

  if (input.id) {
    await db.update(articles).set(values).where(eq(articles.id, input.id));
  } else {
    const [row] = await db.insert(articles).values(values).returning({ id: articles.id });
    revalidatePath('/admin/news');
    revalidatePath(`/en/news/${slug}`);
    revalidatePath(`/ka/news/${slug}`);
    return { ok: true, id: row.id };
  }
  revalidatePath('/admin/news');
  revalidatePath(`/en/news/${slug}`);
  revalidatePath(`/ka/news/${slug}`);
  return { ok: true, id: input.id };
}

export async function deleteArticle(id: string): Promise<{ ok: boolean }> {
  await requireSession();
  await db.delete(articles).where(eq(articles.id, id));
  revalidatePath('/admin/news');
  return { ok: true };
}
