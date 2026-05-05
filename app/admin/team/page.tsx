import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { teamMembers } from '@/db/schema';
import { TeamClient } from '@/components/admin/TeamClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export const dynamic = 'force-dynamic';

export default async function AdminTeamPage() {
  let rows;
  try {
    rows = await db
      .select()
      .from(teamMembers)
      .orderBy(sql`${teamMembers.displayOrder} asc`);
  } catch (err) {
    return (
      <>
        <AdminTopbar title="Team" />
        <div style={{ padding: 32 }}>
          <div className="card" style={{ padding: 24, background: 'rgba(232,123,111,0.08)', borderColor: 'rgba(232,123,111,0.3)' }}>
            <h3 className="h3" style={{ fontSize: 18, marginBottom: 8 }}>Database not connected</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{err instanceof Error ? err.message : 'unknown'}</p>
          </div>
        </div>
      </>
    );
  }
  return <TeamClient rows={rows} />;
}
