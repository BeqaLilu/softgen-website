'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { ProjectDrawer, type ExistingProject } from './ProjectDrawer';
import { PublishStatusPill } from './PublishStatusPill';
import { Toggle } from './Toggle';
import { toggleProjectFeatured } from '@/app/admin/projects/actions';
import { useRouter } from 'next/navigation';

export function ProjectsClient({ rows }: { rows: ExistingProject[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ExistingProject | null>(null);
  const [q, setQ] = useState('');

  const filtered = q
    ? rows.filter((r) => {
        const t = r.title as { en?: string; ka?: string } | null;
        return (
          (t?.en ?? '').toLowerCase().includes(q.toLowerCase()) ||
          (t?.ka ?? '').includes(q) ||
          r.slug.includes(q.toLowerCase()) ||
          r.category.toLowerCase().includes(q.toLowerCase())
        );
      })
    : rows;

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (r: ExistingProject) => {
    setEditing(r);
    setOpen(true);
  };

  return (
    <>
      <div
        style={{
          height: 80,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--bg-deep)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Projects
        </h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}
            />
            <input
              suppressHydrationWarning
              className="input"
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ width: 240, padding: '8px 12px 8px 34px', fontSize: 14 }}
            />
          </div>
          <button suppressHydrationWarning type="button" onClick={openNew} className="btn btn-primary btn-sm">
            <Plus size={14} />
            New project
          </button>
        </div>
      </div>

      <div style={{ padding: 32 }}>
        {filtered.length === 0 ? (
          <div
            className="card"
            style={{ padding: 64, textAlign: 'center', color: 'var(--text-tertiary)' }}
          >
            {rows.length === 0 ? (
              <>
                <p style={{ marginBottom: 16 }}>No projects yet.</p>
                <button suppressHydrationWarning type="button" onClick={openNew} className="btn btn-soft">
                  Create one
                </button>
              </>
            ) : (
              'No matches.'
            )}
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  {['Title', 'Category', 'Year', 'Featured', 'Status', 'Updated'].map((h) => (
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
                {filtered.map((r) => {
                  const t = r.title as { en?: string; ka?: string } | null;
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border)', height: 60 }}>
                      <td style={{ padding: '0 16px' }}>
                        <button
                          suppressHydrationWarning
                          type="button"
                          onClick={() => openEdit(r)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            color: 'var(--text-primary)',
                            fontWeight: 500,
                            textAlign: 'left',
                            fontFamily: 'inherit',
                            fontSize: 14,
                          }}
                        >
                          {t?.en ?? r.slug}
                        </button>
                        <div
                          style={{
                            fontSize: 12,
                            color: 'var(--text-tertiary)',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {r.slug}
                        </div>
                      </td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontSize: 14 }}>
                        {r.category}
                      </td>
                      <td
                        style={{
                          padding: '0 16px',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 13,
                        }}
                      >
                        {r.year}
                      </td>
                      <td style={{ padding: '0 16px' }}>
                        <Toggle
                          pressed={r.featured}
                          onPressedChange={(v) => {
                            void toggleProjectFeatured(r.id, v).then(() => router.refresh());
                          }}
                          label={`Featured: ${t?.en ?? r.slug}`}
                        />
                      </td>
                      <td style={{ padding: '0 16px' }}>
                        <PublishStatusPill published={r.published} />
                      </td>
                      <td
                        style={{
                          padding: '0 16px',
                          color: 'var(--text-tertiary)',
                          fontSize: 12,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        —
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProjectDrawer open={open} onOpenChange={setOpen} initial={editing} />
    </>
  );
}
