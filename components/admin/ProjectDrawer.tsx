'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDrawer } from './AdminDrawer';
import { BilingualField } from './BilingualField';
import { AdminSelect } from './AdminSelect';
import { ToggleField } from './Toggle';
import { FileUpload } from './FileUpload';
import { TagsInput } from './TagsInput';
import { TipTapEditor } from './TipTapEditor';
import { saveProject, deleteProject, type ProjectInput } from '@/app/admin/projects/actions';
import type { Bi } from '@/content/static';

const EMPTY_BI: Bi = { en: '', ka: '' };
const EMPTY_DOC = { type: 'doc', content: [] } as const;

const CATEGORIES = ['FinTech', 'Government', 'Security', 'Enterprise'] as const;
const ACCENTS = ['indigo', 'violet', 'plum'] as const;
const COVER_STYLES = ['dashboard', 'network', 'ledger', 'identity', 'workflow'] as const;

export type ExistingProject = {
  id: string;
  slug: string;
  title: unknown;
  category: string;
  year: number;
  client: string | null;
  duration: unknown;
  scope: unknown;
  team: string | null;
  summary: unknown;
  body: unknown;
  coverUrl: string | null;
  accent: string | null;
  coverStyle: string | null;
  tags: string[] | null;
  featured: boolean;
  published: boolean;
};

function asBi(v: unknown): Bi {
  if (v && typeof v === 'object' && 'en' in v && 'ka' in v) {
    return { en: String((v as Bi).en ?? ''), ka: String((v as Bi).ka ?? '') };
  }
  return { ...EMPTY_BI };
}

export function ProjectDrawer({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: ExistingProject | null; // null → create mode
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form state — reset whenever the drawer opens for a different row.
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState<Bi>(EMPTY_BI);
  const [category, setCategory] = useState<string>('FinTech');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [client, setClient] = useState('');
  const [duration, setDuration] = useState<Bi>(EMPTY_BI);
  const [scope, setScope] = useState<Bi>(EMPTY_BI);
  const [team, setTeam] = useState('');
  const [summary, setSummary] = useState<Bi>(EMPTY_BI);
  const [bodyEn, setBodyEn] = useState<object>(EMPTY_DOC);
  const [bodyKa, setBodyKa] = useState<object>(EMPTY_DOC);
  const [bodyTab, setBodyTab] = useState<'en' | 'ka'>('en');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [accent, setAccent] = useState<string>('indigo');
  const [coverStyle, setCoverStyle] = useState<string>('dashboard');
  const [tags, setTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setSlug(initial.slug);
      setTitle(asBi(initial.title));
      setCategory(initial.category);
      setYear(initial.year);
      setClient(initial.client ?? '');
      setDuration(asBi(initial.duration));
      setScope(asBi(initial.scope));
      setTeam(initial.team ?? '');
      setSummary(asBi(initial.summary));
      const b = (initial.body as { en?: object; ka?: object } | null) ?? null;
      setBodyEn((b?.en as object) ?? EMPTY_DOC);
      setBodyKa((b?.ka as object) ?? EMPTY_DOC);
      setBodyTab('en');
      setCoverUrl(initial.coverUrl);
      setAccent(initial.accent ?? 'indigo');
      setCoverStyle(initial.coverStyle ?? 'dashboard');
      setTags(initial.tags ?? []);
      setFeatured(initial.featured);
      setPublished(initial.published);
    } else {
      setSlug('');
      setTitle({ ...EMPTY_BI });
      setCategory('FinTech');
      setYear(new Date().getFullYear());
      setClient('');
      setDuration({ ...EMPTY_BI });
      setScope({ ...EMPTY_BI });
      setTeam('');
      setSummary({ ...EMPTY_BI });
      setBodyEn(EMPTY_DOC);
      setBodyKa(EMPTY_DOC);
      setBodyTab('en');
      setCoverUrl(null);
      setAccent('indigo');
      setCoverStyle('dashboard');
      setTags([]);
      setFeatured(false);
      setPublished(false);
    }
    setError(null);
  }, [open, initial]);

  const onSave = () => {
    setError(null);
    const payload: ProjectInput = {
      id: initial?.id,
      slug,
      title,
      category,
      year,
      client: client.trim() || null,
      duration: duration.en || duration.ka ? duration : null,
      scope: scope.en || scope.ka ? scope : null,
      team: team.trim() || null,
      summary: summary.en || summary.ka ? summary : null,
      body: { en: bodyEn, ka: bodyKa },
      coverUrl,
      accent,
      coverStyle,
      tags,
      featured,
      published,
    };
    start(async () => {
      const r = await saveProject(payload);
      if (r.ok) {
        onOpenChange(false);
        router.refresh();
      } else {
        setError(r.error ?? 'save_failed');
      }
    });
  };

  const onDelete = () => {
    if (!initial?.id) return;
    if (!window.confirm(`Delete "${title.en || initial.slug}"? This cannot be undone.`)) return;
    start(async () => {
      await deleteProject(initial.id);
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <AdminDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? 'Edit project' : 'New project'}
      footer={
        <>
          {initial ? (
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
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={pending}
              className="btn btn-ghost btn-sm"
            >
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
          <input
            className="input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated from title"
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AdminSelect
            label="Category"
            value={category}
            onValueChange={setCategory}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            required
          />
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Year<span style={{ color: 'var(--danger)', marginLeft: 4 }}>*</span>
            </span>
            <input
              className="input"
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10) || new Date().getFullYear())}
            />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Client
            </span>
            <input className="input" value={client} onChange={(e) => setClient(e.target.value)} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Team
            </span>
            <input className="input" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="11 engineers · 2 designers" />
          </label>
        </div>

        <BilingualField label="Duration" value={duration} onChange={setDuration} />
        <BilingualField label="Scope" value={scope} onChange={setScope} />
        <BilingualField label="Summary" value={summary} onChange={setSummary} type="textarea" rows={3} />

        {/* Body — language tabs above the editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Body
            </span>
            <div
              style={{
                display: 'flex',
                padding: 2,
                borderRadius: 999,
                background: 'var(--bg-deep)',
                border: '1px solid var(--border)',
              }}
            >
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AdminSelect
            label="Accent palette"
            value={accent}
            onValueChange={setAccent}
            options={ACCENTS.map((a) => ({ value: a, label: a }))}
          />
          <AdminSelect
            label="Cover style"
            value={coverStyle}
            onValueChange={setCoverStyle}
            options={COVER_STYLES.map((s) => ({ value: s, label: s }))}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          <TagsInput label="Tags" value={tags} onChange={setTags} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
            Cover image
          </span>
          <FileUpload value={coverUrl} onChange={setCoverUrl} folder="projects" maxMB={4} />
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
          <ToggleField
            label="Featured on home"
            hint="Show in the Featured Projects band"
            pressed={featured}
            onPressedChange={setFeatured}
          />
          <ToggleField
            label="Published"
            hint="Visible on the public site"
            pressed={published}
            onPressedChange={setPublished}
          />
        </div>

        {error && (
          <div
            style={{
              padding: 12,
              border: '1px solid rgba(232, 123, 111, 0.3)',
              background: 'rgba(232, 123, 111, 0.08)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
      </div>
    </AdminDrawer>
  );
}
