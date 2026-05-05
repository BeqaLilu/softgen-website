import Link from 'next/link';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { leads, projects, articles, jobApplications } from '@/db/schema';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { StatusPill } from '@/components/admin/StatusPill';

export const dynamic = 'force-dynamic';

type Stat = { label: string; value: number; href: string };
type RecentLead = { id: string; name: string | null; email: string | null; company: string | null; status: string | null; createdAt: Date };

async function loadStats(): Promise<{ stats: Stat[]; recent: RecentLead[]; ok: true } | { ok: false; error: string }> {
  try {
    const [newLeads] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(leads)
      .where(sql`${leads.createdAt} > now() - interval '7 days'`);
    const [pubProjects] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .where(sql`${projects.published} = true`);
    const [draftArticles] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(articles)
      .where(sql`${articles.published} = false`);
    const [apps] = await db.select({ count: sql<number>`count(*)::int` }).from(jobApplications);

    const recent = await db
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        company: leads.company,
        status: leads.status,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .orderBy(sql`${leads.createdAt} desc`)
      .limit(5);

    return {
      ok: true,
      stats: [
        { label: 'New leads (7d)',    value: newLeads.count,     href: '/admin/leads' },
        { label: 'Published projects', value: pubProjects.count,  href: '/admin/projects' },
        { label: 'Draft articles',    value: draftArticles.count, href: '/admin/news' },
        { label: 'Job applications',  value: apps.count,          href: '/admin/applications' },
      ],
      recent,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'unknown' };
  }
}

const QUICK_ACTIONS = [
  { label: 'New project', href: '/admin/projects?new=1' },
  { label: 'New article', href: '/admin/news?new=1' },
  { label: 'Add team member', href: '/admin/team?new=1' },
  { label: 'Add job', href: '/admin/jobs?new=1' },
];

export default async function AdminDashboard() {
  const data = await loadStats();

  return (
    <>
      <AdminTopbar title="Dashboard" />

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
        {!data.ok && (
          <div
            className="card"
            style={{
              padding: 24,
              background: 'rgba(232, 123, 111, 0.08)',
              borderColor: 'rgba(232, 123, 111, 0.3)',
            }}
          >
            <h3 className="h3" style={{ fontSize: 18, marginBottom: 8 }}>
              Database not connected
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
              {data.error}
            </p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 13, marginTop: 12, fontFamily: 'var(--font-mono)' }}>
              See <code>NEXT_STEPS.md</code> for setup. Quick path:
              <br />1. <code>cp .env.example .env.local</code>
              <br />2. Set <code>DATABASE_URL</code> + <code>NEXTAUTH_SECRET</code>
              <br />3. <code>pnpm db:push && pnpm db:seed</code>
            </p>
          </div>
        )}

        {/* Stats row */}
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {(data.ok ? data.stats : [
              { label: 'New leads (7d)', value: 0, href: '/admin/leads' },
              { label: 'Published projects', value: 0, href: '/admin/projects' },
              { label: 'Draft articles', value: 0, href: '/admin/news' },
              { label: 'Job applications', value: 0, href: '/admin/applications' },
            ]).map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="card"
                style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-tertiary)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 36,
                    letterSpacing: '-0.025em',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {s.value}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-tertiary)',
              letterSpacing: '0.12em',
              marginBottom: 12,
            }}
          >
            QUICK ACTIONS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.href} href={a.href} className="btn btn-soft">
                + {a.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Recent leads */}
        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 12,
            }}
          >
            <h3 className="h3" style={{ fontSize: 20 }}>
              Recent leads
            </h3>
            <Link href="/admin/leads" className="link-underline" style={{ fontSize: 13 }}>
              View all
            </Link>
          </div>
          {data.ok ? (
            data.recent.length === 0 ? (
              <div
                className="card"
                style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)' }}
              >
                No leads yet. The contact form will populate this list.
              </div>
            ) : (
              <div className="card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: '1px solid var(--border)',
                        textAlign: 'left',
                      }}
                    >
                      {['Name', 'Email', 'Company', 'Status', 'Created'].map((h) => (
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
                    {data.recent.map((r) => (
                      <tr
                        key={r.id}
                        style={{ borderBottom: '1px solid var(--border)', height: 56 }}
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
                        <td style={{ padding: '0 16px' }}>
                          <StatusPill status={r.status} />
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
          ) : null}
        </section>
      </div>
    </>
  );
}
