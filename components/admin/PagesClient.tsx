'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDrawer } from './AdminDrawer';
import { savePage } from '@/app/admin/pages/actions';

export type PageRow = { slug: string; content: unknown };

const PAGE_LABELS: Record<string, string> = {
  home: 'Home',
  about: 'About',
  services: 'Services',
  projects: 'Projects',
  news: 'News',
  careers: 'Careers',
  contact: 'Contact',
};

export function PagesClient({ rows }: { rows: PageRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PageRow | null>(null);
  const [pending, start] = useTransition();
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setDraft(JSON.stringify(editing.content, null, 2));
    } else {
      setDraft('{}');
    }
    setError(null);
  }, [open, editing]);

  const onSave = () => {
    if (!editing) return;
    let parsed: object;
    try {
      parsed = JSON.parse(draft);
    } catch {
      setError('Invalid JSON.');
      return;
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      setError('Top level must be a JSON object.');
      return;
    }
    setError(null);
    start(async () => {
      const r = await savePage(editing.slug, parsed);
      if (r.ok) {
        setOpen(false);
        router.refresh();
      } else setError(r.error ?? 'save_failed');
    });
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
          padding: '0 32px',
        }}
      >
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em', margin: 0 }}>
          Pages
        </h1>
      </div>

      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 16, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
          Static page content (eyebrows, headlines, intro copy). Each page is a JSON
          blob with bilingual strings. Edit the JSON directly — every key/value renders
          as <code style={{ fontFamily: 'var(--font-mono)' }}>{'{ en, ka }'}</code> on
          the public site.
        </div>

        {rows.length === 0 ? (
          <div className="card" style={{ padding: 64, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No page rows yet. Run <code>pnpm db:seed</code> to populate them.
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  {['Page', 'Slug', 'Keys'].map((h) => (
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
                  const keys = r.content && typeof r.content === 'object' ? Object.keys(r.content as object).length : 0;
                  return (
                    <tr key={r.slug} style={{ borderBottom: '1px solid var(--border)', height: 60 }}>
                      <td style={{ padding: '0 16px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(r);
                            setOpen(true);
                          }}
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
                          {PAGE_LABELS[r.slug] ?? r.slug}
                        </button>
                      </td>
                      <td style={{ padding: '0 16px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        {r.slug}
                      </td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontSize: 14 }}>
                        {keys} key{keys === 1 ? '' : 's'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminDrawer
        open={open}
        onOpenChange={setOpen}
        title={editing ? `Edit ${PAGE_LABELS[editing.slug] ?? editing.slug}` : 'Edit page'}
        footer={
          <>
            <span />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => setOpen(false)} disabled={pending} className="btn btn-ghost btn-sm">
                Cancel
              </button>
              <button type="button" onClick={onSave} disabled={pending} className="btn btn-primary btn-sm">
                {pending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.55 }}>
            Edit the JSON below. Every leaf object with <code style={{ fontFamily: 'var(--font-mono)' }}>{'{ en, ka }'}</code> is treated as a bilingual string by the public renderer.
          </p>
          <textarea
            className="textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            spellCheck={false}
            style={{
              minHeight: 480,
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              lineHeight: 1.55,
              resize: 'vertical',
            }}
          />
          {error && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
        </div>
      </AdminDrawer>
    </>
  );
}
