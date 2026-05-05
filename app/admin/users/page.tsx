import { redirect } from 'next/navigation';
import { sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth/next';
import { db } from '@/db';
import { users } from '@/db/schema';
import { authOptions } from '@/lib/auth';
import { UsersClient } from '@/components/admin/UsersClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  // Admin-only per build-prompt §`/admin/users`.
  if (!session || session.user.role !== 'admin') redirect('/admin');

  let rows;
  try {
    rows = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(sql`${users.createdAt} desc`);
  } catch (err) {
    return (
      <>
        <AdminTopbar title="Users" />
        <div style={{ padding: 32 }}>
          <div className="card" style={{ padding: 24, background: 'rgba(232,123,111,0.08)', borderColor: 'rgba(232,123,111,0.3)' }}>
            <h3 className="h3" style={{ fontSize: 18, marginBottom: 8 }}>Database not connected</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{err instanceof Error ? err.message : 'unknown'}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <UsersClient
      rows={rows.map((r) => ({ ...r, role: r.role as 'admin' | 'editor' }))}
      currentUserId={session.user.id}
    />
  );
}
