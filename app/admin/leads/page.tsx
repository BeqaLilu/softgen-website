import Link from 'next/link';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { StatusPill, STATUS_OPTIONS, type LeadStatus } from '@/components/admin/StatusPill';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ status?: string; q?: string }>;

async function loadLeads(filterStatus: string, q: string) {
  try {
    const rows = await db
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        company: leads.company,
        source: leads.source,
        status: leads.status,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .where(
        sql`
          ${filterStatus === 'all' ? sql`TRUE` : sql`${leads.status} = ${filterStatus}`}
          ${q ? sql`AND (
            ${leads.name} ILIKE ${'%' + q + '%'} OR
            ${leads.email} ILIKE ${'%' + q + '%'} OR
            ${leads.company} ILIKE ${'%' + q + '%'}
          )` : sql``}
        `
      )
      .orderBy(sql`${leads.createdAt} desc`)
      .limit(200);

    const counts = await db
      .select({ status: leads.status, count: sql<number>`count(*)::int` })
      .from(leads)
      .groupBy(leads.status);

    const map: Record<string, number> = { all: 0 };
    for (const c of counts) {
      map[c.status ?? 'new'] = c.count;
      map.all += c.count;
    }
    return { ok: true as const, rows, counts: map };
  } catch (err) {
    return { ok: false as const, error: err instanceof Error ? err.message : 'unknown' };
  }
}

export default async function LeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filter = sp.status ?? 'all';
  const q = sp.q ?? '';
  const data = await loadLeads(filter, q);

  return (
    <>
      <AdminTopbar
        title="Leads"
        right={
          <form
            action="/admin/leads"
            style={{ display: 'flex', gap: 8 }}
          >
            <input
              className="input"
              name="q"
              defaultValue={q}
              placeholder="Search…"
              style={{ width: 240, padding: '8px 12px', fontSize: 14 }}
            />
            {filter !== 'all' && <input type="hidden" name="status" value={filter} />}
          </form>
        }
      />

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!data.ok && (
          <div
            className="card"
            style={{
              padding: 24,
              background: 'rgba(232, 123, 111, 0.08)',
              borderColor: 'rgba(232, 123, 111, 0.3)',
            }}
          >
            <h3 className="h3" style={{ fontSize: 18, marginBottom: 8 }}>Database not connected</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{data.error}</p>
          </div>
        )}

        {/* Status filter tabs */}
        <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--border)' }}>
          {[{ id: 'all', label: 'All' }, ...STATUS_OPTIONS.map((s) => ({ id: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))].map((tab) => {
            const active = filter === tab.id;
            const count = data.ok ? data.counts[tab.id] ?? 0 : 0;
            return (
              <Link
                key={tab.id}
                href={`/admin/leads?${new URLSearchParams({ ...(tab.id !== 'all' ? { status: tab.id } : {}), ...(q ? { q } : {}) })}`}
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
                <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Table */}
        {data.ok && (
          data.rows.length === 0 ? (
            <div
              className="card"
              style={{ padding: 64, textAlign: 'center', color: 'var(--text-tertiary)' }}
            >
              No leads {filter !== 'all' ? `with status "${filter}"` : 'yet'}. The contact form will populate this list.
            </div>
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    {['Name', 'Email', 'Company', 'Source', 'Status', 'Created'].map((h) => (
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
                  {data.rows.map((r) => (
                    <tr
                      key={r.id}
                      style={{ borderBottom: '1px solid var(--border)', height: 60 }}
                    >
                      <td style={{ padding: '0 16px' }}>
                        <Link
                          href={`/admin/leads/${r.id}`}
                          style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                        >
                          {r.name ?? '—'}
                        </Link>
                      </td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontSize: 14 }}>
                        {r.email ?? '—'}
                      </td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontSize: 14 }}>
                        {r.company ?? '—'}
                      </td>
                      <td
                        style={{
                          padding: '0 16px',
                          color: 'var(--text-tertiary)',
                          fontSize: 12,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {r.source ?? '—'}
                      </td>
                      <td style={{ padding: '0 16px' }}>
                        <StatusPill status={r.status as LeadStatus} />
                      </td>
                      <td
                        style={{
                          padding: '0 16px',
                          color: 'var(--text-tertiary)',
                          fontSize: 12,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {new Date(r.createdAt).toISOString().slice(0, 10)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </>
  );
}
