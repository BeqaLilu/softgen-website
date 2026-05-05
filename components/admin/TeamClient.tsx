'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { AdminDrawer } from './AdminDrawer';
import { BilingualField } from './BilingualField';
import { ToggleField } from './Toggle';
import { FileUpload } from './FileUpload';
import { saveTeamMember, deleteTeamMember, type TeamInput } from '@/app/admin/team/actions';
import type { Bi } from '@/content/static';

const EMPTY_BI: Bi = { en: '', ka: '' };

export type ExistingTeam = {
  id: string;
  name: string;
  role: unknown;
  since: number | null;
  bio: unknown;
  avatarUrl: string | null;
  displayOrder: number;
  visible: boolean;
};

function asBi(v: unknown): Bi {
  if (v && typeof v === 'object' && 'en' in v && 'ka' in v) {
    return { en: String((v as Bi).en ?? ''), ka: String((v as Bi).ka ?? '') };
  }
  return { ...EMPTY_BI };
}

export function TeamClient({ rows }: { rows: ExistingTeam[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ExistingTeam | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState<Bi>(EMPTY_BI);
  const [since, setSince] = useState<number>(2025);
  const [bio, setBio] = useState<Bi>(EMPTY_BI);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.name);
      setRole(asBi(editing.role));
      setSince(editing.since ?? new Date().getFullYear());
      setBio(asBi(editing.bio));
      setAvatarUrl(editing.avatarUrl);
      setDisplayOrder(editing.displayOrder);
      setVisible(editing.visible);
    } else {
      setName('');
      setRole({ ...EMPTY_BI });
      setSince(new Date().getFullYear());
      setBio({ ...EMPTY_BI });
      setAvatarUrl(null);
      setDisplayOrder(rows.length);
      setVisible(true);
    }
    setError(null);
  }, [open, editing, rows.length]);

  const onSave = () => {
    setError(null);
    const payload: TeamInput = {
      id: editing?.id,
      name,
      role,
      since,
      bio: bio.en || bio.ka ? bio : null,
      avatarUrl,
      displayOrder,
      visible,
    };
    start(async () => {
      const r = await saveTeamMember(payload);
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
      await deleteTeamMember(editing.id);
      setOpen(false);
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
          Team
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
          Add member
        </button>
      </div>

      <div style={{ padding: 32 }}>
        {rows.length === 0 ? (
          <div className="card" style={{ padding: 64, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No team members yet.
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  {['Name', 'Role', 'Since', 'Order', 'Visible'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const ro = r.role as { en?: string; ka?: string } | null;
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border)', height: 60 }}>
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
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontSize: 14 }}>{ro?.en ?? '—'}</td>
                      <td style={{ padding: '0 16px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        {r.since ?? '—'}
                      </td>
                      <td style={{ padding: '0 16px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        {r.displayOrder}
                      </td>
                      <td style={{ padding: '0 16px', color: 'var(--text-tertiary)', fontSize: 13 }}>
                        {r.visible ? 'Yes' : 'No'}
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
        title={editing ? `Edit ${editing.name}` : 'Add team member'}
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
          <BilingualField label="Role" value={role} onChange={setRole} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
                Since (year)
              </span>
              <input
                className="input"
                type="number"
                value={since}
                onChange={(e) => setSince(parseInt(e.target.value, 10) || new Date().getFullYear())}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
                Display order
              </span>
              <input
                className="input"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
              />
            </label>
          </div>
          <BilingualField label="Bio" value={bio} onChange={setBio} type="textarea" rows={4} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Avatar
            </span>
            <FileUpload value={avatarUrl} onChange={setAvatarUrl} folder="team" maxMB={2} />
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
            <ToggleField label="Visible on /about" pressed={visible} onPressedChange={setVisible} />
          </div>
          {error && <div style={{ padding: 12, color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
        </div>
      </AdminDrawer>
    </>
  );
}
