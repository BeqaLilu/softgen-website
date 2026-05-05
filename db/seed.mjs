// Production seed runner — same purpose as db/seed.ts but as plain Node so
// the runner image doesn't need tsx. The TS seed (db/seed.ts) stays for dev
// since it's nicer to edit; this file is auto-derived in spirit.
//
// Run inside the prod container:  node db/seed.mjs

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

// --- Load CONTENT from the bundled standalone build -----------------------
// In the prod container, the running app is in /app and the standalone bundle
// is rooted at /app. The compiled CONTENT lives inside .next bundles and isn't
// accessible as a plain import. Easiest portable answer: ship a JSON snapshot
// of CONTENT and read it here. That snapshot is generated below from the TS
// source at build time. For the first cut we re-implement the small slice of
// CONTENT this script touches (services list, project list, articles list, …)
// by reading from a JSON file that's bundled alongside this script.
//
// The build step (Dockerfile) emits content/static.json next to this file.

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const contentPath = path.resolve(here, '..', 'content', 'static.json');

let CONTENT;
try {
  const mod = await import(pathToFileURL(contentPath).href, { with: { type: 'json' } });
  CONTENT = mod.default;
} catch (err) {
  console.error(`Could not load ${contentPath}.`);
  console.error('The Dockerfile should generate it via build-content-snapshot.mjs.');
  console.error(err);
  process.exit(1);
}

const ssl = /sslmode=disable/.test(url) ? false : 'require';
const sql = postgres(url, { ssl, max: 1, prepare: false, connect_timeout: 10 });

async function main() {
  console.log('Seeding…');

  // services
  for (let i = 0; i < CONTENT.services.items.length; i++) {
    const it = CONTENT.services.items[i];
    const detail = CONTENT.servicesPage.detail[it.slug];
    await sql`
      INSERT INTO services (slug, num, title, tagline, body, capabilities, related, display_order)
      VALUES (${it.slug}, ${it.num}, ${sql.json(it.title)}, ${sql.json(detail.tagline)},
              ${sql.json(it.body)}, ${sql.json(detail.capabilities)},
              ${detail.related}, ${i})
      ON CONFLICT (slug) DO UPDATE SET
        num = EXCLUDED.num,
        title = EXCLUDED.title,
        tagline = EXCLUDED.tagline,
        body = EXCLUDED.body,
        capabilities = EXCLUDED.capabilities,
        related = EXCLUDED.related,
        display_order = EXCLUDED.display_order
    `;
  }
  console.log(`  services        — ${CONTENT.services.items.length} rows`);

  // projects
  for (let i = 0; i < CONTENT.projectsTeaser.items.length; i++) {
    const p = CONTENT.projectsTeaser.items[i];
    const detail = CONTENT.projectsPage.detail[p.slug] ?? null;
    await sql`
      INSERT INTO projects (slug, title, category, year, client, duration, scope, team, summary,
                            body, accent, cover_style, tags, related, featured, published, display_order, updated_at)
      VALUES (${p.slug}, ${sql.json(p.title)}, ${p.category.en}, ${parseInt(p.year, 10)},
              ${detail?.client ?? null},
              ${detail?.duration ? sql.json(detail.duration) : null},
              ${detail?.scope ? sql.json(detail.scope) : null},
              ${detail?.team ?? null},
              ${detail?.summary ? sql.json(detail.summary) : null},
              ${detail?.body ? sql.json({ en: detail.body.en, ka: detail.body.en }) : null},
              ${p.accent}, ${p.coverStyle ?? 'dashboard'}, ${detail?.tags ?? []}, ${[]}, true, true, ${i}, now())
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        year = EXCLUDED.year,
        accent = EXCLUDED.accent,
        cover_style = EXCLUDED.cover_style,
        updated_at = now()
    `;
  }
  console.log(`  projects        — ${CONTENT.projectsTeaser.items.length} rows`);

  // articles
  for (const a of CONTENT.news.articles) {
    const body = CONTENT.news.bodies[a.slug] ?? null;
    await sql`
      INSERT INTO articles (slug, category, title, excerpt, body, author_name, read_time, date,
                            accent, featured, published, updated_at)
      VALUES (${a.slug}, ${a.category}, ${sql.json(a.title)}, ${sql.json(a.excerpt)},
              ${body ? sql.json(body) : null}, ${a.author}, ${a.readTime}, ${a.date},
              ${a.accent}, ${a.featured ?? false}, true, now())
      ON CONFLICT (slug) DO UPDATE SET
        category = EXCLUDED.category,
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        body = EXCLUDED.body,
        read_time = EXCLUDED.read_time,
        date = EXCLUDED.date,
        accent = EXCLUDED.accent,
        featured = EXCLUDED.featured,
        updated_at = now()
    `;
  }
  console.log(`  articles        — ${CONTENT.news.articles.length} rows`);

  // team
  for (let i = 0; i < CONTENT.about.team.length; i++) {
    const m = CONTENT.about.team[i];
    await sql`DELETE FROM team_members WHERE name = ${m.name}`;
    await sql`
      INSERT INTO team_members (name, role, since, display_order, visible)
      VALUES (${m.name}, ${sql.json(m.role)}, ${parseInt(m.since, 10)}, ${i}, true)
    `;
  }
  console.log(`  team_members    — ${CONTENT.about.team.length} rows`);

  // partners
  await sql`DELETE FROM partners`;
  for (let i = 0; i < CONTENT.partners.logos.length; i++) {
    await sql`INSERT INTO partners (name, display_order) VALUES (${CONTENT.partners.logos[i]}, ${i})`;
  }
  console.log(`  partners        — ${CONTENT.partners.logos.length} rows`);

  // jobs
  for (const j of CONTENT.careers.jobs) {
    await sql`
      INSERT INTO jobs (slug, title, department, type, location, description, open)
      VALUES (${j.slug}, ${sql.json(j.title)}, ${j.department}, ${j.type}, ${j.location},
              ${sql.json(j.description)}, true)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        department = EXCLUDED.department,
        type = EXCLUDED.type,
        location = EXCLUDED.location,
        description = EXCLUDED.description
    `;
  }
  console.log(`  jobs            — ${CONTENT.careers.jobs.length} rows`);

  // pages — the bilingual page-copy snapshots. Same shape db/seed.ts uses.
  const pageBlobs = [
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
    await sql`
      INSERT INTO pages (slug, content) VALUES (${p.slug}, ${sql.json(p.content)})
      ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content
    `;
  }
  console.log(`  pages           — ${pageBlobs.length} rows`);

  // admin
  const email = process.env.SEED_ADMIN_EMAIL ?? 'levan@softgen.ge';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'changeme-now';
  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length === 0) {
    const hash = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email}, ${hash}, ${'Levan Kapanadze'}, ${'admin'})
    `;
    console.log(`  users           — admin created (${email})`);
    console.log(`                    password: ${password}`);
    console.log(`                    ⚠ change immediately`);
  } else {
    console.log(`  users           — admin exists (${email})`);
  }

  console.log('\nDone.');
  await sql.end();
}

main().catch((err) => {
  console.error('seed failed:', err);
  process.exit(1);
});
