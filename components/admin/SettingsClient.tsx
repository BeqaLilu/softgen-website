'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { BilingualField } from './BilingualField';
import { saveSettings } from '@/app/admin/settings/actions';
import type { SiteSettings } from '@/app/admin/settings/schema';

export function SettingsClient({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<boolean>(false);
  const [s, setS] = useState<SiteSettings>(initial);

  const setG = (k: keyof SiteSettings['general'], v: string) =>
    setS((prev) => ({ ...prev, general: { ...prev.general, [k]: v } }));
  const setI = (k: keyof SiteSettings['integrations'], v: string) =>
    setS((prev) => ({ ...prev, integrations: { ...prev.integrations, [k]: v } }));

  const onSave = () => {
    setError(null);
    setSaved(false);
    start(async () => {
      try {
        await saveSettings(s);
        setSaved(true);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'save_failed');
      }
    });
  };

  const txt = (label: string, value: string, on: (v: string) => void, hint?: string) => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <input className="input" value={value} onChange={(e) => on(e.target.value)} />
      {hint && <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>{hint}</span>}
    </label>
  );

  return (
    <div style={{ padding: 32, maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* General */}
      <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <header>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, marginBottom: 4 }}>General</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Company info and contact channels.</p>
        </header>
        {txt('Company name', s.general.companyName, (v) => setG('companyName', v))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {txt('Contact email', s.general.contactEmail, (v) => setG('contactEmail', v))}
          {txt('On-call phone', s.general.onCallPhone, (v) => setG('onCallPhone', v))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {txt('Sales notify-to', s.general.salesEmail, (v) => setG('salesEmail', v), 'Used by /api/leads')}
          {txt('Careers notify-to', s.general.careersEmail, (v) => setG('careersEmail', v), 'Used by /api/applications')}
        </div>
      </section>

      {/* SEO */}
      <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <header>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, marginBottom: 4 }}>SEO defaults</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Used when a page does not provide its own title or description.</p>
        </header>
        <BilingualField
          label="Default title"
          value={s.seo.defaultTitle}
          onChange={(v) => setS({ ...s, seo: { ...s.seo, defaultTitle: v } })}
        />
        <BilingualField
          label="Default description"
          value={s.seo.defaultDescription}
          onChange={(v) => setS({ ...s, seo: { ...s.seo, defaultDescription: v } })}
          type="textarea"
          rows={3}
        />
        {txt(
          'Default OG image URL',
          s.seo.defaultOgImageUrl,
          (v) => setS({ ...s, seo: { ...s.seo, defaultOgImageUrl: v } }),
          'Absolute URL — appears in Twitter/Facebook share cards'
        )}
      </section>

      {/* Integrations */}
      <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <header>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, marginBottom: 4 }}>Integrations</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            API keys (RESEND_API_KEY, BLOB_READ_WRITE_TOKEN, etc.) live in env vars, not here. This is for non-secret config only.
          </p>
        </header>
        {txt(
          'Google Analytics ID',
          s.integrations.googleAnalyticsId,
          (v) => setI('googleAnalyticsId', v),
          'e.g. G-XXXXXXXXXX'
        )}
        {txt('Email "From" header', s.integrations.smtpFrom, (v) => setI('smtpFrom', v), 'Display-name + address used by Resend')}
      </section>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end' }}>
        {saved && <span style={{ color: 'var(--primary)', fontSize: 13 }}>Saved.</span>}
        {error && <span style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</span>}
        <button type="button" onClick={onSave} disabled={pending} className="btn btn-primary">
          {pending ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </div>
  );
}
