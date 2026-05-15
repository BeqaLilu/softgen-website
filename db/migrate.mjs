// Production migration runner — executed by the prod container.
//
// Reads SQL files under ./db/migrations (generated via `pnpm db:generate`),
// applies them in order to the configured DATABASE_URL.
//
// .mjs (not .ts) so the runner image doesn't need tsx / a TS toolchain.
//
// Run from the repo root in dev:    node db/migrate.mjs
// Run inside the prod container:    node db/migrate.mjs   (cwd is /app)

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const dir = path.resolve(process.cwd(), 'db/migrations');
if (!existsSync(dir)) {
  console.error(`Migrations folder not found at ${dir}.`);
  console.error('Run `pnpm db:generate` first.');
  process.exit(1);
}

const ssl = /sslmode=disable/.test(url) ? false : 'require';
const sql = postgres(url, { ssl, max: 1, prepare: false, connect_timeout: 10 });

async function run() {
  // Track applied migrations in a tiny ledger table (Drizzle's own format).
  await sql.unsafe(`
    CREATE SCHEMA IF NOT EXISTS drizzle;
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id           SERIAL PRIMARY KEY,
      hash         TEXT NOT NULL,
      created_at   BIGINT NOT NULL
    );
  `);

  const applied = new Set(
    (await sql`SELECT hash FROM drizzle.__drizzle_migrations`).map((r) => r.hash)
  );

  // Migrations are applied alphabetically — drizzle-kit prefixes each with
  // a sortable counter (0000_init.sql, 0001_xyz.sql, ...).
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  let count = 0;
  for (const file of files) {
    const hash = file; // file name as the unique key — sufficient for our scale
    if (applied.has(hash)) continue;

    console.log(`→ applying ${file}`);
    const text = readFileSync(path.join(dir, file), 'utf8');
    // drizzle-kit emits `--> statement-breakpoint` between statements.
    const statements = text
      .split(/-->\s*statement-breakpoint/i)
      .map((s) => s.trim())
      .filter(Boolean);

    await sql.begin(async (tx) => {
      for (const stmt of statements) {
        await tx.unsafe(stmt);
      }
      await tx`INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES (${hash}, ${Date.now()})`;
    });
    count++;
  }

  console.log(count === 0 ? '✓ no new migrations' : `✓ applied ${count} migration${count === 1 ? '' : 's'}`);
  await sql.end();
  process.exit(0);
}

run().catch((err) => {
  console.error('migration failed:', err);
  process.exit(1);
});
