'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDrawer } from './AdminDrawer';
import { BilingualField } from './BilingualField';
import { AdminSelect } from './AdminSelect';
import { ToggleField } from './Toggle';
import { FileUpload } from './FileUpload';
import { TipTapEditor } from './TipTapEditor';
import { saveArticle, deleteArticle, type ArticleInput } from '@/app/admin/news/actions';
import type { Bi } from '@/content/static';

const EMPTY_BI: Bi = { en: '', ka: '' };
const EMPTY_DOC = { type: 'doc', content: [] } as const;
const CATEGORIES = ['engineering', 'company', 'security', 'case'] as const;
const ACCENTS = ['indigo', 'violet', 'plum'] as const;

export type ExistingArticle = {
  id: string;
  slug: string;
  category: string;
  title: unknown;
  excerpt: unknown;
  body: unknown;
  authorName: string | null;
  readTime: number | null;
  date: string | null;
  coverUrl: string | null;
  accent: string | null;
  featured: boolean;
  published: boolean;
};

function asBi(v: unknown): Bi {
  if (v && typeof v === 'object' && 'en' in v && 'ka' in v) {
    return { en: String((v as Bi).en ?? ''), ka: String((v as Bi).ka ?? '') };
  }
  return { ...EMPTY_BI };
}

function countWords(doc: unknown): number {
  if (!doc || typeof doc !== 'object') return 0;
  let n = 0;
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    const o = node as { type?: string; text?: string; content?: unknown[] };
    if (o.text) n += o.text.trim().split(/\s+/).filter(Boolean).length;
    if (Array.isArray(o.content)) o.content.forEach(walk);
  };
  walk(doc);
  return n;
}

export function ArticleDrawer({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: ExistingArticle | null;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<string>('engineering');
  const [title, setTitle] = useState<Bi>(EMPTY_BI);
  const [excerpt, setExcerpt] = useState<Bi>(EMPTY_BI);
  const [bodyEn, setBodyEn] = useState<object>(EMPTY_DOC);
  const [bodyKa, setBodyKa] = useState<object>(EMPTY_DOC);
  const [bodyTab, setBodyTab] = useState<'en' | 'ka'>('en');
  const [authorName, setAuthorName] = useState('');
  const [readTime, setReadTime] = useState<number>(5);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [accent, setAccent] = useState<string>('indigo');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setSlug(initial.slug);
      setCategory(initial.category);
      setTitle(asBi(initial.title));
      setExcerpt(asBi(initial.excerpt));
      const b = (initial.body as { en?: object; ka?: object } | null) ?? null;
      setBodyEn((b?.en as object) ?? EMPTY_DOC);
      setBodyKa((b?.ka as object) ?? EMPTY_DOC);
      setBodyTab('en');
      setAuthorName(initial.authorName ?? '');
      setReadTime(initial.readTime ?? 5);
      setDate(initial.date ?? new Date().toISOString().slice(0, 10));
      setCoverUrl(initial.coverUrl);
      setAccent(initial.accent ?? 'indigo');
      setFeatured(initial.featured);
      setPublished(initial.published);
    } else {
      setSlug('');
      setCategory('engineering');
      setTitle({ ...EMPTY_BI });
      setExcerpt({ ...EMPTY_BI });
      setBodyEn(EMPTY_DOC);
      setBodyKa(EMPTY_DOC);
      setBodyTab('en');
      setAuthorName('');
      setReadTime(5);
      setDate(new Date().toISOString().slice(0, 10));
      setCoverUrl(null);
      setAccent('indigo');
      setFeatured(false);
      setPublished(false);
    }
    setError(null);
  }, [open, initial]);

  const suggestReadTime = () => {
    // ~200 wpm reading speed, take EN body as the canonical source.
    const words = countWords(bodyEn);
    const min = Math.max(1, Math.round(words / 200));
    setReadTime(min);
  };

  const onSave = () => {
    setError(null);
    const payload: ArticleInput = {
      id: initial?.id,
      slug,
      category,
      title,
      excerpt: excerpt.en || excerpt.ka ? excerpt : null,
      body: { en: bodyEn, ka: bodyKa },
      authorName: authorName.trim() || null,
      readTime,
      date,
      coverUrl,
      accent,
      featured,
      published,
    };
    start(async () => {
      const r = await saveArticle(payload);
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
      await deleteArticle(initial.id);
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <AdminDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? 'Edit article' : 'New article'}
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
            <button type="button" onClick={() => onOpenChange(false)} disabled={pending} className="btn btn-ghost btn-sm">
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
            options={CATEGORIES.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
            required
          />
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Date
            </span>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Author
            </span>
            <input className="input" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>Read time (min)</span>
              <button
                type="button"
                onClick={suggestReadTime}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 12,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Auto-suggest
              </button>
            </span>
            <input
              className="input"
              type="number"
              min={1}
              value={readTime}
              onChange={(e) => setReadTime(parseInt(e.target.value, 10) || 1)}
            />
          </label>
        </div>

        <BilingualField label="Excerpt" value={excerpt} onChange={setExcerpt} type="textarea" rows={3} />

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
          <div />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
            Cover image
          </span>
          <FileUpload value={coverUrl} onChange={setCoverUrl} folder="articles" maxMB={4} />
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
          <ToggleField label="Featured" hint="Show as the wide hero on /news" pressed={featured} onPressedChange={setFeatured} />
          <ToggleField label="Published" hint="Visible on the public site" pressed={published} onPressedChange={setPublished} />
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
