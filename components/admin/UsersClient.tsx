'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { AdminDrawer } from './AdminDrawer';
import { AdminSelect } from './AdminSelect';
import { inviteUser, deleteUser, type UserInput } from '@/app/admin/users/actions';

export type ExistingUser = {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'editor';
  createdAt: Date;
};

export function UsersClient({ rows, currentUserId }: { rows: ExistingUser[]; currentUserId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ExistingUser | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'editor'>('editor');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setEmail(editing.email);
      setName(editing.name ?? '');
      setRole(editing.role);
      setPassword('');
    } else {
      setEmail('');
      setName('');
      setRole('editor');
      setPassword('');
    }
    setError(null);
  }, [open, editing]);

  const onSave = () => {
    setError(null);
    const payload: UserInput = {
      id: editing?.id,
      email,
      name: name || null,
      role,
      password: password || undefined,
    };
    start(async () => {
      const r = await inviteUser(payload);
      if (r.ok) {
        setOpen(false);
        router.refresh();
      } else setError(r.error ?? 'save_failed');
    });
  };

  const onDelete = () => {
    if (!editing?.id) return;
    if (editing.id === currentUserId) {
      setError('You cannot delete your own account.');
      return;
    }
    if (!window.confirm(`Delete ${editing.email}?`)) return;
    start(async () => {
      const r = await deleteUser(editing.id);
      if (r.ok) {
        setOpen(false);
        router.refresh();
      } else setError(r.error ?? 'delete_failed');
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, letterSpacing: '-0.02em', margin: 0 }}>
          Users
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
          Invite user
        </button>
      </div>

      <div style={{ padding: 32 }}>
        {rows.length === 0 ? (
          <div className="card" style={{ padding: 64, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No users yet.
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  {['Email', 'Name', 'Role', 'Created'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
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
                        {r.email}
                        {r.id === currentUserId && (
                          <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                            (you)
                          </span>
                        )}
                      </button>
                    </td>
                    <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontSize: 14 }}>{r.name ?? '—'}</td>
                    <td style={{ padding: '0 16px', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.role}</td>
                    <td style={{ padding: '0 16px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {new Date(r.createdAt).toISOString().slice(0, 10)}
                    </td>
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
        title={editing ? `Edit ${editing.email}` : 'Invite user'}
        footer={
          <>
            {editing && editing.id !== currentUserId ? (
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
                {pending ? 'Saving…' : editing ? 'Save changes' : 'Invite'}
              </button>
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Email<span style={{ color: 'var(--danger)', marginLeft: 4 }}>*</span>
            </span>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Name
            </span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <AdminSelect
            label="Role"
            value={role}
            onValueChange={(v) => setRole(v as 'admin' | 'editor')}
            options={[
              { value: 'admin', label: 'Admin (full access)' },
              { value: 'editor', label: 'Editor (content only)' },
            ]}
            required
          />
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Password{!editing && <span style={{ color: 'var(--danger)', marginLeft: 4 }}>*</span>}
            </span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={editing ? 'Leave blank to keep current' : 'Min 8 characters'}
              autoComplete="new-password"
            />
          </label>
          {error && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
        </div>
      </AdminDrawer>
    </>
  );
}
