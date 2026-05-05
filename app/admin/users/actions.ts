'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { db } from '@/db';
import { users } from '@/db/schema';
import { authOptions } from '@/lib/auth';

async function requireAdmin() {
  const s = await getServerSession(authOptions);
  if (!s) throw new Error('unauthorized');
  if (s.user.role !== 'admin') throw new Error('forbidden');
  return s;
}

export type UserInput = {
  id?: string;
  email: string;
  name?: string | null;
  role: 'admin' | 'editor';
  password?: string;
};

export async function inviteUser(input: UserInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  await requireAdmin();
  if (!input.email?.includes('@')) return { ok: false, error: 'email_invalid' };
  if (input.role !== 'admin' && input.role !== 'editor') return { ok: false, error: 'role_invalid' };

  if (input.id) {
    const set: Record<string, unknown> = {
      email: input.email,
      name: input.name ?? null,
      role: input.role,
    };
    if (input.password) set.passwordHash = await bcrypt.hash(input.password, 10);
    await db.update(users).set(set).where(eq(users.id, input.id));
    revalidatePath('/admin/users');
    return { ok: true, id: input.id };
  }

  if (!input.password || input.password.length < 8) return { ok: false, error: 'password_min_8' };
  const passwordHash = await bcrypt.hash(input.password, 10);
  try {
    const [row] = await db
      .insert(users)
      .values({ email: input.email, name: input.name ?? null, role: input.role, passwordHash })
      .returning({ id: users.id });
    revalidatePath('/admin/users');
    return { ok: true, id: row.id };
  } catch (err) {
    if (err instanceof Error && err.message.includes('duplicate')) {
      return { ok: false, error: 'email_taken' };
    }
    throw err;
  }
}

export async function deleteUser(id: string): Promise<{ ok: boolean; error?: string }> {
  const s = await requireAdmin();
  if (s.user.id === id) return { ok: false, error: 'cannot_delete_self' };
  await db.delete(users).where(eq(users.id, id));
  revalidatePath('/admin/users');
  return { ok: true };
}
