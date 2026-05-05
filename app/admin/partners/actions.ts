'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth/next';
import { db } from '@/db';
import { partners } from '@/db/schema';
import { authOptions } from '@/lib/auth';

async function requireSession() {
  const s = await getServerSession(authOptions);
  if (!s) throw new Error('unauthorized');
}

export type PartnerInput = {
  id?: string;
  name: string;
  logoUrl?: string | null;
  displayOrder?: number;
};

export async function savePartner(input: PartnerInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  await requireSession();
  if (!input.name?.trim()) return { ok: false, error: 'name_required' };

  const values = {
    name: input.name.trim(),
    logoUrl: input.logoUrl ?? null,
    displayOrder: input.displayOrder ?? 0,
  };

  if (input.id) {
    await db.update(partners).set(values).where(eq(partners.id, input.id));
    revalidatePath('/admin/partners');
    revalidatePath('/en');
    revalidatePath('/ka');
    return { ok: true, id: input.id };
  }
  const [row] = await db.insert(partners).values(values).returning({ id: partners.id });
  revalidatePath('/admin/partners');
  revalidatePath('/en');
  revalidatePath('/ka');
  return { ok: true, id: row.id };
}

export async function deletePartner(id: string): Promise<{ ok: boolean }> {
  await requireSession();
  await db.delete(partners).where(eq(partners.id, id));
  revalidatePath('/admin/partners');
  return { ok: true };
}

export async function movePartner(id: string, direction: 'up' | 'down'): Promise<{ ok: boolean }> {
  await requireSession();
  const all = await db.select().from(partners).orderBy(partners.displayOrder);
  const idx = all.findIndex((p) => p.id === id);
  if (idx < 0) return { ok: false };
  const swap = direction === 'up' ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= all.length) return { ok: true };
  const a = all[idx];
  const b = all[swap];
  await db.update(partners).set({ displayOrder: b.displayOrder }).where(eq(partners.id, a.id));
  await db.update(partners).set({ displayOrder: a.displayOrder }).where(eq(partners.id, b.id));
  revalidatePath('/admin/partners');
  return { ok: true };
}
