import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/db';

export const runtime = 'nodejs';
// Always evaluate live — never cached or prerendered.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Liveness + readiness probe.
 *
 *  - Liveness  → process is up (always 200 from this handler).
 *  - Readiness → DB is reachable (200 if `select 1` succeeds, 503 otherwise).
 *
 * Used by:
 *  - Dockerfile HEALTHCHECK (sees 200/503 only, doesn't read body)
 *  - Reverse-proxy / orchestrator probes
 *  - Manual `curl http://host/api/health`
 */
export async function GET() {
  const startedAt = process.uptime();
  let dbOk = false;
  let dbError: string | undefined;

  try {
    await db.execute(sql`select 1`);
    dbOk = true;
  } catch (err) {
    dbError = err instanceof Error ? err.message : 'unknown';
  }

  return NextResponse.json(
    {
      ok: dbOk,
      uptime_s: Math.round(startedAt),
      db: dbOk ? 'up' : 'down',
      ...(dbError ? { db_error: dbError } : {}),
      time: new Date().toISOString(),
    },
    { status: dbOk ? 200 : 503 }
  );
}
