'use client';

import { useState, type FormEvent } from 'react';
import { Field } from '@/components/forms/Field';
import { t } from '@/content/static';
import type { Locale } from '@/i18n/routing';

type Errors = Partial<Record<'name' | 'email' | 'cover' | 'submit', string | true>>;

/**
 * Apply-for-role form. POSTs multipart to /api/applications so a CV file
 * can be attached. The server uploads the file via lib/blob, inserts the
 * row, then sends notification + confirmation emails (lib/email).
 *
 * Validation mirrors the prototype: name required; email required +
 * matches /.+@.+\..+/; cover ≥ 20 chars.
 */
export function ApplyForm({ lang, jobSlug }: { lang: Locale; jobSlug: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => (form.get(k) as string) ?? '';

    const errs: Errors = {};
    if (!get('name')) errs.name = true;
    if (!get('email') || !/.+@.+\..+/.test(get('email'))) errs.email = true;
    if (!get('cover') || get('cover').length < 20) errs.cover = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    form.set('job_slug', jobSlug);
    setPending(true);
    try {
      const res = await fetch('/api/applications', { method: 'POST', body: form });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        setSubmitted(true);
      } else if (json.error === 'database_not_configured') {
        setErrors({ submit: lang === 'en'
          ? 'Backend not configured yet — set DATABASE_URL in .env.local.'
          : 'სერვერი ჯერ არ არის კონფიგურირებული.' });
      } else if (json.error === 'cv_too_large') {
        setErrors({ submit: lang === 'en' ? 'CV file is too large (10MB max).' : 'CV ფაილი ძალიან დიდია (მაქს. 10MB).' });
      } else {
        setErrors({ submit: lang === 'en' ? 'Submission failed. Email careers@softgen.ge.' : 'გაგზავნა ვერ მოხერხდა.' });
      }
    } catch {
      setErrors({ submit: lang === 'en' ? 'Network error. Try again.' : 'ქსელის შეცდომა.' });
    } finally {
      setPending(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          padding: 24,
          background: 'var(--primary-soft)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div
          style={{
            color: 'var(--primary)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          ✓ {t(lang, 'careers.apply.fields.success')}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }} encType="multipart/form-data">
      <Field name="name" type="text" label={t(lang, 'careers.apply.fields.name')} error={!!errors.name} required />
      <Field name="email" type="email" label={t(lang, 'careers.apply.fields.email')} error={!!errors.email} required />
      <Field name="phone" type="tel" label={t(lang, 'careers.apply.fields.phone')} />
      <Field name="cv_url" type="url" label={t(lang, 'careers.apply.fields.cv')} />
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
          {lang === 'en' ? 'Or upload PDF/DOC (≤ 10MB)' : 'ან ატვირთე PDF/DOC (≤ 10MB)'}
        </span>
        <input
          type="file"
          name="cv"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          style={{
            font: 'inherit',
            color: 'var(--text-secondary)',
            padding: '8px 0',
          }}
        />
      </label>
      <Field name="cover" type="textarea" label={t(lang, 'careers.apply.fields.cover')} error={!!errors.cover} required />
      {errors.submit && (
        <div style={{ color: 'var(--danger)', fontSize: 14 }}>{String(errors.submit)}</div>
      )}
      <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 8 }} disabled={pending}>
        {pending
          ? (lang === 'en' ? 'Sending…' : 'იგზავნება…')
          : t(lang, 'careers.apply.fields.submit')}
      </button>
    </form>
  );
}
