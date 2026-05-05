import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { jobApplications, jobs } from '@/db/schema';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { KV } from '@/components/admin/KV';
import { ApplicationStatusSelect } from '@/components/admin/ApplicationStatusSelect';

export const dynamic = 'force-dynamic';

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let row;
  try {
    [row] = await db
      .select({
        id: jobApplications.id,
        jobSlug: jobApplications.jobSlug,
        jobTitle: jobs.title,
        name: jobApplications.name,
        email: jobApplications.email,
        phone: jobApplications.phone,
        cvUrl: jobApplications.cvUrl,
        coverNote: jobApplications.coverNote,
        status: jobApplications.status,
        createdAt: jobApplications.createdAt,
      })
      .from(jobApplications)
      .leftJoin(jobs, sql`${jobs.slug} = ${jobApplications.jobSlug}`)
      .where(eq(jobApplications.id, id));
  } catch (err) {
    return (
      <>
        <AdminTopbar title="Application" />
        <div style={{ padding: 32 }}>
          <div className="card" style={{ padding: 24, background: 'rgba(232,123,111,0.08)', borderColor: 'rgba(232,123,111,0.3)' }}>
            <h3 className="h3" style={{ fontSize: 18, marginBottom: 8 }}>Database not connected</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{err instanceof Error ? err.message : 'unknown'}</p>
          </div>
        </div>
      </>
    );
  }

  if (!row) notFound();

  const t = row.jobTitle as { en?: string } | null;

  return (
    <>
      <AdminTopbar
        title={row.name ?? 'Untitled application'}
        right={
          <Link href="/admin/applications" className="btn btn-ghost btn-sm">
            ← All applications
          </Link>
        }
      />

      <div
        style={{
          padding: 32,
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 32,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Status
              </h3>
              <ApplicationStatusSelect id={row.id} current={row.status ?? 'new'} />
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <KV k="Role">
              {row.jobSlug ? (
                <Link href={`/admin/jobs`} style={{ color: 'var(--primary)' }}>
                  {t?.en ?? row.jobSlug}
                </Link>
              ) : (
                '—'
              )}
            </KV>
            <KV k="Email">
              {row.email ? <a href={`mailto:${row.email}`} style={{ color: 'var(--primary)' }}>{row.email}</a> : '—'}
            </KV>
            <KV k="Phone">
              {row.phone ? <a href={`tel:${row.phone}`} style={{ fontFamily: 'var(--font-mono)' }}>{row.phone}</a> : '—'}
            </KV>
            <KV k="CV">
              {row.cvUrl ? (
                <a
                  href={row.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-soft btn-sm"
                  style={{ display: 'inline-flex' }}
                >
                  Download / open
                </a>
              ) : (
                <span style={{ color: 'var(--text-tertiary)' }}>(none)</span>
              )}
            </KV>
            <KV k="Submitted">
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {new Date(row.createdAt).toLocaleString()}
              </span>
            </KV>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-tertiary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Cover note
            </h3>
            <p
              style={{
                whiteSpace: 'pre-wrap',
                fontSize: 15,
                lineHeight: 1.7,
                color: 'var(--text-primary)',
                paddingLeft: 16,
                borderLeft: '3px solid var(--primary)',
              }}
            >
              {row.coverNote ?? '(no cover note)'}
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-tertiary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Contact
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {row.email && (
              <a href={`mailto:${row.email}`} className="btn btn-soft btn-sm" style={{ justifyContent: 'flex-start' }}>
                Reply via email
              </a>
            )}
            {row.phone && (
              <a href={`tel:${row.phone}`} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>
                Call
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
