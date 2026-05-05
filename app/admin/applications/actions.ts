'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth/next';
import { db } from '@/db';
import { jobApplications } from '@/db/schema';
import { authOptions } from '@/lib/auth';
import { APPLICATION_STATUSES, type ApplicationStatus } from './statuses';

async function requireSession() {
  const s = await getServerSession(authOptions);
  if (!s) throw new Error('unauthorized');
}

export async function updateApplicationStatus(id: string, status: string): Promise<{ ok: boolean }> {
  await requireSession();
  if (!APPLICATION_STATUSES.includes(status as ApplicationStatus)) return { ok: false };
  await db.update(jobApplications).set({ status }).where(eq(jobApplications.id, id));
  revalidatePath('/admin/applications');
  revalidatePath(`/admin/applications/${id}`);
  return { ok: true };
}
