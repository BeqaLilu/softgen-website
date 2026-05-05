'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth/next';
import { db } from '@/db';
import { teamMembers } from '@/db/schema';
import { authOptions } from '@/lib/auth';

async function requireSession() {
  const s = await getServerSession(authOptions);
  if (!s) throw new Error('unauthorized');
}

export type TeamInput = {
  id?: string;
  name: string;
  role: { en: string; ka: string };
  since?: number | null;
  bio?: { en: string; ka: string } | null;
  avatarUrl?: string | null;
  displayOrder?: number;
  visible: boolean;
};

export async function saveTeamMember(input: TeamInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  await requireSession();
  if (!input.name?.trim()) return { ok: false, error: 'name_required' };
  if (!input.role?.en?.trim()) return { ok: false, error: 'role_en_required' };

  const values = {
    name: input.name.trim(),
    role: input.role,
    since: input.since ?? null,
    bio: input.bio ?? null,
    avatarUrl: input.avatarUrl ?? null,
    displayOrder: input.displayOrder ?? 0,
    visible: input.visible,
  };

  if (input.id) {
    await db.update(teamMembers).set(values).where(eq(teamMembers.id, input.id));
  } else {
    const [row] = await db.insert(teamMembers).values(values).returning({ id: teamMembers.id });
    revalidatePath('/admin/team');
    revalidatePath('/en/about');
    revalidatePath('/ka/about');
    return { ok: true, id: row.id };
  }
  revalidatePath('/admin/team');
  revalidatePath('/en/about');
  revalidatePath('/ka/about');
  return { ok: true, id: input.id };
}

export async function deleteTeamMember(id: string): Promise<{ ok: boolean }> {
  await requireSession();
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  revalidatePath('/admin/team');
  return { ok: true };
}
