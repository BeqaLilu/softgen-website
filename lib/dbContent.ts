/**
 * Server-side content reader for the public site.
 *
 * Each function reads from Postgres and shapes the row(s) into the same
 * type the public components already consume from `content/static.ts`.
 * That keeps page components untouched as we swap the data source.
 *
 * Cached with `unstable_cache` so a busy public page is one query per
 * route, not one per request. Admin server actions invalidate via
 * `revalidatePath` after writes (already wired into the existing actions).
 *
 * If the database is unreachable, every function falls back to the
 * bundled `CONTENT` blob — keeps `pnpm dev` and `pnpm build` working
 * before / during DB provisioning.
 */

import { unstable_cache as cache } from 'next/cache';
import { sql, eq } from 'drizzle-orm';
import { db } from '@/db';
import {
  projects as projectsTable,
  articles as articlesTable,
  services as servicesTable,
  jobs as jobsTable,
  teamMembers,
  partners as partnersTable,
  pages as pagesTable,
} from '@/db/schema';
import {
  CONTENT,
  type Bi,
  type Article,
  type Project,
  type Job,
  type BodyBlock,
} from '@/content/static';

const IS_PRODUCTION_BUILD = process.env.NEXT_PHASE === 'phase-production-build';
const QUERY_DB_DURING_BUILD = process.env.SOFTGEN_QUERY_DB_DURING_BUILD === '1';

/** Try a DB query; on any failure return the static fallback. */
async function safe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  if (IS_PRODUCTION_BUILD && !QUERY_DB_DURING_BUILD) {
    return fallback;
  }

  try {
    return await fn();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[dbContent:${label}] DB unavailable, using static fallback`, err instanceof Error ? err.message : err);
    return fallback;
  }
}

/* ─────────────────────────── Projects ─────────────────────────── */

export const getProjects = cache(
  async (): Promise<Project[]> =>
    safe(
      'projects',
      async () => {
        const rows = await db
          .select({
            slug: projectsTable.slug,
            title: projectsTable.title,
            category: projectsTable.category,
            year: projectsTable.year,
            coverUrl: projectsTable.coverUrl,
            accent: projectsTable.accent,
            coverStyle: projectsTable.coverStyle,
          })
          .from(projectsTable)
          .where(eq(projectsTable.published, true))
          .orderBy(sql`${projectsTable.displayOrder} asc, ${projectsTable.year} desc`);
        return rows.map((r) => ({
          slug: r.slug,
          title: r.title as Bi,
          category: catBi(r.category),
          year: String(r.year),
          coverUrl: r.coverUrl,
          accent: (r.accent as Project['accent']) ?? 'indigo',
          coverStyle: (r.coverStyle as Project['coverStyle']) ?? 'dashboard',
        }));
      },
      [...CONTENT.projectsTeaser.items]
    ),
  ['projects-list'],
  { revalidate: 60, tags: ['projects'] }
);

export const getProjectDetail = cache(
  async (slug: string) =>
    safe(
      `project:${slug}`,
      async () => {
        const [r] = await db
          .select()
          .from(projectsTable)
          .where(eq(projectsTable.slug, slug))
          .limit(1);
        if (!r) return null;
        return {
          slug: r.slug,
          title: r.title as Bi,
          category: catBi(r.category),
          year: String(r.year),
          coverUrl: r.coverUrl,
          accent: (r.accent as Project['accent']) ?? 'indigo',
          coverStyle: (r.coverStyle as Project['coverStyle']) ?? 'dashboard',
          client: r.client,
          duration: (r.duration as Bi | null) ?? { en: '', ka: '' },
          scope: (r.scope as Bi | null) ?? { en: '', ka: '' },
          team: r.team,
          summary: (r.summary as Bi | null) ?? { en: '', ka: '' },
          tags: (r.tags as string[] | null) ?? [],
          body: r.body as { en?: BodyBlock[] | object; ka?: BodyBlock[] | object } | null,
        };
      },
      mapStaticProjectDetail(slug)
    ),
  ['project-detail'],
  { revalidate: 60, tags: ['projects'] }
);

/* ─────────────────────────── Articles ─────────────────────────── */

export const getArticles = cache(
  async (): Promise<Article[]> =>
    safe(
      'articles',
      async () => {
        const rows = await db
          .select({
            slug: articlesTable.slug,
            category: articlesTable.category,
            title: articlesTable.title,
            excerpt: articlesTable.excerpt,
            authorName: articlesTable.authorName,
            readTime: articlesTable.readTime,
            date: articlesTable.date,
            accent: articlesTable.accent,
            featured: articlesTable.featured,
          })
          .from(articlesTable)
          .where(eq(articlesTable.published, true))
          .orderBy(sql`${articlesTable.date} desc nulls last`);
        return rows.map((r) => ({
          slug: r.slug,
          category: r.category as Article['category'],
          title: r.title as Bi,
          excerpt: (r.excerpt as Bi | null) ?? { en: '', ka: '' },
          author: r.authorName ?? '',
          readTime: r.readTime ?? 1,
          date: r.date ?? new Date().toISOString().slice(0, 10),
          accent: (r.accent as Article['accent']) ?? 'indigo',
          featured: r.featured,
        }));
      },
      [...CONTENT.news.articles]
    ),
  ['articles-list'],
  { revalidate: 60, tags: ['articles'] }
);

export const getArticleDetail = cache(
  async (slug: string) =>
    safe(
      `article:${slug}`,
      async () => {
        const [r] = await db
          .select()
          .from(articlesTable)
          .where(eq(articlesTable.slug, slug))
          .limit(1);
        if (!r) return null;
        return {
          slug: r.slug,
          category: r.category,
          title: r.title as Bi,
          excerpt: (r.excerpt as Bi | null) ?? { en: '', ka: '' },
          author: r.authorName ?? '',
          readTime: r.readTime ?? 1,
          date: r.date ?? '',
          accent: (r.accent as Article['accent']) ?? 'indigo',
          body: r.body as { en?: BodyBlock[] | object; ka?: BodyBlock[] | object } | null,
        };
      },
      mapStaticArticle(slug)
    ),
  ['article-detail'],
  { revalidate: 60, tags: ['articles'] }
);

/* ─────────────────────────── Services ─────────────────────────── */

export type ServiceItem = {
  slug: string;
  num: string;
  title: Bi;
  body: Bi;
  tagline: Bi;
  capabilities: Bi[];
  related: string[];
};

export const getServices = cache(
  async (): Promise<ServiceItem[]> =>
    safe(
      'services',
      async () => {
        const rows = await db
          .select()
          .from(servicesTable)
          .orderBy(sql`${servicesTable.displayOrder} asc`);
        return rows.map((r) => ({
          slug: r.slug,
          num: r.num,
          title: r.title as Bi,
          body: (r.body as Bi | null) ?? { en: '', ka: '' },
          tagline: (r.tagline as Bi | null) ?? { en: '', ka: '' },
          capabilities: (r.capabilities as Bi[] | null) ?? [],
          related: (r.related as string[] | null) ?? [],
        }));
      },
      CONTENT.services.items.map((it) => {
        const detail = CONTENT.servicesPage.detail[it.slug];
        return {
          slug: it.slug,
          num: it.num,
          title: it.title,
          body: it.body,
          tagline: detail.tagline,
          capabilities: detail.capabilities,
          related: detail.related,
        };
      })
    ),
  ['services-list'],
  { revalidate: 60, tags: ['services'] }
);

export async function getServiceDetail(slug: string): Promise<ServiceItem | null> {
  const all = await getServices();
  return all.find((s) => s.slug === slug) ?? null;
}

/* ─────────────────────────── Jobs ─────────────────────────── */

export const getJobs = cache(
  async (): Promise<Job[]> =>
    safe(
      'jobs',
      async () => {
        const rows = await db
          .select()
          .from(jobsTable)
          .where(eq(jobsTable.open, true))
          .orderBy(sql`${jobsTable.createdAt} desc`);
        return rows.map((r) => ({
          slug: r.slug,
          title: r.title as Bi,
          department: r.department as Job['department'],
          type: r.type as Job['type'],
          location: r.location ?? '',
          description: (r.description as Bi | null) ?? { en: '', ka: '' },
        }));
      },
      [...CONTENT.careers.jobs]
    ),
  ['jobs-list'],
  { revalidate: 60, tags: ['jobs'] }
);

export async function getJob(slug: string): Promise<Job | null> {
  const all = await getJobs();
  return all.find((j) => j.slug === slug) ?? null;
}

/* ─────────────────────────── Team ─────────────────────────── */

export type TeamMember = {
  name: string;
  role: Bi;
  since: number;
};

export const getTeam = cache(
  async (): Promise<TeamMember[]> =>
    safe(
      'team',
      async () => {
        const rows = await db
          .select()
          .from(teamMembers)
          .where(eq(teamMembers.visible, true))
          .orderBy(sql`${teamMembers.displayOrder} asc`);
        return rows.map((r) => ({
          name: r.name,
          role: r.role as Bi,
          since: r.since ?? 0,
        }));
      },
      CONTENT.about.team.map((m) => ({ name: m.name, role: m.role, since: parseInt(m.since, 10) }))
    ),
  ['team-list'],
  { revalidate: 60, tags: ['team'] }
);

/* ─────────────────────────── Partners ─────────────────────────── */

export const getPartners = cache(
  async (): Promise<string[]> =>
    safe(
      'partners',
      async () => {
        const rows = await db
          .select({ name: partnersTable.name })
          .from(partnersTable)
          .orderBy(sql`${partnersTable.displayOrder} asc`);
        return rows.map((r) => r.name);
      },
      [...CONTENT.partners.logos]
    ),
  ['partners-list'],
  { revalidate: 60, tags: ['partners'] }
);

/* ─────────────────────────── Pages (static copy) ─────────────────────────── */

export const getPageContent = cache(
  async (slug: string): Promise<Record<string, unknown> | null> =>
    safe(
      `page:${slug}`,
      async () => {
        const [r] = await db
          .select()
          .from(pagesTable)
          .where(eq(pagesTable.slug, slug))
          .limit(1);
        return (r?.content as Record<string, unknown> | null) ?? null;
      },
      null
    ),
  ['page-content'],
  { revalidate: 60, tags: ['pages'] }
);

/* ─────────────────────────── Helpers ─────────────────────────── */

const CATEGORY_BI: Record<string, Bi> = {
  FinTech:    { en: 'FinTech',    ka: 'ფინტექი' },
  Government: { en: 'Government', ka: 'სახელმწიფო' },
  Security:   { en: 'Security',   ka: 'უსაფრთხოება' },
  Enterprise: { en: 'Enterprise', ka: 'საწარმოო' },
};

function catBi(c: string): Bi {
  return CATEGORY_BI[c] ?? { en: c, ka: c };
}

function mapStaticProjectDetail(slug: string) {
  const item = CONTENT.projectsTeaser.items.find((p) => p.slug === slug);
  if (!item) return null;
  const d = CONTENT.projectsPage.detail[slug];
  return {
    slug: item.slug,
    title: item.title,
    category: item.category,
    year: item.year,
    coverUrl: item.coverUrl ?? null,
    accent: item.accent,
    coverStyle: item.coverStyle ?? 'dashboard',
    client: d?.client ?? null,
    duration: d?.duration ?? { en: '', ka: '' },
    scope: d?.scope ?? { en: '', ka: '' },
    team: d?.team ?? null,
    summary: d?.summary ?? { en: '', ka: '' },
    tags: d?.tags ?? [],
    body: d?.body ? { en: d.body.en, ka: d.body.en } : null,
  };
}

function mapStaticArticle(slug: string) {
  const a = CONTENT.news.articles.find((x) => x.slug === slug);
  if (!a) return null;
  const body = CONTENT.news.bodies[slug] ?? null;
  return {
    slug: a.slug,
    category: a.category,
    title: a.title,
    excerpt: a.excerpt,
    author: a.author,
    readTime: a.readTime,
    date: a.date,
    accent: a.accent,
    body,
  };
}
