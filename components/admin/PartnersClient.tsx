'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import { AdminDrawer } from './AdminDrawer';
import { FileUpload } from './FileUpload';
import { savePartner, deletePartner, movePartner, type PartnerInput } from '@/app/admin/partners/actions';

export type ExistingPartner = {
  id: string;
  name: string;
  logoUrl: string | null;
  displayOrder: number;
};

export function PartnersClient({ rows }: { rows: ExistingPartner[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ExistingPartner | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.name);
      setLogoUrl(editing.logoUrl);
    } else {
      setName('');
      setLogoUrl(null);
    }
    setError(null);
  }, [open, editing]);

  const onSave = () => {
    setError(null);
    const payload: PartnerInput = {
      id: editing?.id,
      name,
      logoUrl,
      displayOrder: editing?.displayOrder ?? rows.length,
    };
    start(async () => {
      const r = await savePartner(payload);
      if (r.ok) {
        setOpen(false);
        router.refresh();
      } else setError(r.error ?? 'save_failed');
    });
  };

  const onDelete = () => {
    if (!editing?.id) return;
    if (!window.confirm(`Remove ${editing.name}?`)) return;
    start(async () => {
      await deletePartner(editing.id);
      setOpen(false);
      router.refresh();
    });
  };

  const move = (id: string, direction: 'up' | 'down') => {
    start(async () => {
      await movePartner(id, direction);
      router.refresh();
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
          justifyContent: 'space-between',
          padding: '0 32px',
        }}
      >
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em', margin: 0 }}>
          Partners
        </h1>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="btn btn-primary btn-sm"
        >
          <Plus size={14} />
          Add partner
        </button>
      </div>

      <div style={{ padding: 32 }}>
        {rows.length === 0 ? (
          <div className="card" style={{ padding: 64, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No partners yet.
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  {['Order', 'Logo', 'Name', ''].map((h) => (
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
                {rows.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border)', height: 60 }}>
                    <td style={{ padding: '0 16px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontSize: 13 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {r.displayOrder}
                        <button
                          type="button"
                          onClick={() => move(r.id, 'up')}
                          disabled={pending || i === 0}
                          aria-label="Move up"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-tertiary)',
                            padding: 2,
                            cursor: i === 0 ? 'not-allowed' : 'pointer',
                            opacity: i === 0 ? 0.3 : 1,
                          }}
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(r.id, 'down')}
                          disabled={pending || i === rows.length - 1}
                          aria-label="Move down"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-tertiary)',
                            padding: 2,
                            cursor: i === rows.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: i === rows.length - 1 ? 0.3 : 1,
                          }}
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '0 16px' }}>
                      {r.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.logoUrl}
                          alt={r.name}
                          style={{ height: 28, maxWidth: 120, objectFit: 'contain' }}
                        />
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                          (no logo)
                        </span>
                      )}
                    </td>
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
                        {r.name}
                      </button>
                    </td>
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminDrawer
        open={open}
        onOpenChange={setOpen}
        title={editing ? `Edit ${editing.name}` : 'Add partner'}
        footer={
          <>
            {editing ? (
              <button
                type="button"
                onClick={onDelete}
                disabled={pending}
                style={{
                  background: 'transparent',
                  border: '1px solid transparent',
                  color: 'var(--danger)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 14,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            ) : (
              <span />
            )}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Name<span style={{ color: 'var(--danger)', marginLeft: 4 }}>*</span>
            </span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Logo (PNG/SVG)
            </span>
            <FileUpload
              value={logoUrl}
              onChange={setLogoUrl}
              folder="partners"
              accept="image/png,image/svg+xml,image/webp"
              maxMB={1}
            />
          </div>
          {error && <div style={{ padding: 12, color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
        </div>
      </AdminDrawer>
    </>
  );
}
