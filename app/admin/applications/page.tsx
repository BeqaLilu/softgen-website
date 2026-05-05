import Link from 'next/link';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { jobApplications, jobs } from '@/db/schema';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { APPLICATION_STATUSES } from './statuses';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ status?: string }>;

export default async function ApplicationsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filter = sp.status ?? 'all';

  let rows;
  let counts: Record<string, number> = { all: 0 };
  try {
    rows = await db
      .select({
        id: jobApplications.id,
        name: jobApplications.name,
        email: jobApplications.email,
        jobSlug: jobApplications.jobSlug,
        jobTitle: jobs.title,
        status: jobApplications.status,
        createdAt: jobApplications.createdAt,
      })
      .from(jobApplications)
      .leftJoin(jobs, sql`${jobs.slug} = ${jobApplications.jobSlug}`)
      .where(filter === 'all' ? sql`TRUE` : sql`${jobApplications.status} = ${filter}`)
      .orderBy(sql`${jobApplications.createdAt} desc`)
      .limit(200);

    const cs = await db
      .select({ status: jobApplications.status, count: sql<number>`count(*)::int` })
      .from(jobApplications)
      .groupBy(jobApplications.status);
    for (const c of cs) {
      counts[c.status ?? 'new'] = c.count;
      counts.all += c.count;
    }
  } catch (err) {
    return (
      <>
        <AdminTopbar title="Applications" />
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
    <>
      <AdminTopbar title="Applications" />
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {[{ id: 'all', label: 'All' }, ...APPLICATION_STATUSES.map((s) => ({ id: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))].map((tab) => {
            const active = filter === tab.id;
            const c = counts[tab.id] ?? 0;
            return (
              <Link
                key={tab.id}
                href={`/admin/applications?${tab.id !== 'all' ? `status=${tab.id}` : ''}`}
                style={{
                  padding: '12px 18px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 14,
                  color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: -1,
                }}
              >
                {tab.label}{' '}
                <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{c}</span>
              </Link>
            );
          })}
        </div>

        {rows.length === 0 ? (
          <div className="card" style={{ padding: 64, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No applications {filter !== 'all' ? `with status "${filter}"` : 'yet'}.
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  {['Name', 'Role', 'Email', 'Status', 'Applied'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-tertiary)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const t = r.jobTitle as { en?: string } | null;
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border)', height: 60 }}>
                      <td style={{ padding: '0 16px' }}>
                        <Link href={`/admin/applications/${r.id}`} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                          {r.name ?? '—'}
                        </Link>
                      </td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontSize: 14 }}>
                        {t?.en ?? r.jobSlug ?? '—'}
                      </td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontSize: 14 }}>{r.email ?? '—'}</td>
                      <td style={{ padding: '0 16px', color: 'var(--primary)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                        {r.status}
                      </td>
                      <td style={{ padding: '0 16px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                        {new Date(r.createdAt).toISOString().slice(0, 10)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
