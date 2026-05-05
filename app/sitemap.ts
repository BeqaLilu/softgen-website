import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import {
  getProjects,
  getArticles,
  getServices,
  getJobs,
} from '@/lib/dbContent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://softgen.ge';

const STATIC_PATHS = ['', '/about', '/services', '/projects', '/news', '/careers', '/contact'];

/**
 * Sitemap from the DB (with `content/static.ts` fallback inside dbContent
 * if the DB is unreachable). Only published rows are returned by the DB
 * readers, so drafts never leak into the sitemap.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, articles, services, jobs] = await Promise.all([
    getProjects(),
    getArticles(),
    getServices(),
    getJobs(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const lang of routing.locales) {
    for (const p of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${lang}${p}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: p === '' ? 1.0 : 0.8,
      });
    }

    for (const s of services) {
      entries.push({ url: `${SITE_URL}/${lang}/services/${s.slug}`, changeFrequency: 'monthly', priority: 0.7 });
    }
    for (const p of projects) {
      entries.push({ url: `${SITE_URL}/${lang}/projects/${p.slug}`, changeFrequency: 'monthly', priority: 0.7 });
    }
    for (const a of articles) {
      entries.push({
        url: `${SITE_URL}/${lang}/news/${a.slug}`,
        lastModified: a.date ? new Date(a.date) : new Date(),
        changeFrequency: 'yearly',
        priority: 0.6,
      });
    }
    for (const j of jobs) {
      entries.push({ url: `${SITE_URL}/${lang}/careers/${j.slug}`, changeFrequency: 'weekly', priority: 0.6 });
    }
  }

  return entries;
}
