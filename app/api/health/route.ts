import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/db';

export const runtime = 'nodejs';
// Always evaluate live — never cached or prerendered.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Combined readiness probe: process is up and DB accepts `select 1`. */
export async function GET() {
  const startedAt = process.uptime();
  let dbOk = false;

  try {
    await db.execute(sql`select 1`);
    dbOk = true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/health] database check failed', err);
  }

  return NextResponse.json(
    {
      ok: dbOk,
      uptime_s: Math.round(startedAt),
      db: dbOk ? 'up' : 'down',
      time: new Date().toISOString(),
    },
    { status: dbOk ? 200 : 503 }
  );
}
