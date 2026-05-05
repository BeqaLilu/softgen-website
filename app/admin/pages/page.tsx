import { db } from '@/db';
import { pages } from '@/db/schema';
import { PagesClient } from '@/components/admin/PagesClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export const dynamic = 'force-dynamic';

export default async function AdminPagesPage() {
  let rows;
  try {
    rows = await db.select().from(pages).orderBy(pages.slug);
  } catch (err) {
    return (
      <>
        <AdminTopbar title="Pages" />
        <div style={{ padding: 32 }}>
          <div className="card" style={{ padding: 24, background: 'rgba(232,123,111,0.08)', borderColor: 'rgba(232,123,111,0.3)' }}>
            <h3 className="h3" style={{ fontSize: 18, marginBottom: 8 }}>Database not connected</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{err instanceof Error ? err.message : 'unknown'}</p>
          </div>
        </div>
      </>
    );
  }
  return <PagesClient rows={rows} />;
}
