import { db } from '@/db';
import { partners } from '@/db/schema';
import { PartnersClient } from '@/components/admin/PartnersClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export const dynamic = 'force-dynamic';

export default async function AdminPartnersPage() {
  let rows;
  try {
    rows = await db.select().from(partners).orderBy(partners.displayOrder);
  } catch (err) {
    return (
      <>
        <AdminTopbar title="Partners" />
        <div style={{ padding: 32 }}>
          <div className="card" style={{ padding: 24, background: 'rgba(232,123,111,0.08)', borderColor: 'rgba(232,123,111,0.3)' }}>
            <h3 className="h3" style={{ fontSize: 18, marginBottom: 8 }}>Database not connected</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{err instanceof Error ? err.message : 'unknown'}</p>
          </div>
        </div>
      </>
    );
  }
  return <PartnersClient rows={rows} />;
}
