'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { AdminDrawer } from './AdminDrawer';
import { BilingualField } from './BilingualField';
import { AdminSelect } from './AdminSelect';
import { ToggleField } from './Toggle';
import { TipTapEditor } from './TipTapEditor';
import { saveJob, deleteJob, type JobInput } from '@/app/admin/jobs/actions';
import type { Bi } from '@/content/static';

const EMPTY_BI: Bi = { en: '', ka: '' };
const EMPTY_DOC = { type: 'doc', content: [] } as const;
const DEPTS = ['Engineering', 'Design', 'Operations'] as const;
const TYPES = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
] as const;

export type ExistingJob = {
  id: string;
  slug: string;
  title: unknown;
  department: string;
  type: string;
  location: string | null;
  description: unknown;
  body: unknown;
  open: boolean;
};

function asBi(v: unknown): Bi {
  if (v && typeof v === 'object' && 'en' in v && 'ka' in v) {
    return { en: String((v as Bi).en ?? ''), ka: String((v as Bi).ka ?? '') };
  }
  return { ...EMPTY_BI };
}

export function JobsClient({ rows }: { rows: ExistingJob[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ExistingJob | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState<Bi>(EMPTY_BI);
  const [department, setDepartment] = useState<string>('Engineering');
  const [type, setType] = useState<string>('full_time');
  const [location, setLocation] = useState('Tbilisi');
  const [description, setDescription] = useState<Bi>(EMPTY_BI);
  const [bodyEn, setBodyEn] = useState<object>(EMPTY_DOC);
  const [bodyKa, setBodyKa] = useState<object>(EMPTY_DOC);
  const [bodyTab, setBodyTab] = useState<'en' | 'ka'>('en');
  const [openFlag, setOpenFlag] = useState(true);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setSlug(editing.slug);
      setTitle(asBi(editing.title));
      setDepartment(editing.department);
      setType(editing.type);
      setLocation(editing.location ?? '');
      setDescription(asBi(editing.description));
      const b = (editing.body as { en?: object; ka?: object } | null) ?? null;
      setBodyEn((b?.en as object) ?? EMPTY_DOC);
      setBodyKa((b?.ka as object) ?? EMPTY_DOC);
      setBodyTab('en');
      setOpenFlag(editing.open);
    } else {
      setSlug('');
      setTitle({ ...EMPTY_BI });
      setDepartment('Engineering');
      setType('full_time');
      setLocation('Tbilisi');
      setDescription({ ...EMPTY_BI });
      setBodyEn(EMPTY_DOC);
      setBodyKa(EMPTY_DOC);
      setBodyTab('en');
      setOpenFlag(true);
    }
    setError(null);
  }, [open, editing]);

  const onSave = () => {
    setError(null);
    const payload: JobInput = {
      id: editing?.id,
      slug,
      title,
      department,
      type,
      location,
      description: description.en || description.ka ? description : null,
      body: { en: bodyEn, ka: bodyKa },
      open: openFlag,
    };
    start(async () => {
      const r = await saveJob(payload);
      if (r.ok) {
        setOpen(false);
        router.refresh();
      } else setError(r.error ?? 'save_failed');
    });
  };

  const onDelete = () => {
    if (!editing?.id) return;
    if (!window.confirm(`Close & delete "${title.en || editing.slug}"?`)) return;
    start(async () => {
      await deleteJob(editing.id);
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
          Jobs
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
          New job
        </button>
      </div>

      <div style={{ padding: 32 }}>
        {rows.length === 0 ? (
          <div className="card" style={{ padding: 64, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No jobs yet.
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  {['Title', 'Dept', 'Type', 'Location', 'Open'].map((h) => (
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
                  const t = r.title as { en?: string } | null;
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
                          {t?.en ?? r.slug}
                        </button>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{r.slug}</div>
                      </td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontSize: 14 }}>{r.department}</td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontSize: 14 }}>{r.type}</td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontSize: 14 }}>{r.location ?? '—'}</td>
                      <td style={{ padding: '0 16px', color: r.open ? 'var(--primary)' : 'var(--text-tertiary)', fontSize: 14 }}>
                        {r.open ? 'Open' : 'Closed'}
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
        title={editing ? 'Edit job' : 'New job'}
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
          <BilingualField label="Title" value={title} onChange={setTitle} required />

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Slug
            </span>
            <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated from title" />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <AdminSelect
              label="Department"
              value={department}
              onValueChange={setDepartment}
              options={DEPTS.map((d) => ({ value: d, label: d }))}
              required
            />
            <AdminSelect
              label="Type"
              value={type}
              onValueChange={setType}
              options={[...TYPES]}
              required
            />
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
                Location
              </span>
              <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
            </label>
          </div>

          <BilingualField label="Description" value={description} onChange={setDescription} type="textarea" rows={3} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
                Long-form description
              </span>
              <div style={{ display: 'flex', padding: 2, borderRadius: 999, background: 'var(--bg-deep)', border: '1px solid var(--border)' }}>
                {(['en', 'ka'] as const).map((s) => {
                  const active = bodyTab === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setBodyTab(s)}
                      style={{
                        padding: '3px 9px',
                        borderRadius: 999,
                        border: 'none',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        fontSize: 11,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        background: active ? 'var(--surface)' : 'transparent',
                        color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                        cursor: 'pointer',
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
            {bodyTab === 'en' ? (
              <TipTapEditor value={bodyEn} onChange={setBodyEn} uploadFolder="editor" />
            ) : (
              <TipTapEditor value={bodyKa} onChange={setBodyKa} uploadFolder="editor" />
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
            <ToggleField
              label="Open"
              hint="Listed on the public Careers page"
              pressed={openFlag}
              onPressedChange={setOpenFlag}
            />
          </div>

          {error && <div style={{ padding: 12, color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
        </div>
      </AdminDrawer>
    </>
  );
}
