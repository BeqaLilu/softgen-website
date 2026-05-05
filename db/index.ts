/**
 * Drizzle client. Reads `DATABASE_URL` from env.
 *
 * If the env var is missing, we still export a stub `db` whose first call
 * throws a friendly message. That keeps `next build` clean before a DB is
 * provisioned — the public pages still work from `content/static.ts`,
 * and only API routes / admin actually touch `db`.
 */

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle> | null = null;

function init() {
  if (_db) return _db;
  // Read inside init() not at module top — module imports hoist above any
  // dotenv calls in the entry script, so reading at top would always be undefined
  // when the entry uses `dotenv.config({ path: '.env.local' })`.
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Provision a Postgres (Neon, Supabase, or local) ' +
        'and put the connection string in .env.local. See .env.example.'
    );
  }
  // SSL on for hosted DBs (Neon/Supabase). Local dev URLs often disable it.
  const ssl = /sslmode=disable/.test(url) ? false : 'require';
  // 5s connect_timeout so a misconfigured DATABASE_URL fails fast in build
  // contexts (where the DB hostname may be unreachable). Without this, an
  // unreachable host hangs Next's static-page worker for 60s+ per page.
  const client = postgres(url, { ssl, max: 1, prepare: false, connect_timeout: 5 });
  _db = drizzle(client, { schema });
  return _db;
}

/**
 * Lazy proxy — initialization is deferred until the first query so that
 * importing this module from a build context (no DATABASE_URL) doesn't
 * throw. Throws clearly the first time a method is actually called.
 */
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const real = init();
    const v = (real as unknown as Record<string, unknown>)[prop as string];
    return typeof v === 'function' ? (v as (...args: unknown[]) => unknown).bind(real) : v;
  },
});

export { schema };
