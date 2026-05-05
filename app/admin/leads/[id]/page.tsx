import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { KV } from '@/components/admin/KV';
import { StatusSelect } from '@/components/admin/StatusSelect';
import { NotesPanel, type Note } from '@/components/admin/NotesPanel';
import type { LeadStatus } from '@/components/admin/StatusPill';

export const dynamic = 'force-dynamic';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let row;
  try {
    [row] = await db.select().from(leads).where(eq(leads.id, id));
  } catch (err) {
    return (
      <>
        <AdminTopbar title="Lead" />
        <div style={{ padding: 32 }}>
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
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {err instanceof Error ? err.message : 'unknown'}
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!row) notFound();

  const notes = (Array.isArray(row.notes) ? row.notes : []) as Note[];

  return (
    <>
      <AdminTopbar
        title={row.name ?? 'Untitled lead'}
        right={
          <Link href="/admin/leads" className="btn btn-ghost btn-sm">
            ← All leads
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
        {/* Left column — facts + message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            className="card"
            style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}
          >
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
              <StatusSelect id={row.id} current={(row.status ?? 'new') as LeadStatus} />
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <KV k="Email">
              {row.email ? <a href={`mailto:${row.email}`} style={{ color: 'var(--primary)' }}>{row.email}</a> : '—'}
            </KV>
            <KV k="Phone">
              {row.phone ? <a href={`tel:${row.phone}`} style={{ fontFamily: 'var(--font-mono)' }}>{row.phone}</a> : '—'}
            </KV>
            <KV k="Company">{row.company ?? '—'}</KV>
            <KV k="Source">
              <span style={{ fontFamily: 'var(--font-mono)' }}>{row.source ?? '—'}</span>
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
              Original message
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
              {row.message ?? '(no message)'}
            </p>
          </div>
        </div>

        {/* Right column — notes */}
        <div className="card" style={{ padding: 24 }}>
          <NotesPanel id={row.id} notes={notes} />
        </div>
      </div>
    </>
  );
}
