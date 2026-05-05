'use server';

import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth/next';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { authOptions } from '@/lib/auth';
import { STATUS_OPTIONS, type LeadStatus } from '@/components/admin/StatusPill';

async function requireSession() {
  const s = await getServerSession(authOptions);
  if (!s) throw new Error('unauthorized');
  return s;
}

export async function updateLeadStatus(id: string, status: string): Promise<{ ok: boolean }> {
  await requireSession();
  if (!STATUS_OPTIONS.includes(status as LeadStatus)) return { ok: false };
  await db.update(leads).set({ status }).where(eq(leads.id, id));
  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${id}`);
  return { ok: true };
}

export async function appendLeadNote(id: string, body: string): Promise<{ ok: boolean }> {
  const session = await requireSession();
  const text = body.trim();
  if (!text) return { ok: false };

  const note = {
    body: text,
    by: session.user.email ?? session.user.name ?? 'admin',
    at: new Date().toISOString(),
  };

  // Append to the JSONB notes array atomically.
  await db
    .update(leads)
    .set({ notes: sql`coalesce(${leads.notes}, '[]'::jsonb) || ${JSON.stringify([note])}::jsonb` })
    .where(eq(leads.id, id));

  revalidatePath(`/admin/leads/${id}`);
  return { ok: true };
}
