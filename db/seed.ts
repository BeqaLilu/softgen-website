/**
 * Seed Postgres with the bilingual content from `content/static.ts`.
 *
 * Run after migrations:
 *   pnpm db:push      # sync schema (drizzle-kit push)
 *   pnpm db:seed      # insert seed rows
 *
 * Idempotent: every insert uses ON CONFLICT DO UPDATE so the script can be
 * re-run after content changes. The admin user is only created if missing
 * (we don't reset the password on re-seed).
 */

// Load .env.local first (dev secrets, gitignored), then .env (committed defaults).
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env.local' });
dotenvConfig({ path: '.env' });

import bcrypt from 'bcryptjs';
import { sql } from 'drizzle-orm';
import { db } from './index';
import {
  users,
  projects,
  articles,
  services,
  teamMembers,
  partners,
  jobs,
  pages,
} from './schema';
import { CONTENT } from '../content/static';

const PLACEHOLDER_PASSWORDS = new Set(['', 'changeme-now', 'CHANGE_ME', 'CHANGE_ME_FIRST_RUN']);

function requireSeedPassword(password: string | undefined): string {
  const value = password?.trim() ?? '';
  if (process.env.NODE_ENV === 'production' && PLACEHOLDER_PASSWORDS.has(value)) {
    throw new Error('SEED_ADMIN_PASSWORD must be set to a strong non-placeholder value before creating the production admin user.');
  }
  return value || 'changeme-now';
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Copy .env.example → .env.local and fill it in.');
    process.exit(1);
  }

  console.log('Seeding…');

  /* ─── Services (4 rows) ─── */
  for (let i = 0; i < CONTENT.services.items.length; i++) {
    const it = CONTENT.services.items[i];
    const detail = CONTENT.servicesPage.detail[it.slug];
    await db
      .insert(services)
      .values({
        slug: it.slug,
        num: it.num,
        title: it.title,
        tagline: detail.tagline,
        body: it.body,
        capabilities: detail.capabilities,
        related: detail.related,
        displayOrder: i,
      })
      .onConflictDoUpdate({
        target: services.slug,
        set: {
          num: it.num,
          title: it.title,
          tagline: detail.tagline,
          body: it.body,
          capabilities: detail.capabilities,
          related: detail.related,
          displayOrder: i,
        },
      });
  }
  console.log(`  services        — ${CONTENT.services.items.length} rows`);

  /* ─── Projects (4 rows; only TBC has a body so far) ─── */
  for (let i = 0; i < CONTENT.projectsTeaser.items.length; i++) {
    const p = CONTENT.projectsTeaser.items[i];
    const detail = CONTENT.projectsPage.detail[p.slug] as
      | (typeof CONTENT.projectsPage.detail)[keyof typeof CONTENT.projectsPage.detail]
      | undefined;
    await db
      .insert(projects)
      .values({
        slug: p.slug,
        title: p.title,
        category: p.category.en,
        year: parseInt(p.year, 10),
        client: detail?.client ?? null,
        duration: detail?.duration ?? null,
        scope: detail?.scope ?? null,
        team: detail?.team ?? null,
        summary: detail?.summary ?? null,
        body: detail?.body ? { en: detail.body.en, ka: detail.body.en } : null,
        accent: p.accent,
        coverStyle: p.coverStyle ?? 'dashboard',
        tags: detail?.tags ?? [],
        related: [],
        featured: true,
        published: true,
        displayOrder: i,
      })
      .onConflictDoUpdate({
        target: projects.slug,
        set: {
          title: p.title,
          category: p.category.en,
          year: parseInt(p.year, 10),
          accent: p.accent,
          coverStyle: p.coverStyle ?? 'dashboard',
          updatedAt: sql`now()`,
        },
      });
  }
  console.log(`  projects        — ${CONTENT.projectsTeaser.items.length} rows`);

  /* ─── Articles (6 rows; only the TBC case has a body) ─── */
  for (const a of CONTENT.news.articles) {
    const body = CONTENT.news.bodies[a.slug] ?? null;
    await db
      .insert(articles)
      .values({
        slug: a.slug,
        category: a.category,
        title: a.title,
        excerpt: a.excerpt,
        body,
        authorName: a.author,
        readTime: a.readTime,
        date: a.date,
        accent: a.accent,
        featured: a.featured ?? false,
        published: true,
      })
      .onConflictDoUpdate({
        target: articles.slug,
        set: {
          category: a.category,
          title: a.title,
          excerpt: a.excerpt,
          body,
          readTime: a.readTime,
          date: a.date,
          accent: a.accent,
          featured: a.featured ?? false,
          updatedAt: sql`now()`,
        },
      });
  }
  console.log(`  articles        — ${CONTENT.news.articles.length} rows`);

  /* ─── Team (6 rows) ─── */
  for (let i = 0; i < CONTENT.about.team.length; i++) {
    const m = CONTENT.about.team[i];
    // Use email-style natural key for idempotence — there's no slug column.
    // Strategy: delete + reinsert by name.
    await db.delete(teamMembers).where(sql`${teamMembers.name} = ${m.name}`);
    await db.insert(teamMembers).values({
      name: m.name,
      role: m.role,
      since: parseInt(m.since, 10),
      displayOrder: i,
      visible: true,
    });
  }
  console.log(`  team_members    — ${CONTENT.about.team.length} rows`);

  /* ─── Partners (18 rows) ─── */
  await db.delete(partners);
  for (let i = 0; i < CONTENT.partners.logos.length; i++) {
    await db.insert(partners).values({
      name: CONTENT.partners.logos[i],
      displayOrder: i,
    });
  }
  console.log(`  partners        — ${CONTENT.partners.logos.length} rows`);

  /* ─── Jobs (7 rows) ─── */
  for (const j of CONTENT.careers.jobs) {
    await db
      .insert(jobs)
      .values({
        slug: j.slug,
        title: j.title,
        department: j.department,
        type: j.type,
        location: j.location,
        description: j.description,
        open: true,
      })
      .onConflictDoUpdate({
        target: jobs.slug,
        set: {
          title: j.title,
          department: j.department,
          type: j.type,
          location: j.location,
          description: j.description,
        },
      });
  }
  console.log(`  jobs            — ${CONTENT.careers.jobs.length} rows`);

  /* ─── Pages (snapshot the static page intros so admin can edit them) ─── */
  const pageBlobs: Array<{ slug: string; content: unknown }> = [
    {
      slug: 'home',
      content: {
        hero: CONTENT.hero,
        stats: CONTENT.stats,
        services: CONTENT.services,
        projectsTeaser: CONTENT.projectsTeaser,
        partners: CONTENT.partners,
        newsTeaser: CONTENT.newsTeaser,
        cta_band: CONTENT.cta_band,
      },
    },
    { slug: 'about', content: CONTENT.about },
    { slug: 'services', content: { eyebrow: CONTENT.servicesPage.eyebrow, headline: CONTENT.servicesPage.headline, intro: CONTENT.servicesPage.intro } },
    { slug: 'projects', content: { eyebrow: CONTENT.projectsPage.eyebrow, headline: CONTENT.projectsPage.headline, intro: CONTENT.projectsPage.intro, filters: CONTENT.projectsPage.filters } },
    { slug: 'news', content: { eyebrow: CONTENT.news.eyebrow, headline: CONTENT.news.headline, intro: CONTENT.news.intro, categories: CONTENT.news.categories } },
    { slug: 'careers', content: { eyebrow: CONTENT.careers.eyebrow, headline: CONTENT.careers.headline, intro: CONTENT.careers.intro, departments: CONTENT.careers.departments } },
    { slug: 'contact', content: CONTENT.contact },
  ];
  for (const p of pageBlobs) {
    await db
      .insert(pages)
      .values(p)
      .onConflictDoUpdate({ target: pages.slug, set: { content: p.content } });
  }
  console.log(`  pages           — ${pageBlobs.length} rows`);

  /* ─── Admin user (only insert if missing) ─── */
  const email = process.env.SEED_ADMIN_EMAIL ?? 'levan@softgen.ge';
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`${users.email} = ${email}`);
  if (existing.length === 0) {
    const password = requireSeedPassword(process.env.SEED_ADMIN_PASSWORD);
    const hash = await bcrypt.hash(password, 10);
    await db.insert(users).values({
      email,
      passwordHash: hash,
      name: 'Levan Kapanadze',
      role: 'admin',
    });
    console.log(`  users           — admin user created (${email})`);
    console.log(`                    password: ${password}`);
    console.log(`                    ⚠ change the password immediately`);
  } else {
    console.log(`  users           — admin user already exists`);
  }

  console.log('\nDone.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
